import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadiuses.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 14px;
  width: 330px;
`

const RulesSteps = () => {
  const theme = useTheme()

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      maxWidth="1200px"
      width="100%"
    >
      <StyledCard>
        <Text as="span" fontSize="75%">
          Step 1
        </Text>
        <Text as="h3" color={theme.colors.headline} marginTop="14px">
          Buy Tickets
        </Text>
        <Text fontSize="90%" marginTop="14px">
          Prices are set when the round starts, equal to 10 USD in ETH per
          ticket.
        </Text>
      </StyledCard>
      <StyledCard>
        <Text as="span" fontSize="75%">
          Step 2
        </Text>
        <Text as="h3" color={theme.colors.headline} marginTop="14px">
          Wait for the Draw
        </Text>
        <Text fontSize="90%" marginTop="14px">
          There is one draw every week alternating between 0 AM UTC and 12 PM
          UTC.
        </Text>
      </StyledCard>
      <StyledCard>
        <Text as="span" fontSize="75%">
          Step 3
        </Text>
        <Text as="h3" color={theme.colors.headline} marginTop="14px">
          Claim Your Prize
        </Text>
        <Text fontSize="90%" marginTop="14px">
          Once the round's over, come back to the page and check to see if
          you've won!
        </Text>
      </StyledCard>
    </Flex>
  )
}

export default RulesSteps
