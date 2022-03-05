import styled, { useTheme } from 'styled-components'
import { useToast } from '../../hooks'
import { Box } from '../Toolkit'
import Toast from './Toast'

const Container = styled(Box)``

const ToastContainer = ({ stackSpacing = 24, ttl = 16000, bottomPosition = 20 }) => {
  const { toasts, remove } = useToast()
  const theme = useTheme()

  return (
    <Container>
      {toasts.map((toast, index) => {
        const bottom = `${bottomPosition + index * stackSpacing}px`
        const zIndex = (theme.zIndices.toast - index).toString()

        return <Toast key={toast.id} toast={toast} onRemove={remove} ttl={ttl} style={{ bottom, zIndex }} />
      })}
    </Container>
  )
}

export default ToastContainer
