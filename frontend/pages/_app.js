import "../styles/globals.css";
import { ThemeProvider } from "styled-components";
import { light } from "../theme";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={light}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
