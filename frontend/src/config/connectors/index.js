import { metaMask } from './metaMask'
import {
  SvgMathWallet,
  SvgMetaMask,
  SvgSafePal,
  SvgTokenPocket,
  SvgTrustWallet,
  SvgWalletConnect,
} from '../../components/Svg'

const connectors = [
  {
    id: '1',
    title: 'Meta Mask',
    icon: SvgMetaMask,
    connector: metaMask,
  },
  {
    id: '2',
    title: 'Wallet Connect',
    icon: SvgWalletConnect,
    connector: null, // TODO: implement me!
  },
  {
    id: '3',
    title: 'Trust Wallet',
    icon: SvgTrustWallet,
    connector: null, // TODO: implement me!
  },
  {
    id: '4',
    title: 'Math Wallet',
    icon: SvgMathWallet,
    connector: null, // TODO: implement me!
  },
  {
    id: '5',
    title: 'SafePal',
    icon: SvgSafePal,
    connector: null, // TODO: implement me!
  },
  {
    id: '6',
    title: 'Token Pocket',
    icon: SvgTokenPocket,
    connector: null, // TODO: implement me!
  },
]

export default connectors
