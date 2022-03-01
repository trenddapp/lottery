import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'
import { useContractLottery, useWeb3Signer } from '../../hooks'

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
  const [costPerTicket, setCostPerTicket] = useState('0')
  const signer = useWeb3Signer()
  const contractLottery = useContractLottery(signer)
  const theme = useTheme()

  const buyTicketHandler = () => {
    contractLottery
      .buyTicket({
        value: ethers.utils.parseEther(costPerTicket),
      })
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    contractLottery
      .costPerTicket()
      .then((costPerTicket) => {
        setCostPerTicket(ethers.utils.formatEther(costPerTicket))
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <StyledContainer>
      <Text color={theme.colors.headline}>Ticket Price: {costPerTicket} ETH</Text>
      <StyledButton onClick={buyTicketHandler}>Buy Ticket</StyledButton>
    </StyledContainer>
  )
}

export default HeroTicket
