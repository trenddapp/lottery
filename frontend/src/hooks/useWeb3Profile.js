import { useWeb3React } from '.'

const useWeb3Profile = () => {
  const { usePriorityAccount, usePriorityIsActivating, usePriorityIsActive } = useWeb3React()

  return {
    account: usePriorityAccount(),
    isActivating: usePriorityIsActivating(),
    isActive: usePriorityIsActive(),
  }
}

export default useWeb3Profile
