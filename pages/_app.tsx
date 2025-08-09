import './styles.css'
import 'common/styles.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

import {
  EnvironmentProvider,
  getInitialProps,
} from 'providers/EnvironmentProvider'
import { ThemeProvider } from 'providers/ThemeProvider'
import { useMemo } from 'react'
import { ToastContainer } from 'common/Notification'
import Head from 'next/head'

require('@solana/wallet-adapter-react-ui/styles.css')

const App = ({
  Component,
  pageProps,
  cluster,
}: AppProps & { cluster: string }) => {
  return (
    <>
    <Head>
        <title>Hydra UI</title>
    </Head>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="hydra-ui-theme"
    >
      <EnvironmentProvider defaultCluster={cluster}>
      <WalletProvider
        wallets={[]}
      >
{/*         <WalletIdentityProvider>
 */}          <WalletModalProvider>
            <>
              <ToastContainer />
              <Component {...pageProps} />
            </>
          </WalletModalProvider>
{/*         </WalletIdentityProvider>
 */}      </WalletProvider>
      </EnvironmentProvider>
    </ThemeProvider>
    </>
  )
}

App.getInitialProps = getInitialProps

export default App
