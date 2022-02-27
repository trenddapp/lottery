import Head from 'next/head'
import dynamic from 'next/dynamic'

const LotteryStatusProvider = dynamic(
  () => import('../store/LotteryStatus').then((module) => module.LotteryStatusProvider),
  { ssr: false },
)

const Hero = dynamic(() => import('../components/Hero').then((module) => module.Hero), { ssr: false })

const History = dynamic(() => import('../components/History').then((module) => module.History), { ssr: false })

const Rules = dynamic(() => import('../components/Rules').then((module) => module.Rules), { ssr: false })

const Nav = dynamic(() => import('../components/Nav').then((module) => module.Nav), { ssr: false })

const Terms = dynamic(() => import('../components/Terms').then((module) => module.Terms), { ssr: false })

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
