import { ethers } from 'ethers'
import { defaultRpcUrl } from '../config/constants'

const rpcProvider = new ethers.providers.StaticJsonRpcProvider(defaultRpcUrl)

const useWeb3Provider = () => {
  return rpcProvider
}

export default useWeb3Provider
