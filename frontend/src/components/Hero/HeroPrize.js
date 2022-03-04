import { useState } from 'react'
import { ethers } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { useContractLottery, useInterval } from '../../hooks'
import { Flex, Text } from '../Toolkit'

const Container = styled(Flex)`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`

const HeroPrize = () => {
  const theme = useTheme()
  const [prize, setPrize] = useState('0.0')
  const contractLottery = useContractLottery()

  // Check for status before polling prize pool.
  useInterval(() => {
    if (contractLottery !== undefined) {
      contractLottery
        .prizePool()
        .then((prizePool) => {
          setPrize(ethers.utils.formatEther(prizePool))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, 20000)

  return (
    <Container>
      <Text color={theme.colors.action} fontSize="50px">
        $100,000
      </Text>
      <Text color={theme.colors.headline} fontSize="28px">
        in prizes!
      </Text>
    </Container>
  )
}

export default HeroPrize
