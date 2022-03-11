import { useWeb3React } from '.'
import { defaultChainId } from '../config/constants'

const useWeb3Profile = () => {
  const { usePriorityAccount, usePriorityChainId, usePriorityIsActivating, usePriorityIsActive } = useWeb3React()

  const priorityAccount = usePriorityAccount()
  const priorityChainId = usePriorityChainId()
  const priorityIsActivating = usePriorityIsActivating()
  const priorityIsActive = usePriorityIsActive()

  let isWrongNetwork = false
  if (priorityChainId !== undefined) {
    isWrongNetwork = priorityChainId !== defaultChainId
  }

  return {
    account: priorityAccount,
    isActivating: priorityIsActivating,
    isActive: priorityIsActive,
    isWrongNetwork: isWrongNetwork,
  }
}

export default useWeb3Profile
