// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseAuth = getAuth(app);

// Setup Recaptcha
export const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
            firebaseAuth,
            'recaptcha-container', // <div> id where recaptcha renders
            {
                size: 'invisible', // invisible is smoother UX
                callback: () => {
                    console.log('Recaptcha verified');
                },
            }
        );
    }
};
