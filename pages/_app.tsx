import './styles.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

import {
  EnvironmentProvider,
  getInitialProps,
} from 'providers/EnvironmentProvider'
import { ThemeProvider } from 'providers/ThemeProvider'
import { useEffect } from 'react'
import { ToastContainer } from 'common/Notification'
import Head from 'next/head'
import { Inter, Lexend } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'

// Load fonts with CSS variable strategy so Tailwind & globals can consume
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend', display: 'swap' })

require('@solana/wallet-adapter-react-ui/styles.css')

const App = ({
  Component,
  pageProps,
  cluster,
}: AppProps & { cluster: string }) => {
  // Ensure font variable classes are applied at the root (html) so global CSS selectors pick them up
  useEffect(() => {
    const html = document.documentElement
    html.classList.add(inter.variable, lexend.variable)
    return () => {
      html.classList.remove(inter.variable, lexend.variable)
    }
  }, [])
  return (
    <>
  <Head>
    <title>Hydra UI</title>
    <meta name="font-usage" content="Inter body, Lexend headings" />
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
              <TooltipProvider delayDuration={120} disableHoverableContent>
                {/* Attach font CSS vars to a wrapper div */}
                <div className={`${inter.variable} ${lexend.variable} font-sans`}> 
                  <Component {...pageProps} />
                </div>
              </TooltipProvider>
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
