import styled, { useTheme } from 'styled-components'
import { SvgChevronDoubleLeft, SvgChevronDoubleRight, SvgChevronLeft, SvgChevronRight } from '../Svg'
import { Flex, Text } from '../Toolkit'

const Button = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.small};
  border: none;
  color: ${({ theme }) => theme.colors.action};
  display: flex;
  justify-content: center;
  margin: 2px;
  padding: 4px;

  :disabled {
    color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: pointer;
  }

  &:focus {
    outline-color: ${({ theme }) => theme.colors.action};
  }
`

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
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

const HistoryNavigation = ({ getLottery, isLoading, latestLottery, lottery, setLottery }) => {
  const theme = useTheme()

  const handleInput = (event) => {
    if (!event.currentTarget.validity.valid) {
      return
    }

    if (event.target.value === '' || event.target.value === '0') {
      setLottery({ ...lottery, id: 0 })
      return
    }

    let id = parseInt(event.target.value, 10)
    if (id > latestLottery.id) {
      id = latestLottery.id
    }

    setLottery({ ...lottery, id: id })
    try {
      getLottery(id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleLeft = () => {
    let id = lottery.id - 1
    if (lottery.id === 0) {
      id = 1
    }

    setLottery({ ...lottery, id: id })
    try {
      getLottery(id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleLeftEnd = () => {
    setLottery({ ...lottery, id: 1 })
    try {
      getLottery(1)
    } catch (err) {
      console.log(err)
    }
  }

  const handleRight = () => {
    let id = lottery.id + 1
    if (id === latestLottery.id) {
      id = latestLottery.id
    }

    setLottery({ ...lottery, id: id })
    try {
      getLottery(id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleRightEnd = () => {
    setLottery({ ...lottery, id: latestLottery.id })
    try {
      getLottery(latestLottery.id)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center" justifyContent="center">
        <Text as="h4" color={theme.colors.headline}>
          Round Number
        </Text>
        <Input
          disabled={isLoading}
          onChange={handleInput}
          pattern="^[0-9]+$"
          type="text"
          value={lottery.id === 0 ? '' : lottery.id}
        />
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Button disabled={isLoading || lottery.id === 1} onClick={handleLeftEnd}>
          <SvgChevronDoubleLeft height="20px" width="20px" />
        </Button>
        <Button disabled={isLoading || lottery.id === 1} onClick={handleLeft}>
          <SvgChevronLeft height="20px" width="20px" />
        </Button>
        <Button disabled={isLoading || lottery.id === latestLottery.id} onClick={handleRight}>
          <SvgChevronRight height="20px" width="20px" />
        </Button>
        <Button disabled={isLoading || lottery.id === latestLottery.id} onClick={handleRightEnd}>
          <SvgChevronDoubleRight height="20px" width="20px" />
        </Button>
      </Flex>
    </Flex>
  )
}

export default HistoryNavigation
