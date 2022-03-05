import styled from 'styled-components'

const Button = styled.button`
  width: 100%;
  border: none;
  padding: 10px 0px;
  margin-top: 12px;
  margin-bottom: 4px;
  border-radius: 0.375rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: inherit;
  &:hover {
    background-color: ${({ theme }) => theme.modal.colors.hover};
    cursor: pointer;
  }
`

const CancelButton = (props) => {
  return <Button {...props}>Cancel</Button>
}

export default CancelButton
