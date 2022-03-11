import { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { useContractLottery } from '../../hooks'
import { LotteryContext } from '../../store/Lottery'
import { Box, Flex, Text } from '../Toolkit'
import HistoryDate from './HistoryDate'
import HistoryInfo from './HistoryInfo'
import HistoryNavigation from './HistoryNavigation'

const Container = styled(Flex)`
  align-items: center;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  margin: 0 auto;
  max-width: ${({ theme }) => `${theme.siteWidth}px`};

  ${({ theme }) => theme.mediaQueries.sm} {
    border-left: 1px dashed ${({ theme }) => theme.colors.borderAlt};
    border-right: 1px dashed ${({ theme }) => theme.colors.borderAlt};
  }
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  height: 500px;
  padding: 0 16px;
`

const Card = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 540px;
  }
`

const History = () => {
  const { status } = useContext(LotteryContext)
  const [isLoading, setIsLoading] = useState(true)
  const [lottery, setLottery] = useState({
    id: 0,
    prizePot: '',
    closedAt: '',
    drawnAt: '',
    startedAt: '',
    winningAddress: '',
    winningNumber: '',
  })
  const [latestLottery, setLatestLottery] = useState({
    id: 0,
    prizePot: '',
    closedAt: '',
    drawnAt: '',
    startedAt: '',
    winningAddress: '',
    winningNumber: '',
  })
  const contractLottery = useContractLottery()
  const theme = useTheme()

  const getLottery = async (id) => {
    setIsLoading(true)

    if (contractLottery === undefined) {
      return
    }

    let isLatest = false
    if (id === -1) {
      isLatest = true
      id = await contractLottery.lotteryID()
      id = id - 1
    }

    const lottery = await contractLottery.allLotteries(id)

    setLottery({
      id: lottery.lotteryID.toNumber(),
      closedAt: lottery.closingTimestamp.toNumber() * 1000,
      prizePot: ethers.utils.formatEther(lottery.prizePool),
      startedAt: lottery.startingTimestamp.toNumber() * 1000,
      winningAddress: lottery.winner.toString(),
      winningNumber: lottery.randomNumber.toString(),
    })

    if (isLatest) {
      setLatestLottery({
        id: lottery.lotteryID.toNumber(),
        closedAt: lottery.closingTimestamp.toNumber() * 1000,
        startedAt: lottery.startingTimestamp.toNumber() * 1000,
        prizePot: ethers.utils.formatEther(lottery.prizePool),
        winningAddress: lottery.winner.toString(),
        winningNumber: lottery.randomNumber.toString(),
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    try {
      getLottery(-1)
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    if (status === 0) {
      try {
        getLottery(-1)
      } catch (err) {
        console.log(err)
      }
    }
  }, [status])

  return (
    <Section>
      <Container>
        <Text as="h3" color={theme.colors.headline} fontSize="28px" fontWeight="700">
          Lottery History
        </Text>
        <Card>
          <Box borderBottom={'1px solid ' + theme.colors.border} padding="14px">
            <HistoryNavigation
              getLottery={getLottery}
              isLoading={isLoading}
              latestLottery={latestLottery}
              lottery={lottery}
              setLottery={setLottery}
            />
            <HistoryDate isLoading={isLoading} lottery={lottery} />
          </Box>
          <HistoryInfo isLoading={isLoading} lottery={lottery} />
        </Card>
      </Container>
    </Section>
  )
}

export default History
