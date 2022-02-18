import styled from 'styled-components'
import { color, layout, space, typography } from 'styled-system'

const Text = styled.div`
  color: ${({ theme }) => theme.colors.text};
  ${color}
  ${layout}
  ${space}
  ${typography}
`

Text.defaultProps = {
  as: 'p',
}

export default Text
