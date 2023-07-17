import { BigNumberish, ethers } from 'ethers';

export interface Gas {
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
}

export async function getGasFee(provider: ethers.providers.JsonRpcProvider): Promise<Gas> {
  let fee: any = {};
  try {
    fee = await provider.send('eth_maxPriorityFeePerGas', []);
  } catch (err) {
    console.warn(
      "getGas: eth_maxPriorityFeePerGas failed, falling back to legacy gas price."
    );
    fee = await provider.getGasPrice();
  }
  const block = await provider.getBlock('latest');
  const tip = ethers.BigNumber.from(fee);
  const buffer = tip.div(100).mul(13);
  const maxPriorityFeePerGas = tip.add(buffer);
  const maxFeePerGas =
    block.baseFeePerGas != null ? block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas) : maxPriorityFeePerGas;

  return { maxFeePerGas, maxPriorityFeePerGas };
}
