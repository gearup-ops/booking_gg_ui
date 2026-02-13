// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { Auth, getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAv8xnkDgfslKLCp9NrDlD6UKV1fsYFkog',
    authDomain: 'gearup-345f5.firebaseapp.com',
    projectId: 'gearup-345f5',
    storageBucket: 'gearup-345f5.firebasestorage.app',
    messagingSenderId: '316266297923',
    appId: '1:316266297923:web:a4e8a3f5058ca54b1cb2f6',
    measurementId: 'G-6D7H08EPXG',
};

// Initialize Firebase
let app: any;
let auth: Auth | undefined;

if (typeof window !== 'undefined') {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }

    if (typeof window !== 'undefined') {
        auth = getAuth(app);
    }

    isSupported().then((supported) => {
        if (supported) {
            getAnalytics(app);
        }
    });
}

export const firebaseAuth = auth!;

// Setup Recaptcha
// export const setupRecaptcha = async () => {
//     if (typeof window === 'undefined') return;
//     if (typeof window !== 'undefined') {
//         const { RecaptchaVerifier } = await import('firebase/auth');
//         if (!(window as any).recaptchaVerifier) {
//             (window as any).recaptchaVerifier = new RecaptchaVerifier(
//                 firebaseAuth!,
//                 'recaptcha-container',
//                 { size: 'invisible' }
//             );
//         }
//     }
// };
