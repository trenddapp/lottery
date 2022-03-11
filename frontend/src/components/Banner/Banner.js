import styled, { useTheme } from 'styled-components'
import { useMatchBreakpoints } from '../../hooks'
import { Flex, Text } from '../Toolkit'
import { SvgExternalLink } from '../Svg'

const Container = styled(Flex)`
  align-items: center;
  height: 100%;
  justify-content: center;
  margin: 0 auto;
  max-width: ${({ theme }) => `${theme.siteWidth}px`};

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: space-between;
  }
`

const Icon = styled(Flex)`
  align-items: center;
  justify-content: center;
  margin-left: 4px;
`

const Link = styled.a`
  color: ${({ theme }) => theme.colors.background};
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.headline};
  color: ${({ theme }) => theme.colors.background};
  font-size: 12px;
  font-weight: 300;
  height: 30px;
  padding: 0 16px;
`

const Banner = () => {
  const { isMobile } = useMatchBreakpoints()
  const theme = useTheme()

  return (
    <Section>
      <Container>
        {isMobile ? null : (
          <Text color={theme.colors.background} width="250px">
            Ethereum Rinkeby Network
          </Text>
        )}
        <Flex alignItems="center" justifyContent="center" width="250px">
          <Text color={theme.colors.background}>
            Free Rinkeby ETH -{' '}
            <Link href="https://faucets.chain.link/rinkeby" target="_blank">
              Open website
            </Link>
          </Text>
          <Icon>
            <SvgExternalLink height="16px" width="16px" />
          </Icon>
        </Flex>
        {isMobile ? null : (
          <Text color={theme.colors.background} textAlign="right" width="250px">
            Get your free ETH to buy tickets!
          </Text>
        )}
      </Container>
    </Section>
  )
}

export default Banner
