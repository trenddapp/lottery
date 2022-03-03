import { useContext } from 'react'
import { ToastsContext } from '../store/Toasts'

const useToast = () => {
  const toastsContext = useContext(ToastsContext)

  if (toastsContext === undefined) {
    throw new Error('undefined toasts context')
  }

  return toastsContext
}

export default useToast
