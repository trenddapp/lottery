import { ThemeProvider } from 'styled-components'
import { light } from '../theme'
import { GlobalStyle, ResetCss } from '../styles'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={light}>
      <ResetCss />
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
