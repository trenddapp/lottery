import styled, { useTheme } from 'styled-components'
import { Flex, Text } from '../Toolkit'

const StyledInput = styled.input`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadiuses.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: 90%;
  margin-left: 10px;
  padding: 2px;
  text-align: center;
  width: 50px;

  &:focus {
    outline-color: ${({ theme }) => theme.colors.action};
  }
`

const HistoryInput = ({ roundNumber, setRoundNumber }) => {
  const theme = useTheme()

  const roundNumberHandler = (event) => {
    if (!event.currentTarget.validity.valid) {
      return
    }

    if (event.target.value === '') {
      setRoundNumber(0)
      return
    }

    setRoundNumber(parseInt(event.target.value, 10))
  }

  return (
    <Flex alignItems="center" justifyContent="center">
      <Text as="h4" color={theme.colors.headline}>
        Round Number
      </Text>
      <StyledInput
        onChange={roundNumberHandler}
        pattern="^[0-9]+$"
        type="text"
        value={roundNumber === 0 ? '' : roundNumber}
      />
    </Flex>
  )
}

export default HistoryInput
