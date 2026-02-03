import { RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from './firebaseClient';


export async function setupRecaptcha() {
    if (typeof window === 'undefined') {
        throw new Error('Recaptcha setup on server');
    }

    if ((window as any).recaptchaVerifier) {
        return (window as any).recaptchaVerifier;
    }

    const auth = firebaseAuth;

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
    });

    await verifier.render(); // 🔴 THIS IS CRITICAL

    (window as any).recaptchaVerifier = verifier;
    return verifier;
}
