import styled from 'styled-components'
import { useMatchBreakpoints, useWeb3Profile } from '../../hooks'
import { Logo } from '../Logo'
import { Profile } from '../Profile'
import { Flex } from '../Toolkit'
import { WalletConnectButton } from '../Wallet'

const Container = styled(Flex)`
  align-items: center;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  margin: 0 auto;
  max-width: ${({ theme }) => `${theme.siteWidth}px`};

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;
  }
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  height: 134px;
  padding: 0 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 84px;
  }
`

const Nav = () => {
  const { isMobile } = useMatchBreakpoints()
  const profile = useWeb3Profile()

  let connectButtonWidth = isMobile ? '100%' : ''

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
        <WalletConnectButton style={{ width: connectButtonWidth }} />
      </Container>
    </Section>
  )
}

export default Nav
