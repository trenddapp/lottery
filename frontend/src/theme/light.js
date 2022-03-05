import base from './base'
import { lightColors } from './colors'

const lightTheme = {
  ...base,
  isDark: false,
  colors: lightColors,
  modal: {
    colors: {
      overlay: 'rgba(0, 0, 0, 0.35)',
      hover: '#F9FAFB',
    },
  },
}

export default lightTheme
