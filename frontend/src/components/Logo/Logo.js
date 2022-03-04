import styled from 'styled-components'
import { Flex, Text } from '../Toolkit'

const Main = styled(Text)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.headline};
  color: ${({ theme }) => theme.colors.headline};
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 4px;
`

const Detail = styled(Text)`
  color: ${({ theme }) => theme.colors.headline};
  font-size: 12px;
  letter-spacing: 4px;
  margin-top: 4px;
`

const Logo = () => {
  return (
    <Flex alignItems="center" flexDirection="column" justifyContent="center">
      <Main>DAAP-Z</Main>
      <Detail>LOTTERY</Detail>
    </Flex>
  )
}

export default Logo
