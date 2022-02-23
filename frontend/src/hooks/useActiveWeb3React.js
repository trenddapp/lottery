import { useEffect, useState, useRef } from 'react'
import { getPriorityConnector } from '@web3-react/core'
import { metaMask, metaMaskHooks } from '../config/connectors/metaMask'
import { defaultChainId } from '../config/constants'
import { useRpcProvider } from '.'

const useActiveWeb3React = () => {
  const { usePriorityProvider, usePriorityChainId } = getPriorityConnector([metaMask, metaMaskHooks])

  const chainId = usePriorityChainId() ?? defaultChainId
  const provider = usePriorityProvider()
  const refProvider = useRef(provider)
  const [library, setLibrary] = useState(provider || useRpcProvider())

  useEffect(() => {
    if (provider !== refProvider.current) {
      setLibrary(provider || useRpcProvider())
      refProvider.current = provider
    }
  }, [provider])

  return { library: library, chainId: chainId }
}

export default useActiveWeb3React
