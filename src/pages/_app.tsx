
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext'
import { ToastContainer, toast } from 'react-toastify';

const colors = {
  barber: {
    900: '#12131b',
    400: '#1b1c29',
    100: "#c6c6c6"
  },
  button: {
    cta: '#fba931',
    default: '#fff',
    gray: '#dfdfdf',
    danger: '#ff4040'
  },
  orange: {
    900: '#fba931'
  }
}

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer/>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
