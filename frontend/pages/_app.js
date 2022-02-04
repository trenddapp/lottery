import { ThemeProvider } from "styled-components";
import { light } from "../theme";
import GlobalStyle from "../styles/Global";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={light}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
