import styled, { useTheme } from 'styled-components'
import { Box, Flex, Text } from '../Toolkit'
import { SvgExternalLink } from '../Svg'

const Container = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.headline};
  color: ${({ theme }) => theme.colors.background};
  font-size: 12px;
  font-weight: 300;
  height: 30px;
  justify-content: center;
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

const Banner = () => {
  const theme = useTheme()

  return (
    <Container>
      <Box marginX="auto" maxWidth={`${theme.siteWidth}px`} paddingX="16px" width="100%">
        <Flex alignItems="center" justifyContent="space-between">
          <Text color={theme.colors.background}>Rinkeby Testnet</Text>
          <Flex alignItems="center" justifyContent="center">
            <Text color={theme.colors.background} fontSize="12px">
              Free ETH on Rinkeby -{' '}
              <Link href="https://faucets.chain.link/rinkeby" target="_blank">
                Open website
              </Link>
            </Text>
            <Icon>
              <SvgExternalLink height="16px" width="16px" />
            </Icon>
          </Flex>
          <Text color={theme.colors.background}>Get your free ETH to buy tickets!</Text>
        </Flex>
      </Box>
    </Container>
  )
}

export default Banner
