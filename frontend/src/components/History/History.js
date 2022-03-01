import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styled, { useTheme } from 'styled-components'
import { Box, Flex, Text } from '../Toolkit'
import { SvgChevronDoubleLeft, SvgChevronDoubleRight, SvgChevronLeft, SvgChevronRight } from '../Svg'
import { useContractLottery } from '../../hooks'
import HistoryDate from './HistoryDate'
import HistoryInfo from './HistoryInfo'

const StyledCard = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.default};
  width: 540px;
  overflow: hidden;
`

const StyledContainer = styled.section`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 450px;
  padding: 14px;
`

const StyledInput = styled.input`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.small};
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

const StyledButton = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.small};
  color: ${({ theme }) => theme.colors.action};
  display: flex;
  justify-content: center;
  margin: 2px;
  padding: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: pointer;
  }

  &:focus {
    outline-color: ${({ theme }) => theme.colors.action};
  }

  :disabled {
    color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`

const History = () => {
  const theme = useTheme()
  const contractLottery = useContractLottery()
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

  const getLottery = async (id) => {
    setIsLoading(true)

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

  const inputHandler = (event) => {
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
    getLottery(id)
  }

  const leftArrowHandler = () => {
    let id = lottery.id - 1

    if (lottery.id === 0) {
      id = 1
    }

    setLottery({ ...lottery, id: id })
    getLottery(id)
  }

  const leftEndArrowHandler = () => {
    setLottery({ ...lottery, id: 1 })
    getLottery(1)
  }

  const rightArrowHandler = () => {
    let id = lottery.id + 1

    if (id === latestLottery.id) {
      id = latestLottery.id
    }

    setLottery({ ...lottery, id: id })
    getLottery(id)
  }

  const rightEndArrowHandler = () => {
    let id = latestLottery.id
    setLottery({ ...lottery, id: id })
    getLottery(id)
  }

  useEffect(() => {
    getLottery(-1)
  }, [])

  return (
    <StyledContainer>
      <Text as="h3" color={theme.colors.headline} fontSize="180%">
        Lottery History
      </Text>
      <StyledCard>
        <Box borderBottom={'1px solid ' + theme.colors.border} padding="14px">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" justifyContent="center">
              <Text as="h4" color={theme.colors.headline}>
                Round Number
              </Text>
              <StyledInput
                onChange={inputHandler}
                pattern="^[0-9]+$"
                type="text"
                value={lottery.id === 0 ? '' : lottery.id}
              />
            </Flex>
            <Flex alignItems="center" justifyContent="center">
              <StyledButton disabled={isLoading || lottery.id === 1} onClick={leftEndArrowHandler}>
                <SvgChevronDoubleLeft height="20px" width="20px" />
              </StyledButton>
              <StyledButton disabled={isLoading || lottery.id === 1} onClick={leftArrowHandler}>
                <SvgChevronLeft height="20px" width="20px" />
              </StyledButton>
              <StyledButton disabled={isLoading || lottery.id === latestLottery.id} onClick={rightArrowHandler}>
                <SvgChevronRight height="20px" width="20px" />
              </StyledButton>
              <StyledButton disabled={isLoading || lottery.id === latestLottery.id} onClick={rightEndArrowHandler}>
                <SvgChevronDoubleRight height="20px" width="20px" />
              </StyledButton>
            </Flex>
          </Flex>
          <HistoryDate isLoading={isLoading} lottery={lottery} />
        </Box>
        <HistoryInfo isLoading={isLoading} lottery={lottery} />
      </StyledCard>
    </StyledContainer>
  )
}

export default History
