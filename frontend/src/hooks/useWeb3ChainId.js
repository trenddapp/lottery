import { defaultChainId } from '../config/constants'
import useWeb3React from './useWeb3React'

const useWeb3ChainId = () => {
  const { usePriorityChainId } = useWeb3React()
  return usePriorityChainId() ?? defaultChainId
}

export default useWeb3ChainId
