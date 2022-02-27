import styled, { useTheme } from 'styled-components'
import { useWeb3Profile } from '../../hooks'
import { Profile } from '../Profile'
import { Flex, Text } from '../Toolkit'
import { WalletConnectButton } from '../Wallet'

const StyledContainer = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  height: 70px;
  justify-content: space-between;
  padding: 14px 24px;
`

const Nav = () => {
  const profile = useWeb3Profile()
  const theme = useTheme()

  let content = <WalletConnectButton />

  if (profile.isActivating) {
    content = <Text>Connecting...</Text>
  }

  if (profile.isActive) {
    content = <Profile />
  }

  return (
    <StyledContainer>
      <Text as="h3" color={theme.colors.headline}>
        DAAP-Z
      </Text>
      {content}
    </StyledContainer>
  )
}

export default Nav
