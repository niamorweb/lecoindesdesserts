import React, { useState } from "react";
import { auth } from "../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminLogin({ setIsAuth, isAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        error.message = "Le mot de passe est incorrect. Veuillez réessayer.";

        setError(error.message);
        return;
      }
      if (error.code === "auth/wrong-password") {
        error.message = "Le mot de passe est incorrect. Veuillez réessayer.";
      }
      setError(error.message);
    }
  };

  useEffect(() => {
    isAuth ? navigate("/admin-management") : null;
  }, []);

  return (
    <div className="flex flex-col gap-1 bg-white p-6 shadow-md rounded-lg  max-w-[390px] mx-auto">
      <span className="font-semibold text-[18px] text-center">Connexion</span>
      <form
        className="flex flex-col gap-2 mt-3"
        onSubmit={handleSubmit}
        action=""
      >
        {error && <p>{error}</p>}
        <input
          placeholder="Votre Email"
          className="py-2 px-3 border-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Votre mot de passe"
          className="py-2 px-3 border-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="cursor-pointer bg-[#4B6BFB] font-medium py-3 rounded-md text-white "
          type="submit"
          value="Se connecter"
        />
      </form>
    </div>
  );
}
