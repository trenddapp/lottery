import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { Box, Flex, Text } from '../Toolkit'
import { SvgChevronDoubleLeft, SvgChevronDoubleRight, SvgChevronLeft, SvgChevronRight } from '../Svg'
import { useContractLottery } from '../../hooks'
import HistoryDate from './HistoryDate'
import HistoryInfo from './HistoryInfo'

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

const Card = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  width: 540px;
`

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 90%;
  margin-left: 10px;
  padding: 2px;
  text-align: center;
  width: 50px;

  &:focus {
    outline-color: ${({ theme }) => theme.colors.action};
  }
`

const Button = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.small};
  border: none;
  color: ${({ theme }) => theme.colors.action};
  display: flex;
  justify-content: center;
  margin: 2px;
  padding: 4px;

  :disabled {
    color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: pointer;
  }

  &:focus {
    outline-color: ${({ theme }) => theme.colors.action};
  }
`

const History = () => {
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

  const handleInput = (event) => {
    if (!event.currentTarget.validity.valid) {
      return
    }

    if (event.target.value === '' || event.target.value === '0') {
      setLottery({ ...lottery, id: 0 })
      return
    }

    let id = parseInt(event.target.value, 10)

    if (id > latestLottery.id) {
      id = latestLottery.id
    }

    setLottery({ ...lottery, id: id })
    try {
      getLottery(id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleLeftArrow = () => {
    let id = lottery.id - 1

    if (lottery.id === 0) {
      id = 1
    }

    setLottery({ ...lottery, id: id })
    try {
      getLottery(id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleLeftEndArrow = () => {
    setLottery({ ...lottery, id: 1 })
    try {
      getLottery(1)
    } catch (err) {
      console.log(err)
    }
  }

  const handleRightArrow = () => {
    let id = lottery.id + 1

    if (id === latestLottery.id) {
      id = latestLottery.id
    }

    setLottery({ ...lottery, id: id })
    try {
      getLottery(id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleRightEndArrow = () => {
    let id = latestLottery.id
    setLottery({ ...lottery, id: id })
    try {
      getLottery(id)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    try {
      getLottery(-1)
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <Section>
      <Container>
        <Text as="h3" color={theme.colors.headline} fontSize="180%">
          Lottery History
        </Text>
        <Card>
          <Box borderBottom={'1px solid ' + theme.colors.border} padding="14px">
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center" justifyContent="center">
                <Text as="h4" color={theme.colors.headline}>
                  Round Number
                </Text>
                <Input
                  onChange={handleInput}
                  pattern="^[0-9]+$"
                  type="text"
                  value={lottery.id === 0 ? '' : lottery.id}
                />
              </Flex>
              <Flex alignItems="center" justifyContent="center">
                <Button disabled={isLoading || lottery.id === 1} onClick={handleLeftEndArrow}>
                  <SvgChevronDoubleLeft height="20px" width="20px" />
                </Button>
                <Button disabled={isLoading || lottery.id === 1} onClick={handleLeftArrow}>
                  <SvgChevronLeft height="20px" width="20px" />
                </Button>
                <Button disabled={isLoading || lottery.id === latestLottery.id} onClick={handleRightArrow}>
                  <SvgChevronRight height="20px" width="20px" />
                </Button>
                <Button disabled={isLoading || lottery.id === latestLottery.id} onClick={handleRightEndArrow}>
                  <SvgChevronDoubleRight height="20px" width="20px" />
                </Button>
              </Flex>
            </Flex>
            <HistoryDate isLoading={isLoading} lottery={lottery} />
          </Box>
          <HistoryInfo isLoading={isLoading} lottery={lottery} />
        </Card>
      </Container>
    </Section>
  )
}

export default History
