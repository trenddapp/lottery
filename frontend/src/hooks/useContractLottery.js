import { useMemo } from 'react'
import { ethers } from 'ethers'
import { abiLottery } from '../config/abi'
import { addressLottery } from '../config/constants'
import useWeb3ChainId from './useWeb3ChainId'
import useWeb3Provider from './useWeb3Provider'

const useContractLottery = (signer) => {
  const abi = abiLottery
  const address = addressLottery[useWeb3ChainId()]
  const provider = useWeb3Provider()

  if (signer === undefined) {
    try {
      return useMemo(() => new ethers.Contract(address, abi, provider), [provider])
    } catch (err) {
      return undefined
    }
  }

  try {
    return useMemo(() => new ethers.Contract(address, abi, signer), [signer])
  } catch (err) {
    return undefined
  }
}

export default useContractLottery
