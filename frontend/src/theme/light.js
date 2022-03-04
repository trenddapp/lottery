import base from './base'

const lightTheme = {
  ...base,
  isDark: false,
  colors: {
    action: '#145C92',
    background: '#FFFFFF',
    backgroundAlt: '#F5F5F5',
    border: '#E9E9E9',
    borderAlt: '#CCCCCC',
    headline: '#333333',
    text: '#4E4E4E',
    error: '#BBOA21',
  },
  modal: {
    colors: {
      overlay: 'rgba(0, 0, 0, 0.35)',
      hover: '#F9FAFB',
    },
  },
}

export default lightTheme
