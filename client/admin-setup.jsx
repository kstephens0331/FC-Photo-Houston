import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase-config"; // your config

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const auth = getAuth(app);

const callSetAdmin = async () => {
  await auth.signInWithEmailAndPassword("youremail@example.com", "your-password");

  const setAdmin = httpsCallable(functions, "setAdminClaim");
  await setAdmin({ uid: "YwUbgYIXoVbN3HnuPNx5LZh0aVwF3" });

  alert("✅ Admin claim set.");
};