// ✅ Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8ouWfnnQ3YkpvRl65BZzjdwITHLLhhtc",
  authDomain: "ecolearn-7152f.firebaseapp.com",
  projectId: "ecolearn-7152f",
  storageBucket: "ecolearn-7152f.firebasestorage.app",
  messagingSenderId: "656526494781",
  appId: "1:656526494781:web:e49084105be0db03102e54",
  measurementId: "G-7FD6V3M1EL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const datab = getFirestore(app);

// ✅ Signup logic
document.getElementById("signupBtn").addEventListener("click", function (event) {
  event.preventDefault();

  // Get selected role
  const selectedRole = document.querySelector('input[name="userType"]:checked');
  const userType = selectedRole ? selectedRole.value : "";

  // Read and trim values
  const fullName = document.getElementById("name").value.trim();
  const schoolName = document.getElementById("school_name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Validate and show specific missing fields
  const missing = [];
  if (!userType) missing.push("Role");
  if (!fullName) missing.push("Full Name");
  if (!email) missing.push("Email");
  if (!password) missing.push("Password");

  if (missing.length > 0) {
    alert("Please fill in the following: " + missing.join(", "));
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // ✅ Use provided username or fallback to email prefix
      const username1 = username || email.split("@")[0];

      // ✅ Save user details for dashboard
      localStorage.setItem("username", username1);
      localStorage.setItem("userType", userType);

      // Save in Firestore
      return setDoc(doc(datab, "users", user.uid), {
        uid: user.uid,
        Name: fullName,
        schoolName: schoolName || "",
        username: username1,
        userType: userType,
        email: user.email
      }).then(() => {
        return userType; // pass along to next .then
      });
    })
    .then((userType) => {
      // Redirect
      if (userType === "student") {
        window.location.href = "../Student/studash.html";
      } else if (userType === "educator") {
        window.location.href = "../Instructor/EduDash.html";
      }
    })
    .catch((error) => {
      alert(error.message);
      console.error(error);
    });
});