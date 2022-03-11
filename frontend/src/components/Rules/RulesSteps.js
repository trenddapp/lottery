import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'

const Container = styled(Flex)`
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
`

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 14px;
  margin: 16px 0;
  width: 330px;
`

const RulesSteps = () => {
  const theme = useTheme()

  return (
    <Container>
      <Card>
        <Text as="span" fontSize="75%">
          Step 1
        </Text>
        <Text as="h3" color={theme.colors.headline} marginTop="14px">
          Buy Tickets
        </Text>
        <Text fontSize="90%" marginTop="14px">
          Prices are set when the round starts, equal to 10 USD in ETH per ticket.
        </Text>
      </Card>
      <Card>
        <Text as="span" fontSize="75%">
          Step 2
        </Text>
        <Text as="h3" color={theme.colors.headline} marginTop="14px">
          Wait for the Draw
        </Text>
        <Text fontSize="90%" marginTop="14px">
          There is one draw every week alternating between 0 AM UTC and 12 PM UTC.
        </Text>
      </Card>
      <Card>
        <Text as="span" fontSize="75%">
          Step 3
        </Text>
        <Text as="h3" color={theme.colors.headline} marginTop="14px">
          Claim Your Prize
        </Text>
        <Text fontSize="90%" marginTop="14px">
          Once the round&apos;s over, come back to the page and check to see if you&apos;ve won!
        </Text>
      </Card>
    </Container>
  )
}

export default RulesSteps
