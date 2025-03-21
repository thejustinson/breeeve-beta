"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthStatus() {
    const { authenticated, user } = usePrivy();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (authenticated && user) {
            console.log('✅ User is authenticated:', user);
            // if (pathname === '/auth') {
            //     router.replace('/dashboard');
            // }
        } else {
            // Check if user is on a dashboard path but not authenticated
            if (pathname.startsWith('/dashboard')) {
                console.log('❌ Unauthenticated user attempting to access dashboard');
                router.replace('/auth');
            }
        }
    }, [authenticated, user, pathname, router]);

    return null;
}