import { useState } from 'react'
import styled from 'styled-components'
import ConnectModal from './ConnectModal'

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.action};
  border-radius: ${({ theme }) => theme.radii.small};
  border: none;
  color: ${({ theme }) => theme.colors.background};
  padding: 10px 40px;

  &:hover {
    cursor: pointer;
  }
`

const ConnectButton = ({ style }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ConnectModal open={isOpen} onDismiss={() => setIsOpen(false)} />
      <Button onClick={() => setIsOpen(true)} style={style}>
        Connect Wallet
      </Button>
    </>
  )
}

export default ConnectButton
