import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: sans-serif;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export default GlobalStyle;
