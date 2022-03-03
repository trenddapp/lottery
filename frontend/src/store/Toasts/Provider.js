import { useState } from 'react'
import kebabCase from 'lodash/kebabCase'
import { toastTypes } from '../../components/Toast'
import ToastsContext from './Context'

const ToastsProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const clear = () => {
    setToasts([])
  }

  const toast = (title, description, type) => {
    setToasts((previousToasts) => {
      const id = kebabCase(title)

      // Remove any existing toasts with the same id.
      const currentToasts = previousToasts.filter((previousToast) => {
        return previousToast.id !== id
      })

      return [
        {
          id: id,
          title: title,
          description: description,
          type: type,
        },
        ...currentToasts,
      ]
    })
  }

  const toastError = (title, description) => {
    return toast(title, description, toastTypes.DANGER)
  }

  const toastInfo = (title, description) => {
    return toast(title, description, toastTypes.INFO)
  }

  const toastSuccess = (title, description) => {
    return toast(title, description, toastTypes.SUCCESS)
  }

  const toastWarning = (title, description) => {
    return toast(title, description, toastTypes.WARNING)
  }

  const remove = (id) => {
    setToasts((previousToasts) => {
      return previousToasts.filter((previousToast) => {
        return previousToast.id !== id
      })
    })
  }

  return (
    <ToastsContext.Provider value={{ clear, toastError, toastInfo, toastSuccess, toastWarning, toasts, remove }}>
      {children}
    </ToastsContext.Provider>
  )
}

export default ToastsProvider
