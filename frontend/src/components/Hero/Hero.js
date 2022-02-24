import styled from 'styled-components'
import HeroPrize from './HeroPrize'
import HeroTimer from './HeroTimer'
import HeroTicket from './HeroTicket'

const StyledContainer = styled.section`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  height: 550px;
  justify-content: center;
  padding: 14px;
`

const Hero = () => {
  return (
    <StyledContainer>
      <HeroPrize />
      <HeroTimer />
      <HeroTicket />
    </StyledContainer>
  )
}

export default Hero
