import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Img } from "react-image";

export default function Home({ postList }) {
  const [categoryDesserts, setCategoryDesserts] = useState("all");

  const [numberPostsVisibles, setNumberPostsVisibles] = useState(8);

  const filteredPosts =
    categoryDesserts === "all"
      ? postList.filter((item) => item.category === "recette")
      : postList.filter(
          (item) =>
            item.category === "recette" &&
            item.dessertCategory === categoryDesserts
        );

  const totalDesserts = filteredPosts.length;

  const handleSeeMore = () => {
    setNumberPostsVisibles(numberPostsVisibles + 6);
  };

  return (
    <div className="flex flex-col gap-[7rem] max-w-[1200px] m-auto">
      <section className="latest-recipes px-6">
        <span className=" text-2xl font-bold ">Faites vous plaisir</span>
        <div className="overflow-auto md:overflow-visible  ">
          <div className="flex gap-4 font-semibold mt-8 flex-nowrap ">
            <span
              onClick={() => setCategoryDesserts("all")}
              className={`cursor-pointer whitespace-nowrap duration-75 px-3 py-1 rounded-md ${
                categoryDesserts === "all"
                  ? " bg-[#4B6BFB] text-white "
                  : " hover:outline-2 hover:outline outline-[#4B6BFB] duration-75  bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB]"
              }`}
            >
              {" "}
              Toutes les recettes
            </span>
            <span
              onClick={() => setCategoryDesserts("Tarte")}
              className={`cursor-pointer whitespace-nowrap duration-75 px-3 py-1 rounded-md ${
                categoryDesserts === "Tarte"
                  ? " bg-[#4B6BFB] text-white "
                  : " hover:outline-2 hover:outline outline-[#4B6BFB] duration-75  bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB]"
              }`}
            >
              Tartes
            </span>
            <span
              onClick={() => setCategoryDesserts("Gâteau")}
              className={`cursor-pointer whitespace-nowrap duration-75 px-3 py-1 rounded-md ${
                categoryDesserts === "Gâteau"
                  ? " bg-[#4B6BFB] text-white "
                  : " hover:outline-2 hover:outline outline-[#4B6BFB] duration-75  bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB]"
              }`}
            >
              Gâteaux
            </span>
            <span
              onClick={() => setCategoryDesserts("Déjeuner/Goûter")}
              className={`cursor-pointer whitespace-nowrap duration-75 px-3 py-1 rounded-md ${
                categoryDesserts === "Déjeuner/Goûter"
                  ? " bg-[#4B6BFB] text-white "
                  : " hover:outline-2 hover:outline outline-[#4B6BFB] duration-75  bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB]"
              }`}
            >
              Déjeuners/Goûters
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-7  gap-7">
          {filteredPosts.slice(0, numberPostsVisibles).map((item, index) => {
            const tempsDePreparationTxt = item.tempsDePreparation.replace(
              ":",
              "h"
            );

            if (
              item.dessertCategory === categoryDesserts ||
              categoryDesserts === "all"
            ) {
              return (
                <NavLink to={"/desserts/" + item.slug}>
                  <div
                    className="p-4 border-[1px] shadow-sm border-gray-200 rounded-lg flex flex-col gap-4 items-start "
                    key={index}
                  >
                    <Img
                      src={item.imgCompressed} // Spécifiez l'URL ou le chemin de l'image
                      loader={<div>Chargement en cours...</div>} // Optionnel : un composant de chargement personnalisé pendant le chargement de l'image
                      unloader={<div>Impossible de charger l'image.</div>} // Optionnel : un composant de remplacement en cas d'échec du chargement de l'image
                      alt="Mon image" // Texte alternatif pour l'image
                      className="w-full lg:w-[345px] h-[230px] object-cover rounded-md"
                    />
                    {/* <img
                      className="w-full lg:w-[345px] h-[230px] object-cover rounded-md"
                      src={item.imageUrl}
                      alt=""
                    /> */}
                    <span
                      load
                      className="title bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB] text-[14px] font-medium px-3 py-1 rounded-md"
                    >
                      {item.dessertCategory}
                    </span>
                    <span className="font-semibold text-lg md:text-[24px] leading-[28px]  ">
                      {item.title}
                    </span>
                    <div className="infos flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <img
                          className="w-6"
                          src="/src/assets/icons/icon-time.svg"
                          alt=""
                        />
                        <span className="">Préparation : </span>

                        <span className="">{tempsDePreparationTxt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          className="w-6"
                          src="/src/assets/icons/icon-persons.svg"
                          alt=""
                        />{" "}
                        <span className="">{item.numberOfPersons}</span>
                      </div>
                    </div>
                  </div>
                </NavLink>
              );
            }
          })}
        </div>
        {numberPostsVisibles <= totalDesserts ? (
          <div className="w-full flex justify-center items-center">
            <button
              className="cursor-pointer whitespace-nowrap mt-14 text-lg font-semibold px-3 py-1 rounded-md hover:outline-2 hover:outline outline-[#4B6BFB] duration-75  bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB]"
              onClick={() => handleSeeMore()}
            >
              Voir plus
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
