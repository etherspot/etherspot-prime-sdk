import { BigNumberish, Wallet, ethers, providers } from 'ethers';
import { EtherspotWalletAPI, HttpRpcClient, VerifyingPaymasterAPI } from './base';
import { TransactionDetailsForUserOp } from './base/TransactionDetailsForUserOp';
import { UserOperationStruct } from './contracts/src/aa-4337/core/BaseAccount';
import { getGasFee } from './common';
import { ERC20_ABI } from './helpers/abi/ERC20_ABI';

export class LiteSdk {
  private EtherspotWallet: EtherspotWalletAPI;
  private bundler: HttpRpcClient;
  wallet: Wallet;
  rpcProvider: ethers.providers.JsonRpcProvider;

  constructor(
    private privateKey: string,
    provider: string,
    bundlerRpc: string,
    chainId: number,
    entryPoint: string,
    accountFactory: string,
    paymasterAPI: VerifyingPaymasterAPI | undefined,
  ) {
    this.rpcProvider = new ethers.providers.JsonRpcProvider(provider);
    this.wallet = new Wallet(privateKey, this.rpcProvider);
    this.EtherspotWallet = new EtherspotWalletAPI({
      provider: this.wallet.provider,
      owner: this.wallet,
      index: 0,
      entryPointAddress: entryPoint,
      factoryAddress: accountFactory,
      paymasterAPI: paymasterAPI,
    });
    this.bundler = new HttpRpcClient(bundlerRpc, entryPoint, chainId);
  }

  async getCounterFactualAddress(): Promise<string> {
    return this.EtherspotWallet.getCounterFactualAddress();
  }

  async getUserOpReceipt(userOpHash: string, timeout = 60000, interval = 5000): Promise<string | null> {
    const block = await this.wallet.provider.getBlock('latest');
    const endtime = Date.now() + timeout;
    while (Date.now() < endtime) {
      const events = await this.EtherspotWallet.epView.queryFilter(
        this.EtherspotWallet.epView.filters.UserOperationEvent(userOpHash),
        Math.max(100, block.number - 100),
      );
      if (events.length > 0) {
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  }

  async sign(tx: TransactionDetailsForUserOp) {
    const gas = await this.getGasFee();

    return this.EtherspotWallet.createSignedUserOp({
      ...tx,
      ...gas,
    });
  }

  async getHash(userOp: UserOperationStruct) {
    return this.EtherspotWallet.getUserOpHash(userOp);
  }

  async send(userOp: UserOperationStruct) {
    return this.bundler.sendUserOpToBundler(userOp);
  }

  async getGasFee() {
    return getGasFee(this.wallet.provider as providers.JsonRpcProvider);
  }

  // added below

  async getAccountContract() {
    return this.EtherspotWallet._getAccountContract();
  }

  get epView() {
    return this.EtherspotWallet.epView;
  }

  async encodeExecute(target: string, value: BigNumberish, data: string): Promise<string> {
    const formatTarget = ethers.utils.getAddress(target);
    return await this.EtherspotWallet.encodeExecute(formatTarget, value, data);
  }

  async encodeBatch(targets: string[], datas: string[]): Promise<string> {
    return this.EtherspotWallet.encodeBatch(targets, datas);
  }

  async prefundIfRequired(amount: string, tokenAddress?: string): Promise<string> {
    try {
      const ewalletAddress = await this.getCounterFactualAddress();

      if (tokenAddress) {
        const token = ethers.utils.getAddress(tokenAddress);
        const erc20 = new ethers.Contract(token, ERC20_ABI, this.wallet);
        const dec = await erc20.decimals();
        const balance = await erc20.balanceOf(ewalletAddress);

        if (balance.lt(ethers.utils.parseEther(amount))) {
          const tx = await erc20.transfer(ewalletAddress, ethers.utils.parseUnits(amount, dec));
          await tx.wait();
          return `Transfer successful. Account funded with ${amount} ${await erc20.symbol()}`;
        } else {
          return `Sufficient balance already exists. Current balance is ${ethers.utils.formatEther(
            balance,
          )} ${await erc20.symbol()}`;
        }
      } else {
        const balance = await this.rpcProvider.getBalance(ewalletAddress);
        // Check if wallet balance is less than the amount to transfer
        if (balance.lt(ethers.utils.parseEther(amount))) {
          // Transfer funds to the wallet
          const tx = await this.wallet.sendTransaction({
            to: ewalletAddress, // EtherspotWallet address
            data: '0x', // no data
            value: ethers.utils.parseEther(amount), // 0.1 MATIC
            gasLimit: ethers.utils.hexlify(50000),
          });
          await tx.wait();
          return `Transfer successful. Account funded with ${amount}`;
        } else {
          return `Sufficient balance already exists. Current balance is ${ethers.utils.formatEther(balance)}`;
        }
      }
    } catch (e) {
      console.log(e);
      return `Transfer failed: ${e.message}`;
    }
  }

  async getERC20Instance(tokenAddress: string) {
    const token = ethers.utils.getAddress(tokenAddress);
    return new ethers.Contract(token, ERC20_ABI, this.wallet);
  }

  async erc20Balance(address: string, tokenAddress: string): Promise<BigNumberish> {
    const erc20 = await this.getERC20Instance(tokenAddress);
    return await erc20.balanceOf(address);
  }

  async erc20Approve(spender: string, amount: string, tokenAddress: string): Promise<boolean> {
    const ewalletAddress = await this.getCounterFactualAddress();
    try {
      const erc20 = await this.getERC20Instance(tokenAddress);
      const value = await this.formatAmount(amount, await erc20.decimals());
      const success = await erc20.approve(spender, value, { from: ewalletAddress });
      return success;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  formatAmount(amount: string, decimals = 18): BigNumberish {
    return ethers.utils.parseUnits(amount, decimals);
  }

  parseAmount(amount: string, decimals = 18): string {
    return ethers.utils.formatUnits(amount, decimals);
  }

  async generateBatchExecutesData(
    target: string,
    recipients: string[],
    values: string[],
  ): Promise<{ dest: string[]; data: string[] }> {
    const ac = await this.getAccountContract();
    const dest = Array.from({ length: recipients.length }, () => target);
    const data = await Promise.all(
      recipients.map(async (recipient, i) =>
        ac.interface.encodeFunctionData('execute', [recipient, this.formatAmount(values[i]), '0x']),
      ),
    );

    return { dest, data };
  }

  async generateERC20BatchTransfersData(
    target: string,
    recipients: string[],
    values: string[],
  ): Promise<{ dest: string[]; data: string[] }> {
    const erc20 = await this.getERC20Instance(target);
    const [sym, dec] = await Promise.all([erc20.symbol(), erc20.decimals()]);

    const transferDataPromises = recipients.map((recipient, i) => {
      const transferData = erc20.interface.encodeFunctionData('transfer', [
        recipient,
        this.formatAmount(values[i], dec),
      ]);
      return Promise.resolve(transferData);
    });

    const transferData = await Promise.all(transferDataPromises);

    return {
      dest: Array.from({ length: recipients.length }, () => erc20.address),
      data: transferData,
    };
  }

  async connectToContract(address: string, abi: any) {
    const addr = ethers.utils.getAddress(address);
    return new ethers.Contract(addr, abi, this.wallet);
  }

  async generateUniSingleSwapParams(tokenIn: string, tokenOut: string, value: string) {
    const wallet = await this.getCounterFactualAddress();
    const amount = ethers.utils.parseEther(value);
    const blockNum = await this.rpcProvider.getBlockNumber();
    const timestamp = (await this.rpcProvider.getBlock(blockNum)).timestamp;
    const params = {
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      fee: 500,
      recipient: wallet,
      deadline: timestamp + 1000,
      amountIn: amount,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };
    return params;
  }

  async mintTokenToOwner(tokenAddress: string, amount: string) {
    const erc20 = await this.getERC20Instance(tokenAddress);
    const formatAmount = this.formatAmount(amount, await erc20.decimals());
    await erc20.mint(this.wallet.address, formatAmount);
  }
}
