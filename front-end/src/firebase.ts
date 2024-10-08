// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
/* import { getAnalytics } from 'firebase/analytics'
 */// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-dbb5e.firebaseapp.com',
  projectId: 'mern-dbb5e',
  storageBucket: 'mern-dbb5e.appspot.com',
  messagingSenderId: '940605537049',
  appId: '1:940605537049:web:21639161c8e6da6d50a388',
  measurementId: 'G-TNWE0X7VQE'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
/* const analytics = getAnalytics(app)
 */

