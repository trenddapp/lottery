import { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { useContractLottery } from '../../hooks'
import { Flex, Text } from '../Toolkit'

const calculateTimeLeft = (date) => {
  const difference = +date - +new Date()

  let timeLeft = {
    days: '0',
    hours: '00',
    minutes: '00',
    seconds: '00',
  }

  if (difference > 0) {
    const days = Math.floor(difference / 1000 / 60 / 60 / 24)
    const hours = Math.floor((difference / 1000 / 60 / 60) % 24)
    const minutes = Math.floor((difference / 1000 / 60) % 60)
    const seconds = Math.floor((difference / 1000) % 60)

    timeLeft.days = timeLeft = {
      days: days.toString(),
      hours: hours <= 9 ? `0${hours.toString()}` : hours.toString(),
      minutes: minutes <= 9 ? `0${minutes.toString()}` : minutes.toString(),
      seconds: seconds <= 9 ? `0${seconds.toString()}` : seconds.toString(),
    }
  }

  return timeLeft
}

const HeroTimer = () => {
  const [closedAt, setClosedAt] = useState()
  const [timeLeft, setTimeLeft] = useState({
    days: '0',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })
  const contractLottery = useContractLottery()
  const theme = useTheme()

  const calculateClosedAt = async () => {
    const startedAt = await contractLottery.startingTimestamp()
    const duration = await contractLottery.lotteryDuration()
    return new Date((startedAt.toNumber() + duration.toNumber()) * 1000)
  }

  useEffect(() => {
    if (contractLottery === undefined) {
      return
    }

    calculateClosedAt()
      .then((closedAt) => {
        setClosedAt(closedAt)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (closedAt) {
      const id = setTimeout(() => {
        setTimeLeft(calculateTimeLeft(closedAt))
      }, 1000)

      return () => {
        clearTimeout(id)
      }
    }
  })

  return (
    <Flex alignItems="stretch" justifyContent="center">
      <Flex alignItems="center" flexDirection="column" justifyContent="center">
        <Text color={theme.colors.headline} fontSize="58px">
          {timeLeft.days}
        </Text>
        <Text color={theme.colors.headline} fontSize="10px">
          DAYS
        </Text>
      </Flex>
      <Text color={theme.colors.headline} fontSize="58px" marginX="10px">
        :
      </Text>
      <Flex alignItems="center" flexDirection="column" justifyContent="center">
        <Text color={theme.colors.headline} fontSize="58px">
          {timeLeft.hours}
        </Text>
        <Text color={theme.colors.headline} fontSize="10px">
          HOURS
        </Text>
      </Flex>
      <Text color={theme.colors.headline} fontSize="58px" marginX="10px">
        :
      </Text>
      <Flex alignItems="center" flexDirection="column" justifyContent="center">
        <Text color={theme.colors.headline} fontSize="58px">
          {timeLeft.minutes}
        </Text>
        <Text color={theme.colors.headline} fontSize="10px">
          MINUTES
        </Text>
      </Flex>
      <Text color={theme.colors.headline} fontSize="58px" marginX="10px">
        :
      </Text>
      <Flex alignItems="center" flexDirection="column" justifyContent="center">
        <Text color={theme.colors.action} fontSize="58px">
          {timeLeft.seconds}
        </Text>
        <Text color={theme.colors.headline} fontSize="10px">
          SECONDS
        </Text>
      </Flex>
    </Flex>
  )
}

export default HeroTimer
