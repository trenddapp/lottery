import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useContractLottery, useToast, useWeb3Signer } from '../../hooks'

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.action};
  border-radius: ${({ theme }) => theme.radii.small};
  border: none;
  color: ${({ theme }) => theme.colors.background};
  height: 48px;
  width: 100%;

  &:hover {
    cursor: pointer;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 350px;
  }
`

const HeroTicket = () => {
  const { toastError, toastSuccess } = useToast()
  const [costPerTicket, setCostPerTicket] = useState()
  const signer = useWeb3Signer()
  const contractLottery = useContractLottery(signer)

  const handleBuyTicket = () => {
    if (contractLottery === undefined) {
      return
    }

    contractLottery
      .buyTicket({
        value: costPerTicket,
      })
      .then((result) => {
        toastSuccess('Successful Transaction', 'Ticket successfully bought!')
        console.log(result)
      })
      .catch((err) => {
        toastError('Failed Transaction', 'Cannot buy ticket now! Please try later!')
        console.log(err)
      })
  }

  useEffect(() => {
    if (contractLottery === undefined) {
      return
    }

    contractLottery
      .costPerTicket()
      .then((costPerTicket) => {
        setCostPerTicket(costPerTicket)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return <Button onClick={handleBuyTicket}>Buy Ticket</Button>
}

export default HeroTicket
