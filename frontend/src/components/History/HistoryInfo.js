import { useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { getEtherscanUrl, shortenAddress } from '../../utils'
import { Box, Flex, Text } from '../Toolkit'
import { SvgClipboard, SvgClipboardCheck, SvgExternalLink, SvgQuestionMarkCircle } from '../Svg'

const Clickable = styled(Text)`
  display: flex;

  &:hover {
    cursor: pointer;
  }
`

const Container = styled(Flex)`
  align-items: space-between;
  flex-direction: column;
  height: 150px;
  justify-content: space-between;
  padding: 14px;
`

const HistoryInfo = ({ isLoading, lottery }) => {
  const { prizePot, winningAddress, winningNumber } = lottery
  const [isOnClipboard, setIsOnClipboard] = useState(false)
  const theme = useTheme()
  const timer = useRef()

  const handleCopy = () => {
    navigator.clipboard.writeText(winningNumber)

    setIsOnClipboard(true)

    if (timer.current !== undefined) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      setIsOnClipboard(false)
    }, 3000)
  }

  if (lottery.id === 0) {
    return (
      <Container>
        <Flex alignItems="center" flexDirection="column" justifyContent="center" height="100%">
          <SvgQuestionMarkCircle color={theme.colors.text} height="50px" width="50px" />
          <Text marginTop="8px">No round number found!</Text>
        </Flex>
      </Container>
    )
  }

  return (
    <Container>
      <Flex alignItems="center" justifyContent="space-between" paddingRight="18px">
        <Text fontWeight="700" color={theme.colors.headline}>
          Prize Pot:
        </Text>
        <Text as="span" color={isLoading ? theme.colors.border : theme.colors.action}>
          {prizePot + ' ETH'}
        </Text>
      </Flex>

      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="700" color={theme.colors.headline}>
          Winning Number:
        </Text>
        <Clickable as="span" color={isLoading ? theme.colors.border : theme.colors.action} onClick={handleCopy}>
          {winningNumber.slice(0, 3) + '...' + winningNumber.slice(74, 77)}
          <Box marginLeft="3px">
            {isOnClipboard ? (
              <SvgClipboardCheck height="15px" width="15px" />
            ) : (
              <SvgClipboard height="15px" width="15px" />
            )}
          </Box>
        </Clickable>
      </Flex>

      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="700" color={theme.colors.headline}>
          Winning Address:
        </Text>
        <Clickable
          as="a"
          color={isLoading ? theme.colors.border : theme.colors.action}
          href={getEtherscanUrl(winningAddress)}
          target="_blank"
        >
          {shortenAddress(winningAddress)}
          <Box marginLeft="3px">
            <SvgExternalLink height="15px" width="15px" />
          </Box>
        </Clickable>
      </Flex>
    </Container>
  )
}

export default HistoryInfo
