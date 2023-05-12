import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCt4AUNpjzt9O1BvoDJe0D17EnooiLT1Lc", // Your API_KEY
  authDomain: "pokemonscanner-f5548.firebaseapp.com", // Your PROJECT_ID.firebaseapp.com
  databaseURL: "https://pokemonscanner-f5548.firebaseio.com", // Your PROJECT_ID.firebaseio.com
  projectId: "pokemonscanner-f5548", // Your PROJECT_ID
  storageBucket: "pokemonscanner-f5548.appspot.com", // Your STORAGE_BUCKET
  messagingSenderId: "233401469394", // Your GCM_SENDER_ID
  appId: "1:233401469394:ios:5b4d7170263451912da00b", // Your GOOGLE_APP_ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default firebase;
