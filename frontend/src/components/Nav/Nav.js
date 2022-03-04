import styled from 'styled-components'
import { useWeb3Profile } from '../../hooks'
import { Logo } from '../Logo'
import { Profile } from '../Profile'
import { Flex } from '../Toolkit'
import { WalletConnectButton } from '../Wallet'

const Container = styled(Flex)`
  align-items: center;
  height: 100%;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${({ theme }) => `${theme.siteWidth}px`};
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  height: 84px;
  padding: 0 16px;
`

const Nav = () => {
  const profile = useWeb3Profile()

  if (profile.isActive || profile.isActivating) {
    return (
      <Section>
        <Container>
          <Logo />
          <Profile />
        </Container>
      </Section>
    )
  }

  return (
    <Section>
      <Container>
        <Logo />
        <WalletConnectButton />
      </Container>
    </Section>
  )
}

export default Nav
