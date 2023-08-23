import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase-config";
import { deleteObject, ref } from "firebase/storage";

export default function Dessert({ postList, isAuth }) {
  const { slugName } = useParams();

  const deletePost = async (id, imageId) => {
    try {
      const postDoc = doc(db, "posts", id);
      await deleteDoc(postDoc);

      const imageRef = ref(storage, imageId);
      await deleteObject(imageRef);

      console.log("Le post et l'image ont été supprimés avec succès.");
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression du post et de l'image :",
        error
      );
    }
  };

  return (
    <div className="flex flex-col gap-[2rem] max-w-[850px] m-auto read-area">
      <div className="flex flex-col gap-2 items-start">
        {postList
          .filter((item) => item.slug === slugName)
          .map((x) => {
            const tempsDePreparationTxt = x.tempsDePreparation.replace(
              ":",
              "h"
            );

            return (
              <div className="flex flex-col gap-[2rem] px-6">
                <div className="flex flex-col gap-2 items-start">
                  <span className="title bg-[#4B6BFB] text-white px-3 py-1 rounded-md">
                    {x.dessertCategory}
                  </span>
                  <span className="text-[26px] md:text-[36px] md:leading-[40px]  font-semibold ">
                    <span>{x.title}</span>
                  </span>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-6"
                        src="/src/assets/icons/icon-persons.svg"
                        alt=""
                      />{" "}
                      <span className="">{x.numberOfPersons}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      className="w-6"
                      src="/src/assets/icons/icon-time.svg"
                      alt=""
                    />
                    <span className="">Préparation : </span>

                    <span className="">{tempsDePreparationTxt}</span>
                  </div>
                </div>

                <img
                  src={x.imageUrl}
                  alt=""
                  className="w-[850px] h-[490px] object-cover rounded-xl mb-8 "
                />
                <div
                  className="text-lg md:text-xl pl-6 md:pl-0"
                  dangerouslySetInnerHTML={{ __html: x.content }}
                ></div>

                {isAuth ? (
                  <div className="flex gap-4 items-center flex-wrap mt-8">
                    <span
                      onClick={() => deletePost(x.id, x.imageUrl)}
                      className="cursor-pointer px-3 py-1 rounded-md hover:outline-2 hover:outline outline-red-500 duration-75  bg-red-500 bg-opacity-5 text-red-500 font-semibold w-fit"
                    >
                      Supprimer cette recette
                    </span>
                    <NavLink
                      className="cursor-pointer px-3 py-1 rounded-md  hover:outline-2 hover:outline outline-[#4B6BFB] duration-75  bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB] font-semibold"
                      to={"/admin-edit/" + x.id}
                    >
                      Modifier cette recette
                    </NavLink>
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
}
