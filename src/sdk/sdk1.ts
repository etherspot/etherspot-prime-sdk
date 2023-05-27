import { BehaviorSubject } from 'rxjs';
import { State, StateService } from './state';
import { isWalletProvider, WalletProviderLike } from './wallet';
import { SdkOptions } from './interfaces';
import { Network } from "./network";
import { Env } from "./env";
import { Exception, getGasFee } from "./common";
// import { EtherspotWalletAPI, VerifyingPaymasterAPI } from './base';
import { BigNumber, ethers, providers, Wallet } from 'ethers';
import { Networks } from './network/constants';
import { UserOperationStruct } from './contracts/src/aa-4337/core/BaseAccount';
import { EtherspotWalletAPI, HttpRpcClient } from './base';
import { TransactionDetailsForUserOp } from './base/TransactionDetailsForUserOp';
import { CreateSessionDto, SignMessageDto, validateDto } from './dto';
import { Session } from '.';
import { ERC20__factory } from './contracts';

/**
 * Sdk
 *
 * @category Sdk
 */
export class Sdk {

  private EtherspotWallet: EtherspotWalletAPI;
  private bundler: HttpRpcClient;

  constructor(walletProvider: WalletProviderLike, optionsLike: SdkOptions) {

    if (!isWalletProvider(walletProvider)) {
      throw new Exception('Invalid wallet provider');
    }

    const env = Env.prepare(optionsLike.env);

    const {
      networkName, //
      rpcProviderUrl,
      bundlerRpcUrl,
    } = optionsLike;


    let provider;

    if (rpcProviderUrl) {
      provider = new providers.JsonRpcProvider(rpcProviderUrl);
    } else provider = new providers.JsonRpcProvider(bundlerRpcUrl);

    this.EtherspotWallet = new EtherspotWalletAPI({
      owner: new Wallet(walletProvider.privateKey, provider),
      provider,
      walletProvider,
      optionsLike,
      entryPointAddress: Networks[networkName].contracts.entryPoint,
      factoryAddress: Networks[networkName].contracts.walletFactory,
      paymasterAPI: null,
    })

    this.bundler = new HttpRpcClient(bundlerRpcUrl, Networks[networkName].contracts.entryPoint, Networks[networkName].chainId);

  }


  // exposes
  get state(): StateService {
    return this.EtherspotWallet.services.stateService;
  }

  get state$(): BehaviorSubject<State> {
    return this.EtherspotWallet.services.stateService.state$;
  }

  get supportedNetworks(): Network[] {
    return this.EtherspotWallet.services.networkService.supportedNetworks;
  }

  /**
   * destroys
   */
  destroy(): void {
    this.EtherspotWallet.context.destroy();
  }

  // wallet

  /**
   * signs message
   * @param dto
   * @return Promise<string>
   */
  async signMessage(dto: SignMessageDto): Promise<string> {
    const { message } = await validateDto(dto, SignMessageDto);

    await this.EtherspotWallet.require({
      network: false,
    });

    return this.EtherspotWallet.services.walletService.signMessage(message);
  }

  // session

  /**
   * creates session
   * @param dto
   * @return Promise<Session>
   */
  async createSession(dto: CreateSessionDto = {}): Promise<Session> {
    const { ttl, fcmToken } = await validateDto(dto, CreateSessionDto);

    await this.EtherspotWallet.require();

    return this.EtherspotWallet.services.sessionService.createSession(ttl, fcmToken);
  }

  async getCounterFactualAddress(): Promise<string> {
    return this.EtherspotWallet.getCounterFactualAddress();
  }


  async prefundIfRequired(amount: string, tokenAddress?: string): Promise<string> {
    try {
      const ewalletAddress = await this.getCounterFactualAddress();

      if (tokenAddress) {
        const token = ethers.utils.getAddress(tokenAddress);
        const erc20Contract = ERC20__factory.connect(token, this.EtherspotWallet.services.walletService.getWalletProvider());
        const dec = await erc20Contract.functions.decimals();
        const approveData = erc20Contract.interface.encodeFunctionData('approve', [this.state.walletAddress, ethers.utils.parseUnits(amount, dec)])
        const transactionData = erc20Contract.interface.encodeFunctionData('transferFrom', [this.state.walletAddress, ewalletAddress, ethers.utils.parseUnits(amount, dec)])
        const balance = await erc20Contract.functions.balanceOf(ewalletAddress)
        if (balance[0].lt(ethers.utils.parseEther(amount))) {
          
          const approvetx = await this.EtherspotWallet.services.walletService.sendTransaction({
            to: tokenAddress, // EtherspotWallet address
            data: approveData, // approval data
            gasLimit: ethers.utils.hexlify(500000),
          });

          await approvetx.wait();
          console.log('approvetx: ', approvetx);

          const tx = await this.EtherspotWallet.services.walletService.sendTransaction({
            to: tokenAddress, // EtherspotWallet address
            data: transactionData, // transferFrom data
            gasLimit: ethers.utils.hexlify(500000),
          });
          await tx.wait();
          return `Transfer successful. Account funded with ${amount} ${await erc20Contract.symbol()}`;
        } else {
          return `Sufficient balance already exists. Current balance is ${ethers.utils.formatEther(
            balance[0],
          )} ${await erc20Contract.symbol()}`;
        }
      } else {
        console.log('address: ', ewalletAddress);
        const balance = await this.EtherspotWallet.provider.getBalance(ewalletAddress);

        // Check if wallet balance is less than the amount to transfer
        if (balance.lt(ethers.utils.parseEther(amount))) {
          // Transfer funds to the wallet
          const tx = await this.EtherspotWallet.services.walletService.sendTransaction({
            to: ewalletAddress, // EtherspotWallet address
            data: '0x', // no data
            value: ethers.utils.parseEther(amount), // 0.1 MATIC
            gasLimit: ethers.utils.hexlify(50000),
          });
          await tx.wait();
          return `Transfer successful. Account funded with ${amount} ${tx}`;
        } else {
          return `Sufficient balance already exists. Current balance is ${ethers.utils.formatEther(balance)}`;
        }
      }
    } catch (e) {
      console.log(e);
      return `Transfer failed: ${e.message}`;
    }
  }

  async sign(tx: TransactionDetailsForUserOp) {
    const gas = await this.getGasFee();

    return this.EtherspotWallet.createSignedUserOp({
      ...tx,
      ...gas,
    });
  }

  async getGasFee() {
    return getGasFee(this.EtherspotWallet.provider as providers.JsonRpcProvider);
  }

  async send(userOp: UserOperationStruct) {
    return this.bundler.sendUserOpToBundler(userOp);
  }

  async getUserOpReceipt(userOpHash: string, timeout = 60000, interval = 5000): Promise<string | null> {
    const block = await this.EtherspotWallet.provider.getBlock('latest');
    const endtime = Date.now() + timeout;
    while (Date.now() < endtime) {
      const events = await this.EtherspotWallet.epView.queryFilter(
        this.EtherspotWallet.epView.filters.UserOperationEvent(userOpHash),
        Math.max(100, block.number - 100),
      );
      if (events.length > 0) {
        console.log(events[0].args.actualGasUsed.toString());
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }

}
