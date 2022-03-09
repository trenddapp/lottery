import { useEffect } from 'react'
import styled from 'styled-components'
import { useToast, useWeb3Profile } from '../../hooks'
import { shortenAddress } from '../../utils'
import { SvgChevronDown, SvgExclamation, SvgUser } from '../Svg'
import { Flex, Text } from '../Toolkit'

const Circle = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.circle};
  border: 1px solid ${({ theme }) => theme.colors.borderAlt};
  height: 48px;
  justify-content: center;
  width: 48px;
  z-index: 1;
`

const Container = styled(Flex)`
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  justify-content: center;
`

const Account = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-bottom-right-radius: ${({ theme }) => theme.radii.default};
  border-top-right-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.borderAlt};
  justify-content: center;
  margin-left: -8px;
  min-width: 128px;
  padding: 4px 10px 4px 14px;

  &:hover {
    cursor: pointer;
  }
`

const Profile = () => {
  const { account, isActivating, isActive, isWrongNetwork } = useWeb3Profile()
  const { toastWarning } = useToast()

  useEffect(() => {
    if (isWrongNetwork) {
      toastWarning('Invalid Network', 'Please change network from your wallet!')
    }
  }, [isWrongNetwork])

  if (isWrongNetwork) {
    return (
      <Container>
        <Circle>
          <SvgExclamation height="20px" width="20px" />
        </Circle>
        <Account>
          <Text>wrong network</Text>
          <Flex alignItems="center" justifyContent="center" marginLeft="10px">
            <SvgChevronDown height="20px" width="20px" />
          </Flex>
        </Account>
      </Container>
    )
  }

  if (isActivating) {
    return (
      <Container>
        <Circle>
          <SvgUser height="20px" width="20px" />
        </Circle>
        <Account>
          <Text>connecting...</Text>
        </Account>
      </Container>
    )
  }

  if (isActive) {
    return (
      <Container>
        <Circle>
          <SvgUser height="20px" width="20px" />
        </Circle>
        <Account>
          <Text>{shortenAddress(account)}</Text>
          <Flex alignItems="center" justifyContent="center" marginLeft="10px">
            <SvgChevronDown height="20px" width="20px" />
          </Flex>
        </Account>
      </Container>
    )
  }

  return null
}

export default Profile
