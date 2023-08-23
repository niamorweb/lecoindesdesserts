import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CreatePostRecipe from "../components/CreatePostRecipe";

export default function AdminAutorized({ setIsAuth, isAuth }) {
  const navigate = useNavigate();

  useEffect(() => {
    isAuth ? null : navigate("/");
  }, []);

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
    });
    navigate("/");
  };

  return (
    <div className="max-w-[1200px] m-auto">
      {isAuth ? (
        <div className="flex flex-col gap-[10rem] ">
          <div className="flex justify-center gap-4">
            <span className="cursor-pointer  duration-75 px-3 py-1 rounded-md bg-[#4B6BFB] text-white ">
              Créer une recette/post
            </span>
            <span
              onClick={() => signUserOut()}
              className="cursor-pointer px-3 py-1 rounded-md hover:outline-2 hover:outline outline-red-500 duration-75  bg-red-500 bg-opacity-5 text-red-500"
            >
              Se déconnecter
            </span>
          </div>
          <CreatePostRecipe isAuth={isAuth} />
        </div>
      ) : null}
    </div>
  );
}
