import styled from 'styled-components'

const ModalTitleStyled = styled.h3`
  color: ${({ theme }) => theme.colors.headline};
  font-weight: bold;
`

const ModalTitle = ({ children }) => {
  return <ModalTitleStyled>{children}</ModalTitleStyled>
}

export default ModalTitle
