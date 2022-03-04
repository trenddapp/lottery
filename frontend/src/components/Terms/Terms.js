import styled from 'styled-components'
import { Flex, Text } from '../Toolkit'

const Container = styled(Flex)`
  align-items: center;
  height: 100%;
  justify-content: center;
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-top: 1px solid ${({ theme }) => theme.colors.borderAlt};
  height: 50px;
  padding: 0 16px;
`

const Terms = () => {
  return (
    <Section>
      <Container>
        <Text fontSize="80%" textAlign="center">
          Copyright © {new Date().getFullYear()} DAPP-Z
        </Text>
      </Container>
    </Section>
  )
}

export default Terms
