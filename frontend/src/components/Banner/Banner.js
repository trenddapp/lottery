import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'
import { SvgExternalLink } from '../Svg'

const Container = styled(Flex)`
  align-items: center;
  height: 100%;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${({ theme }) => `${theme.siteWidth}px`};
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
  const theme = useTheme()

  return (
    <Section>
      <Container>
        <Text color={theme.colors.background} width="250px">
          Rinkeby Testnet
        </Text>
        <Flex alignItems="center" justifyContent="center" width="250px">
          <Text color={theme.colors.background}>
            Free ETH on Rinkeby -{' '}
            <Link href="https://faucets.chain.link/rinkeby" target="_blank">
              Open website
            </Link>
          </Text>
          <Icon>
            <SvgExternalLink height="16px" width="16px" />
          </Icon>
        </Flex>
        <Text color={theme.colors.background} textAlign="right" width="250px">
          Get your free ETH to buy tickets!
        </Text>
      </Container>
    </Section>
  )
}

export default Banner
