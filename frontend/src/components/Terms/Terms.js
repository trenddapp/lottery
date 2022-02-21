import styled from 'styled-components'
import { Text } from '../Toolkit'

const StyledContainer = styled.section`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  height: 50px;
  justify-content: center;
  padding: 14px;
`

const Terms = () => {
  return (
    <StyledContainer>
      <Text fontSize="80%" textAlign="center">
        Copyright © {new Date().getFullYear()} DAPP-Z
      </Text>
    </StyledContainer>
  )
}

export default Terms
