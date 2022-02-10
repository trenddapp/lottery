import Head from "next/head";
import { Hero } from "../components/Hero";
import { History } from "../components/History";
import { Rules } from "../components/Rules";
import { Terms } from "../components/Terms";

const Home = () => {
  return (
    <>
      <Head>
        <title>Lottery | dapp-z</title>
        <meta
          name="description"
          content="Decentralized lottery app by dapp-z."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <History />
      <Rules />
      <Terms />
    </>
  );
};

export default Home;
