import { useState } from 'react'
import styled from 'styled-components'
import ConnectModal from './ConnectModal'

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.action};
  border-radius: 6px;
  border: none;
  color: ${({ theme }) => theme.colors.background};
  padding: 10px 40px;

  &:hover {
    cursor: pointer;
  }
`

const ConnectButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ConnectModal open={isOpen} onDismiss={() => setIsOpen(false)} />
      <StyledButton onClick={() => setIsOpen(true)}>Connect Wallet</StyledButton>
    </>
  )
}

export default ConnectButton
