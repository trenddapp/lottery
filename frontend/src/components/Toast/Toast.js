import { useCallback, useEffect, useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { SvgBan, SvgCheckCircle, SvgExclamation, SvgInformationCircle } from '../Svg'
import { Box, Flex, Text } from '../Toolkit'

export const variants = {
  DANGER: 'danger',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
}

const getColor = (theme, variant = variants.INFO) => {
  switch (variant) {
    case variants.INFO:
      return theme.colors.secondary

    case variants.DANGER:
      return theme.colors.failure

    case variants.SUCCESS:
      return theme.colors.success

    case variants.WARNING:
      return theme.colors.warning
  }
}

const getIcon = (variant = variants.INFO) => {
  switch (variant) {
    case variants.INFO:
      return SvgInformationCircle

    case variants.DANGER:
      return SvgBan

    case variants.SUCCESS:
      return SvgCheckCircle

    case variants.WARNING:
      return SvgExclamation
  }
}

const Container = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.normal};
  box-shadow: ${({ theme }) => theme.shadows.toast};
  left: 16px;
  max-width: calc(100% - 32px);
  overflow: hidden;
  position: fixed;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    left: calc((100% - ${({ theme }) => theme.siteWidth}px) / 2);
  }
`

const IconLabel = styled(Box)`
  background-color: ${({ theme, variant }) => getColor(theme, variant)};
  color: ${({ theme }) => theme.colors.background};
  padding: 16px;
`

const Toast = ({ toast, onRemove, ttl, style }) => {
  const theme = useTheme()
  const timer = useRef()

  const { id, title, description, type } = toast
  const Icon = getIcon(type)

  // Avoid re-render on onRemove reference change.
  const removeHandler = useRef(onRemove)

  const handleRemove = useCallback(() => removeHandler.current(id), [id, removeHandler])

  const handleMouseEnter = () => clearTimeout(timer.current)

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(handleRemove, ttl)
  }

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(handleRemove, ttl)

    return () => clearTimeout(timer.current)
  }, [handleRemove, timer, ttl])

  return (
    <Container onClick={handleRemove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={style}>
      <IconLabel variant={type}>
        <Icon width="24px" height="24px" />
      </IconLabel>
      <Box padding="16px">
        <Text as="h4" color={theme.colors.headline}>
          {title}
        </Text>
        <Text marginTop="8px">{description}</Text>
      </Box>
    </Container>
  )
}

export default Toast
