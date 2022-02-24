import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useContractLottery } from '../../hooks'
import { Flex, Text } from '../Toolkit'

const calculateTimeLeft = (date) => {
  const difference = +date - +new Date()

  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / 1000 / 60 / 60 / 24),
      hours: Math.floor((difference / 1000 / 60 / 60) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  return timeLeft
}

const StyledContainer = styled(Flex)`
  margin-top: 48px;
`

const HeroTimer = () => {
  const theme = useTheme()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [closedAt, setClosedAt] = useState()
  const contractLottery = useContractLottery()

  const calculateClosedAt = async () => {
    const startedAt = await contractLottery.startingTimestamp()
    const duration = await contractLottery.lotteryDuration()
    const closedAt = new Date((startedAt.toNumber() + duration.toNumber()) * 1000)
    setClosedAt(closedAt)
  }

  useEffect(() => {
    calculateClosedAt()
  }, [])

  useEffect(() => {
    if (closedAt) {
      const id = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(closedAt))
      }, 1000)

      return () => clearTimeout(id)
    }
  })

  return (
    <StyledContainer>
      <Text color={theme.colors.headline} fontSize="150%">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </Text>
    </StyledContainer>
  )
}

export default HeroTimer
