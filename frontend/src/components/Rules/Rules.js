import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'
import RulesSteps from './RulesSteps'

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
  height: 800px;
  padding: 0 16px;

  ${({ theme }) => theme.mediaQueries.lg} {
    height: 500px;
  }
`

const Rules = () => {
  const theme = useTheme()

  return (
    <Section>
      <Container>
        <Flex alignItems="center" flexDirection="column" justifyContent="center">
          <Text as="h3" fontSize="180%" color={theme.colors.headline}>
            How to Play
          </Text>
          <Text textAlign="center" marginTop="16px">
            There is only one winner in each rounds that wins the big money!
          </Text>
        </Flex>
        <RulesSteps />
      </Container>
    </Section>
  )
}

export default Rules
