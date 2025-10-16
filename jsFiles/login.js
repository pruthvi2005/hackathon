// ✅ Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB8ouWfnnQ3YkpvRl65BZzjdwITHLLhhtc",
  authDomain: "ecolearn-7152f.firebaseapp.com",
  projectId: "ecolearn-7152f",
  storageBucket: "ecolearn-7152f.firebasestorage.app",
  messagingSenderId: "656526494781",
  appId: "1:656526494781:web:e49084105be0db03102e54",
  measurementId: "G-7FD6V3M1EL"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Login Button
document.getElementById("continueBtn").addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("emaillogin").value.trim();
  const password = document.getElementById("passwordlogin").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  // ✅ Login with Firebase
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    getDoc(doc(db, "users", user.uid))
    .then((userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // ✅ Use displayName if available, fallback to email prefix
        const username = userData.username || email.split("@")[0];

        // ✅ Save user details for dashboard
        localStorage.setItem("username", username);
        localStorage.setItem("userType", userData.userType);

        alert("Login successful!");

        // ✅ Redirect based on user type
        if (userData.userType === "educator") {
          window.location.href = "../Instructor/EduDash.html";
        } else {
          window.location.href = "../Student/studash.html";
        }
      }
      else{
        alert("No user data found in Firestore!");
      }
    }).catch((error) => {
      alert(error.message);
      console.error(error);
    });
  }).catch((error) => {
      alert(error.message);
      console.error(error);
  });
});