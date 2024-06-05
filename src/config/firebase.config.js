import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyBOFp16or8IKkSrpjUR3hMfpDVKDXIV0xs',
  authDomain: 'ofriend-31059.firebaseapp.com',
  projectId: 'ofriend-31059',
  storageBucket: 'ofriend-31059.appspot.com',
  messagingSenderId: '410254964077',
  appId: '1:410254964077:web:453450816f6c0d64a65664',
  measurementId: 'G-4XB8G7H5Z9'
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const analytics = getAnalytics(app)

export { storage, app, analytics }
