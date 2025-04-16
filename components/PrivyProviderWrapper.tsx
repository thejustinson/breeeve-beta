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
                    logo: 'https://bfgigow6ix.ufs.sh/f/vN6pYuozuEaZ78uqIi2ny1gmtCrxaKqX58oQDdTVkMc4LsiE',
                    accentColor: '#A390F5',
                    walletChainType: 'solana-only',
                    walletList: ['phantom', 'detected_wallets', 'wallet_connect'],
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