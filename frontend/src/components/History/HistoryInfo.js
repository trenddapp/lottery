import styled, { useTheme } from 'styled-components'
import { Box, Flex, Text } from '../Toolkit'
import { SvgQuestionMarkCircle } from '../Svg'

const StyledContainer = styled(Box)`
  height: 150px;
  padding: 14px;
`

const HistoryInfo = ({ isLoading, lottery }) => {
  const theme = useTheme()

  if (lottery.id === 0) {
    return (
      <StyledContainer>
        <Flex alignItems="center" flexDirection="column" justifyContent="center" height="100%">
          <SvgQuestionMarkCircle color={theme.colors.text} height="50px" width="50px" />
          <Text marginTop="8px">No round number found!</Text>
        </Flex>
      </StyledContainer>
    )
  }

  return (
    <StyledContainer>
      <Flex alignItems="space-between" flexDirection="column" justifyContent="space-between" height="100%" width="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <Text as="h4" color={theme.colors.headline} fontSize="110%">
            Prize Pot:
          </Text>
          <Text as="span" color={isLoading ? theme.colors.border : theme.colors.action}>
            {lottery.prizePot + ' ETH'}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text as="h4" color={theme.colors.headline} fontSize="110%">
            Winning Number:
          </Text>
          <Text as="span" color={isLoading ? theme.colors.border : theme.colors.action}>
            {lottery.winningNumber.slice(0, 5) + '...' + lottery.winningNumber.slice(73, 77)}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text as="h4" color={theme.colors.headline} fontSize="110%">
            Winning Address:
          </Text>
          <Text as="span" color={isLoading ? theme.colors.border : theme.colors.action}>
            {lottery.winningAddress.slice(0, 5) + '...' + lottery.winningAddress.slice(38, 42)}
          </Text>
        </Flex>
      </Flex>
    </StyledContainer>
  )
}

export default HistoryInfo
