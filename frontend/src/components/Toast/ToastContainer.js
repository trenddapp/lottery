import styled, { useTheme } from 'styled-components'
import { useToast } from '../../hooks'
import { Box } from '../Toolkit'
import Toast from './Toast'

const Container = styled(Box)``

const Section = styled(Box)``

const ToastContainer = ({ stackSpacing = 24, ttl = 16000, topPosition = 80 }) => {
  const { toasts, remove } = useToast()
  const theme = useTheme()

  return (
    <Section>
      <Container>
        {toasts.map((toast, index) => {
          const top = `${topPosition + index * stackSpacing}px`
          const zIndex = (theme.zIndices.toast - index).toString()

          return <Toast key={toast.id} toast={toast} onRemove={remove} ttl={ttl} style={{ top, zIndex }} />
        })}
      </Container>
    </Section>
  )
}

export default ToastContainer
