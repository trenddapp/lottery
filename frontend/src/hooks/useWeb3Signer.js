import useWeb3React from './useWeb3React'

const useWeb3Signer = () => {
  const { usePriorityProvider } = useWeb3React()
  const provider = usePriorityProvider()

  if (provider === undefined) {
    return null
  }

  return provider.getSigner()
}

export default useWeb3Signer
