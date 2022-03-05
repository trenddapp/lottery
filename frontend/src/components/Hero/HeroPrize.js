import { useState } from 'react'
import { ethers } from 'ethers'
import { useTheme } from 'styled-components'
import { useContractLottery, useInterval } from '../../hooks'
import { Flex, Text } from '../Toolkit'

const HeroPrize = () => {
  const [prize, setPrize] = useState(0)
  const contractLottery = useContractLottery()
  const theme = useTheme()

  // TODO: Check for status before polling prize pool.
  useInterval(() => {
    if (contractLottery !== undefined) {
      contractLottery
        .prizePool()
        .then((prizePool) => {
          // TODO: Fetch conversion rate from backend.
          const prizeInEth = parseFloat(ethers.utils.formatEther(prizePool))
          const prizeInUsd = prizeInEth * 2000
          setPrize(prizeInUsd)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, 20000)

  return (
    <Flex alignItems="center" flexDirection="column" justifyContent="center">
      <Text color={theme.colors.action} fontSize="50px">
        ${prize === 0 ? '0.00' : prize.toString()}
      </Text>
      <Text color={theme.colors.headline} fontSize="28px">
        in prizes!
      </Text>
    </Flex>
  )
}

export default HeroPrize
