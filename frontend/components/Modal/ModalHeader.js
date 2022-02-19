import styled from 'styled-components'

const ModalHeaderStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 42px;
  padding-top: 24px;
`

const ModalHeader = ({ children }) => {
  return <ModalHeaderStyled>{children}</ModalHeaderStyled>
}

export default ModalHeader
