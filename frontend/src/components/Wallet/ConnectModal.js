import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalTitle } from '../Modal'
import styled from 'styled-components'
import ConnectCancel from './ConnectCancel'
import ConnectCard, { ConnectCardMore } from './ConnectCard'
import connectors from '../../config/connectors'

const ConnectCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

const ConnectModal = ({ open, onDismiss }) => {
  const [showMore, setShowMore] = useState(false)

  let customConnectors = connectors.slice(0, 3)
  if (showMore) {
    customConnectors = connectors
  }

  if (!open) {
    return null
  }

  return (
    <Modal onDismiss={onDismiss}>
      <ModalHeader>
        <ModalTitle>Connect Your Wallet</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <ConnectCards>
          {customConnectors.map((connector) => (
            <ConnectCard
              key={connector.id}
              title={connector.title}
              icon={connector.icon}
              connector={connector.connector}
            />
          ))}
          {showMore ? null : <ConnectCardMore onClick={() => setShowMore(true)} />}
        </ConnectCards>
        <ConnectCancel onClick={onDismiss}>Cancel</ConnectCancel>
      </ModalBody>
    </Modal>
  )
}

export default ConnectModal
