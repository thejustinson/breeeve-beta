"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import {toSolanaWalletConnectors} from '@privy-io/react-auth/solana';

const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID as string;

if (!privyClientId) {
    throw new Error('Missing NEXT_PUBLIC_PRIVY_CLIENT_ID environment variable');
}

const solanaConnectors = toSolanaWalletConnectors();

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={privyClientId}
            config={{
                appearance: {
                    logo: 'https://pbs.twimg.com/profile_images/1900137034427031553/x94y6_J4_400x400.jpg',
                    accentColor: '#A390F5',
                    walletChainType: 'solana-only',
                    walletList: ['phantom', 'backpack', 'solflare', 'detected_wallets', 'wallet_connect'],
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
                externalWallets: {
                    solana: {
                        connectors: solanaConnectors
                    },
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}