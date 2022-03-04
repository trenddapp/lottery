import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'
import { useContractLottery, useToast, useWeb3Signer } from '../../hooks'

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.action};
  border-radius: 6px;
  border: none;
  color: ${({ theme }) => theme.colors.background};
  height: 48px;
  width: 350px;

  &:hover {
    cursor: pointer;
  }
`

const Container = styled(Flex)`
  align-items: center;
  flex-direction: column;
  justify-content: center;
`

const HeroTicket = () => {
  const { toastError, toastSuccess } = useToast()
  const [costPerTicket, setCostPerTicket] = useState('0')
  const signer = useWeb3Signer()
  const contractLottery = useContractLottery(signer)
  const theme = useTheme()

  const buyTicketHandler = () => {
    if (contractLottery !== undefined) {
      contractLottery
        .buyTicket({
          value: ethers.utils.parseEther(costPerTicket),
        })
        .then((result) => {
          toastSuccess('Successful Transaction', 'Ticket successfully bought!')
          console.log(result)
        })
        .catch((err) => {
          toastError('Failed Transaction', 'Cannot buy ticket now! Please try later!')
        })
    }
  }

  useEffect(() => {
    if (contractLottery !== undefined) {
      contractLottery
        .costPerTicket()
        .then((costPerTicket) => {
          setCostPerTicket(ethers.utils.formatEther(costPerTicket))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  return (
    <Container>
      <StyledButton onClick={buyTicketHandler}>Buy Ticket</StyledButton>
      {/* <Text color={theme.colors.headline} fontSize="12px">
        Ticket Price: {costPerTicket} ETH
      </Text> */}
    </Container>
  )
}

export default HeroTicket
