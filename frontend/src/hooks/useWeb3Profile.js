import { useWeb3React } from '.'
import { defaultChainId } from '../config/constants'

const useWeb3Profile = () => {
  const { usePriorityAccount, usePriorityChainId, usePriorityIsActivating, usePriorityIsActive } = useWeb3React()

  return {
    account: usePriorityAccount(),
    isActivating: usePriorityIsActivating(),
    isActive: usePriorityIsActive(),
    isWrongNetwork: usePriorityChainId() !== defaultChainId,
  }
}

export default useWeb3Profile
