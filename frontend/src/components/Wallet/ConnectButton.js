import { useState } from 'react'
import styled from 'styled-components'
import ConnectModal from './ConnectModal'

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.action};
  border-radius: ${({ theme }) => theme.borderRadiuses.md};
  border: none;
  color: ${({ theme }) => theme.colors.background};
  padding: 14px 48px;

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
