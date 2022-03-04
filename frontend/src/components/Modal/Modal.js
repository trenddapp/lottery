import { useEffect } from 'react'
import styled from 'styled-components'

const ModalContainerStyled = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 320px;
  overflow: hidden;
  border-radius: 0.5rem;
  z-index: 110;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 20px 0px;
`

const ModalOverlayStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: ${({ theme }) => `${theme.modal.colors.overlay}`};
`

const Modal = ({ children, onDismiss }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <>
      <ModalOverlayStyled onClick={onDismiss} />
      <ModalContainerStyled>{children}</ModalContainerStyled>
    </>
  )
}

export default Modal
