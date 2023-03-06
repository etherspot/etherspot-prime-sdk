import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { hexValue } from 'ethers/lib/utils'
import { UserOperationStruct } from '../contracts'

export class HttpRpcClient {
  private readonly userOpJsonRpcProvider: JsonRpcProvider

  initializing: Promise<void>

  constructor (
    readonly bundlerUrl: string,
    readonly entryPointAddress: string,
    readonly chainId: number
  ) {
    this.userOpJsonRpcProvider = new ethers.providers.JsonRpcProvider(this.bundlerUrl, {
      name: 'Connected bundler network',
      chainId
    })
    this.initializing = this.validateChainId()
  }

  async validateChainId (): Promise<void> {
    // validate chainId is in sync with expected chainid
    const chain = await this.userOpJsonRpcProvider.send('eth_chainId', [])
    const bundlerChain = parseInt(chain)
    if (bundlerChain !== this.chainId) {
      throw new Error(`bundler ${this.bundlerUrl} is on chainId ${bundlerChain}, but provider is on chainId ${this.chainId}`)
    }
  }

  private hexifyUserOp (userOp: UserOperationStruct): any {
    const hexifiedUserOp: any =
      Object.keys(userOp)
        .map(key => {
          let val = (userOp as any)[key]
          if (typeof val !== 'string' || !val.startsWith('0x')) {
            val = hexValue(val)
          }
          return [key, val]
        })
        .reduce((set, [k, v]) => ({
          ...set,
          [k]: v
        }), {})
    return hexifiedUserOp
  }

  /**
   * send a UserOperation to the bundler
   * @param userOp1
   * @return userOpHash the id of this operation, for getUserOperationTransaction
   */
  async sendUserOpToBundler (userOp: UserOperationStruct): Promise<string> {
    await this.initializing
    const hexifiedUserOp = this.hexifyUserOp(userOp)
    return await this.userOpJsonRpcProvider
      .send('eth_sendUserOperation', [hexifiedUserOp, this.entryPointAddress])
  }

  async sendAggregatedOpsToBundler (userOps1: UserOperationStruct[]): Promise<string> {
    const hexifiedUserOps = await Promise.all(
      userOps1.map(async userOp1 => await this.hexifyUserOp(userOp1))
    )
    return await this.userOpJsonRpcProvider
      .send('eth_sendAggregatedUserOperation', [hexifiedUserOps, this.entryPointAddress])
  }
}
