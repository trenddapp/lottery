import { useContext, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useContractLottery, useWeb3Profile, useWeb3Signer } from '../../hooks'
import { LotteryContext } from '../../store/Lottery'
import { Flex, Text } from '../Toolkit'

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.action};
  border-radius: ${({ theme }) => theme.radii.small};
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
  border-left: 1px dashed ${({ theme }) => theme.colors.borderAlt};
  border-right: 1px dashed ${({ theme }) => theme.colors.borderAlt};
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  margin: 0 auto;
  max-width: ${({ theme }) => `${theme.siteWidth}px`};
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  height: 500px;
  padding: 0 16px;
`

const ClaimReward = () => {
  const { account } = useWeb3Profile()
  const { status } = useContext(LotteryContext)
  const [winner, setWinner] = useState()
  const signer = useWeb3Signer()
  const contractLottery = useContractLottery(signer)
  const theme = useTheme()

  const handleClaimReward = () => {
    if (contractLottery === undefined) {
      return
    }

    contractLottery
      .claimReward()
      .then(() => {
        setWinner(undefined)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (contractLottery === undefined || status !== 3) {
      return
    }

    contractLottery
      .winner()
      .then((result) => {
        setWinner(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [contractLottery, status])

  if (winner === undefined || winner !== account) {
    return null
  }

  return (
    <Section>
      <Container>
        <Text as="h3" color={theme.colors.headline} fontSize="28px" fontWeight="700">
          You have won!
        </Text>
        <Text textAlign="center">
          Claim you reward before next lottery starts, <br /> otherwise the prize will directly be sent to your wallet.
        </Text>
        <Button onClick={handleClaimReward}>Claim Reward</Button>
      </Container>
    </Section>
  )
}

export default ClaimReward
