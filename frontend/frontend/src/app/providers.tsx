"use client"

import { ThemeProvider } from "next-themes"
import { WagmiProvider } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit"
import "@rainbow-me/rainbowkit/styles.css"

//  Your real WalletConnect Project ID
const config = getDefaultConfig({
  appName: "ChainProof",
  projectId: "b270a43ee9db948a194a318af50dc096", // put your ID here
  chains: [mainnet, sepolia],
})

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {/*  chains here */}
          <RainbowKitProvider theme={darkTheme()}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}