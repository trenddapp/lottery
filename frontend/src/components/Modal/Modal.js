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
`

const ModalOverlayStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: ${({ theme }) => `${theme.modal.colors.overlay}C0`};
`

const Modal = ({ children, onDismiss }) => {
  return (
    <>
      <ModalOverlayStyled onClick={onDismiss} />
      <ModalContainerStyled>{children}</ModalContainerStyled>
    </>
  )
}

export default Modal
