import styled, { useTheme } from 'styled-components'
import { Box, Flex, Text } from '../Toolkit'
import { useWeb3Profile } from '../../hooks'

const StyledCircle = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.action};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  min-height: 50px;
  min-width: 50px;
  z-index: 10;
`

const StyledContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
`

const Profile = () => {
  const profile = useWeb3Profile()
  const theme = useTheme()

  if (!profile.isActive) {
    return null
  }

  return (
    <StyledContainer>
      <StyledCircle>W</StyledCircle>
      <Box
        background={theme.colors.action}
        borderRadius={theme.borderRadiuses.md}
        marginLeft="-14px"
        padding="3px 24px"
      >
        <Text color={theme.colors.background}>
          {profile.account.slice(0, 5) + '...' + profile.account.slice(38, 42)}
        </Text>
      </Box>
    </StyledContainer>
  )
}

export default Profile
