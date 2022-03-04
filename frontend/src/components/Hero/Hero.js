import styled from 'styled-components'
import { Flex } from '../Toolkit'
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
`

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  height: 550px;
  padding: 0 16px;
`

const Hero = () => {
  return (
    <Section>
      <Container>
        <HeroPrize />
        <HeroTimer />
        <HeroTicket />
      </Container>
    </Section>
  )
}

export default Hero
