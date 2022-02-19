import styled from 'styled-components'
import { Flex } from '../Toolkit'
import {
  SvgChevronDoubleLeft,
  SvgChevronDoubleRight,
  SvgChevronLeft,
  SvgChevronRight,
} from '../Svg'

const StyledButton = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadiuses.sm};
  color: ${({ theme }) => theme.colors.action};
  display: flex;
  justify-content: center;
  margin: 2px;
  padding: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: pointer;
  }

  &:focus {
    outline-color: ${({ theme }) => theme.colors.action};
  }

  :disabled {
    color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`

const HistoryNavigator = ({
  mostRecentRoundNumber,
  roundNumber,
  setRoundNumber,
}) => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <StyledButton
        disabled={roundNumber === 1}
        onClick={() => setRoundNumber(1)}
      >
        <SvgChevronDoubleLeft height="20px" width="20px" />
      </StyledButton>
      <StyledButton
        disabled={roundNumber === 1}
        onClick={() => setRoundNumber(roundNumber - 1)}
      >
        <SvgChevronLeft height="20px" width="20px" />
      </StyledButton>
      <StyledButton
        disabled={roundNumber === mostRecentRoundNumber}
        onClick={() => setRoundNumber(roundNumber + 1)}
      >
        <SvgChevronRight height="20px" width="20px" />
      </StyledButton>
      <StyledButton
        disabled={roundNumber === mostRecentRoundNumber}
        onClick={() => setRoundNumber(mostRecentRoundNumber)}
      >
        <SvgChevronDoubleRight height="20px" width="20px" />
      </StyledButton>
    </Flex>
  )
}

export default HistoryNavigator
