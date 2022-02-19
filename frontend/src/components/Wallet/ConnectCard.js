import styled from 'styled-components'
import { SvgMore } from '../Svg'

const ConnectButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 4px;
  padding: 12px 0px;
  border: none;
  border-radius: 0.375rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: inherit;
  &:hover {
    background-color: ${({ theme }) => theme.modal.colors.hover};
    cursor: pointer;
  }
`

const ConnectButtonText = styled.p`
  margin-top: 8px;
`

export const ConnectCardMore = (props) => {
  return (
    <ConnectButton {...props}>
      <SvgMore />
      <ConnectButtonText>More</ConnectButtonText>
    </ConnectButton>
  )
}

const ConnectCard = ({ connector, icon: ConnectButtonIcon, title }) => {
  const connectButtonHandler = () => {
    connector.activate()
  }

  return (
    <ConnectButton onClick={connectButtonHandler}>
      <ConnectButtonIcon />
      <ConnectButtonText>{title}</ConnectButtonText>
    </ConnectButton>
  )
}

export default ConnectCard
