import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'

const StyledContainer = styled(Flex)`
  align-items: center;
  font-size: 70%;
  justify-content: space-between;
  margin-top: 10px;
`

const HistoryDate = ({ isLoading, lottery }) => {
  const theme = useTheme()

  if (lottery.id === 0) {
    return (
      <StyledContainer>
        <Text> Please enter a round number!</Text>
      </StyledContainer>
    )
  }

  let startedAt = new Date(lottery.startedAt)
  let closedAt = new Date(lottery.closedAt)

  return (
    <StyledContainer>
      <Text>
        Started:{' '}
        <Text as="span" color={isLoading ? theme.colors.border : theme.colors.text}>
          {startedAt.toUTCString()}
        </Text>
      </Text>
      <Text>
        Closed:{' '}
        <Text as="span" color={isLoading ? theme.colors.border : theme.colors.text}>
          {closedAt.toUTCString()}
        </Text>
      </Text>
    </StyledContainer>
  )
}

export default HistoryDate
