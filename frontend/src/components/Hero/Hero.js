import styled from 'styled-components'
import { Box, Flex } from '../Toolkit'
import HeroPrize from './HeroPrize'
import HeroTimer from './HeroTimer'
import HeroTicket from './HeroTicket'

const Container = styled(Flex)`
  align-items: center;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
  margin: 0 auto;
  max-width: ${({ theme }) => `${theme.siteWidth}px`};

  ${({ theme }) => theme.mediaQueries.sm} {
    border-left: 1px dashed ${({ theme }) => theme.colors.borderAlt};
    border-right: 1px dashed ${({ theme }) => theme.colors.borderAlt};
  }
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  height: 500px;
  padding: 0 16px;
`

const Separator = styled(Box)`
  border-top: 1px dashed ${({ theme }) => theme.colors.borderAlt};
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 350px;
  }
`

const Hero = () => {
  return (
    <Section>
      <Container>
        <HeroPrize />
        <Separator />
        <HeroTimer />
        <HeroTicket />
      </Container>
    </Section>
  )
}

export default Hero
