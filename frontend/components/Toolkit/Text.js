import { color, layout, space, typography } from 'styled-system'
import styled from 'styled-components'

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
