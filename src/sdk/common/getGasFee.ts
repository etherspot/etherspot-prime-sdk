import { BigNumber, BigNumberish, ethers } from 'ethers';
import { bufferPercent } from './constants';

export interface Gas {
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
}

export async function getGasFee(provider: ethers.providers.JsonRpcProvider): Promise<Gas> {
  try {
    const [fee, block] = await provider.send('eth_maxPriorityFeePerGas', []);
    if (BigNumber.from(0).eq(fee)) return { maxFeePerGas: BigNumber.from(1), maxPriorityFeePerGas: BigNumber.from(1) };
    const tip = ethers.BigNumber.from(fee);
    const buffer = tip.div(100).mul(bufferPercent);
    const maxPriorityFeePerGas = tip.add(buffer);
    const maxFeePerGas =
      block.baseFeePerGas != null ? block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas) : maxPriorityFeePerGas;

    return { maxFeePerGas, maxPriorityFeePerGas };
  } catch (err) {
    console.warn(
      "getGas: eth_maxPriorityFeePerGas failed, falling back to legacy gas price."
    );
    const gas = await provider.getGasPrice();
    return { maxFeePerGas: gas, maxPriorityFeePerGas: gas };
  }
}
