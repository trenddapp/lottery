import styled from 'styled-components'
import { Flex, Text } from '../Toolkit'

const StyledContainer = styled(Flex)`
  align-items: center;
  font-size: 70%;
  justify-content: space-between;
  margin-top: 10px;
`

const HistoryDate = ({ closedAt, drawnAt, roundNumber, startedAt }) => {
  if (roundNumber === 0) {
    return (
      <StyledContainer>
        <Text> Please enter a round number!</Text>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <Text>Started: {startedAt}</Text>
      <Text>Closed: {closedAt}</Text>
      <Text>Drawn: {drawnAt}</Text>
    </StyledContainer>
  )
}

export default HistoryDate
