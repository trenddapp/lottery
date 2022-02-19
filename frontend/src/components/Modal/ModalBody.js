import styled from 'styled-components'

const ModalBodyStyled = styled.div`
  padding: 12px 24px;
  overflow-y: auto;
`

const ModalBody = ({ children }) => {
  return <ModalBodyStyled>{children}</ModalBodyStyled>
}

export default ModalBody
