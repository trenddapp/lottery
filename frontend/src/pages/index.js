import Head from 'next/head'
import dynamic from 'next/dynamic'

// TODO: Remove dynamic import when web3-react supports ssr.
const LotteryStatusProvider = dynamic(
  () => {
    return import('../store/LotteryStatus').then((module) => {
      return module.LotteryStatusProvider
    })
  },
  { ssr: false },
)

// TODO: Remove dynamic import when web3-react supports ssr.
const Hero = dynamic(
  () => {
    return import('../components/Hero').then((module) => {
      return module.Hero
    })
  },
  { ssr: false },
)

// TODO: Remove dynamic import when web3-react supports ssr.
const History = dynamic(
  () => {
    return import('../components/History').then((module) => {
      return module.History
    })
  },
  { ssr: false },
)

// TODO: Remove dynamic import when web3-react supports ssr.
const Rules = dynamic(
  () => {
    return import('../components/Rules').then((module) => {
      return module.Rules
    })
  },
  { ssr: false },
)

// TODO: Remove dynamic import when web3-react supports ssr.
const Nav = dynamic(
  () => {
    return import('../components/Nav').then((module) => {
      return module.Nav
    })
  },
  { ssr: false },
)

// TODO: Remove dynamic import when web3-react supports ssr.
const Terms = dynamic(
  () => {
    return import('../components/Terms').then((module) => {
      return module.Terms
    })
  },
  { ssr: false },
)

const Home = () => {
  return (
    <>
      <Head>
        <title>Lottery</title>
        <meta name="description" content="Decentralized Lottery by DAPP-Z" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LotteryStatusProvider>
        <Nav />
        <Hero />
        <History />
        <Rules />
        <Terms />
      </LotteryStatusProvider>
    </>
  )
}

export default Home
