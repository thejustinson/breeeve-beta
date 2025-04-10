"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthStatus() {
    const { authenticated, user, ready } = usePrivy();
    const pathname = usePathname();
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        // Don't perform any redirects until Privy is ready
        if (!ready) return;
        
        // Prevent multiple redirects
        if (isNavigating) return;

        const handleNavigation = async () => {
            if (authenticated && user) {
                // Only redirect from auth page to dashboard if explicitly on the auth page
                if (pathname === '/auth') {
                    setIsNavigating(true);
                    await router.replace('/dashboard');
                }
            } else {
                // Protected routes that require authentication
                const protectedPaths = ['/dashboard', '/onboarding'];
                const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
                
                if (isProtectedRoute) {
                    setIsNavigating(true);
                    await router.replace('/auth');
                }
            }
        };

        handleNavigation();
    }, [authenticated, user, pathname, router, ready, isNavigating]);

    return null;
}