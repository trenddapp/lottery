import styled, { useTheme } from 'styled-components'
import { Text } from '../Toolkit'
import RulesSteps from './RulesSteps'

const StyledContainer = styled.section`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 450px;
  justify-content: space-evenly;
  padding: 14px;
`

const Rules = () => {
  const theme = useTheme()

  return (
    <StyledContainer>
      <Text as="h3" fontSize="180%" color={theme.colors.headline}>
        How to Play
      </Text>
      <Text>There is only one winner in each rounds that wins the big money!</Text>
      <RulesSteps />
    </StyledContainer>
  )
}

export default Rules
