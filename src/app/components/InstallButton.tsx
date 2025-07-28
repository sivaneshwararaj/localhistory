'use client';

import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

const InstallButton: React.FC = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isClient, setIsClient] = useState(false); // <-- NEW STATE

    // This effect runs ONLY on the client, after the initial render
    useEffect(() => {
        setIsClient(true); // Set to true once mounted
    }, []);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as BeforeInstallPromptEvent);
        };

        // We only add the event listener if we are on the client
        if (isClient) {
            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        }

        return () => {
            if (isClient) {
                window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            }
        };
    }, [isClient]); // <-- Re-run when isClient changes

    const handleInstallClick = async () => {
        if (!installPrompt) return;
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        }
        setInstallPrompt(null);
    };

    // On the server, and during the first client render, isClient is false, so we render nothing.
    // We only render the button if we are on the client AND the install prompt is available.
    if (!isClient || !installPrompt) {
        return null;
    }

    return (
        <button className="install-button" onClick={handleInstallClick}>
            Install App
        </button>
    );
};

export default InstallButton;