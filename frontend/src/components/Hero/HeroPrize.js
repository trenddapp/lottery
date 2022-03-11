import { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useTheme } from 'styled-components'
import { LotteryContext } from '../../store/Lottery'
import { useContractLottery, useInterval } from '../../hooks'
import { Flex, Text } from '../Toolkit'

const HeroPrize = () => {
  const { status } = useContext(LotteryContext)
  const [prize, setPrize] = useState(0)
  const contractLottery = useContractLottery()
  const theme = useTheme()

  // TODO: Check for status before polling prize pool.
  useInterval(() => {
    if (contractLottery === undefined) {
      return
    }

    if (status === 0 || status === 3) {
      return
    }

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
  }, 20000)

  if (status === 0 || status === 3) {
    return (
      <Flex alignItems="center" flexDirection="column" justifyContent="center">
        <Text color={theme.colors.headline} fontSize="38px">
          Next{' '}
          <Text as="span" color={theme.colors.action}>
            Lottery
          </Text>
        </Text>
        <Text color={theme.colors.headline} fontSize="38px">
          Starting Soon!
        </Text>
      </Flex>
    )
  }

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
