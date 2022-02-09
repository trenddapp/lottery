import styled from "styled-components";

const CancelButtonStyled = styled.button`
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
`;

const CancelButton = (props) => {
  return <CancelButtonStyled {...props}>Cancel</CancelButtonStyled>;
};

export default CancelButton;
