import { useState, useEffect } from "react";
import type { CookieConsent } from "@/types";

const CONSENT_KEY = 'ueas_cookie_consent';

const useCookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(CONSENT_KEY);

        if (stored) return;
        const timer = setTimeout(() => {
            setIsVisible(true)
        },2000);
        return () => clearTimeout(timer);
    }, []);

    const saveConsent = (consent: CookieConsent) => {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        setIsVisible(false);
    };

    const acceptAll = () => {
        saveConsent({essential: true, analytics: true})
    };

    const declineAnalytics = () => {
        saveConsent({ essential: true, analytics: false})
    };

    return { isVisible, acceptAll, declineAnalytics }
}

export default useCookieConsent;