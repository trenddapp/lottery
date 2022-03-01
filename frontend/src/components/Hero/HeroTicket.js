import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'
import { useContractLottery } from '../../hooks'

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.action};
  border-radius: ${({ theme }) => theme.radii.small};
  border: none;
  color: ${({ theme }) => theme.colors.background};
  height: 48px;
  margin-top: 24px;
  width: 400px;

  &:hover {
    cursor: pointer;
  }
`

const StyledContainer = styled(Flex)`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 48px;
`

const HeroTicket = () => {
  const [costPerTicket, setCostPerTicket] = useState(ethers.BigNumber.from(0))
  const contractLottery = useContractLottery()
  const theme = useTheme()

  useEffect(() => {
    contractLottery.costPerTicket().then((costPerTicket) => {
      setCostPerTicket(costPerTicket)
    })
  }, [contractLottery])

  return (
    <StyledContainer>
      <Text color={theme.colors.headline}>Ticket Price: {ethers.utils.formatEther(costPerTicket)} ETH</Text>
      <StyledButton>Buy Ticket</StyledButton>
    </StyledContainer>
  )
}

export default HeroTicket
