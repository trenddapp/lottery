import styled, { useTheme } from 'styled-components'
import { SvgGitHub } from '../Svg'
import { Flex, Text } from '../Toolkit'

const Container = styled(Flex)`
  align-items: center;
  height: 100%;
  justify-content: center;
  margin: 0 auto;
  max-width: ${({ theme }) => `${theme.siteWidth}px`};
`

const Link = styled.a`
  margin-left: 16px;

  &:hover {
    cursor: pointer;
  }
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.borderAlt};
  height: 50px;
  padding: 0 16px;
`

const Terms = () => {
  const theme = useTheme()

  return (
    <Section>
      <Container>
        <Text fontSize="12px" textAlign="center">
          © {new Date().getFullYear()} DAPP-Z
        </Text>
        <Link href="https://github.com/dapp-z/lottery" target="_blank">
          <SvgGitHub fill={theme.colors.text} height="20px" width="20px" />
        </Link>
      </Container>
    </Section>
  )
}

export default Terms
