import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Box, Flex, Text } from '../Toolkit'
import HistoryDate from './HistoryDate'
import HistoryInfo from './HistoryInfo'
import HistoryInput from './HistoryInput'
import HistoryNavigator from './HistoryNavigator'

const StyledCard = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiuses.md};
  width: 540px;
  overflow: hidden;
`

const StyledContainer = styled.section`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 450px;
  padding: 14px;
`

const History = () => {
  const [closedAt, setClosedAt] = useState()
  const [drawnAt, setDrawnAt] = useState()
  const [mostRecentRoundNumber, setMostRecentRoundNumber] = useState(0)
  const [prizePot, setPrizePot] = useState()
  const [roundNumber, setRoundNumber] = useState(0)
  const [startedAt, setStartedAt] = useState()
  const [winningAddress, setWinningAddress] = useState()
  const [winningNumber, setWinningNumber] = useState()

  const theme = useTheme()

  useEffect(() => {
    setClosedAt('Feb 13 2022, 3:30 PM')
    setDrawnAt('Feb 14 2022, 2:30 PM')
    setMostRecentRoundNumber(100)
    setPrizePot(0)
    setRoundNumber(1)
    setStartedAt('Feb 12 2022, 4:30 PM')
    setWinningAddress(0)
    setWinningNumber(0)
  }, [])

  const inputHandler = (roundNumber) => {
    if (roundNumber > mostRecentRoundNumber) {
      setRoundNumber(mostRecentRoundNumber)
      return
    }

    setRoundNumber(roundNumber)
  }

  const navigatorHandler = (roundNumber) => {
    if (roundNumber < 0) {
      setRoundNumber(1)
      return
    }

    setRoundNumber(roundNumber)
  }

  return (
    <StyledContainer>
      <Text as="h3" color={theme.colors.headline} fontSize="180%">
        Lottery History
      </Text>
      <StyledCard>
        <Box borderBottom={'1px solid ' + theme.colors.border} padding="14px">
          <Flex alignItems="center" justifyContent="space-between">
            <HistoryInput
              roundNumber={roundNumber}
              setRoundNumber={inputHandler}
            />
            <HistoryNavigator
              mostRecentRoundNumber={mostRecentRoundNumber}
              roundNumber={roundNumber}
              setRoundNumber={navigatorHandler}
            />
          </Flex>
          <HistoryDate
            closedAt={closedAt}
            drawnAt={drawnAt}
            roundNumber={roundNumber}
            startedAt={startedAt}
          />
        </Box>
        <HistoryInfo
          prizePot={prizePot}
          roundNumber={roundNumber}
          winningAddress={winningAddress}
          winningNumber={winningNumber}
        />
      </StyledCard>
    </StyledContainer>
  )
}

export default History
