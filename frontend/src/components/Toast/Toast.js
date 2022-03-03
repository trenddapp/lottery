import { useCallback, useEffect, useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { Box, Flex, Text } from '../Toolkit'
import { SvgBan, SvgCheckCircle, SvgExclamation, SvgInformationCircle } from '../Svg'

export const variants = {
  DANGER: 'danger',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
}

const getColor = (theme, variant = variants.INFO) => {
  switch (variant) {
    case variants.INFO:
      return 'blue'

    case variants.DANGER:
      return '#ED4B9E'

    case variants.SUCCESS:
      return '#31D0AA'

    case variants.WARNING:
      return 'yellow'
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

const StyledContainer = styled(Box)`
  background-color: #ffffff;
  border-radius: ${({ theme }) => theme.radii.default};
  max-width: calc(100% - 32px);
  position: fixed;
  right: 16px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
  }
`

const StyledAlert = styled(Flex)``

const StyledIcon = styled(Box)`
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
    <StyledContainer
      onClick={handleRemove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <StyledAlert>
        <StyledIcon variant={type}>
          <Icon width="24px" height="24px" />
        </StyledIcon>
        <Box padding="16px">
          <Text as="h4" color={theme.colors.headline}>
            {title}
          </Text>
          <Text marginTop="8px">{description}</Text>
        </Box>
      </StyledAlert>
    </StyledContainer>
  )
}

export default Toast
