import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: ${({ theme }) => `${theme.modal.colors.overlay}C0`};
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 320px;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ModalContainer = (props) => {
  return (
    <ModalOverlay>
      <ModalContent>{props.children}</ModalContent>
    </ModalOverlay>
  );
};

export default ModalContainer;
