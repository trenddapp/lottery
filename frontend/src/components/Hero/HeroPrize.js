import { useState } from 'react'
import { ethers } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { useContractLottery, useInterval } from '../../hooks'
import { Flex, Text } from '../Toolkit'

const StyledContainer = styled(Flex)`
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
    contractLottery.prizePool().then((prizePool) => {
      setPrize(ethers.utils.formatEther(prizePool))
    })
  }, 20000)

  return (
    <StyledContainer>
      <Text color={theme.colors.action} fontSize="180%">
        {prize} ETH
      </Text>
      <Text color={theme.colors.headline}>in prizes!</Text>
    </StyledContainer>
  )
}

export default HeroPrize
