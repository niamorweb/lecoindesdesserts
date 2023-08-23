import React from "react";
import { NavLink, useParams } from "react-router-dom";

export default function SearchPage({ postList }) {
  const { searchName } = useParams();

  return (
    <div>
      <div className="flex flex-col items-center gap-10">
        <span>Resultat(s) pour : "{searchName}"</span>
        {postList
          .filter((item) =>
            item.title.toLowerCase().includes(searchName.toLowerCase())
          )
          .map((item, index) => {
            return (
              <NavLink loading="lazy" to={"/desserts/" + item.slug}>
                <div
                  className="p-4 border-[1px] shadow-sm w-fit border-gray-200 rounded-lg flex flex-col lg:flex-row gap-8 items-start "
                  key={index}
                >
                  <img
                    className="w-[300px] h-[230px] object-cover rounded-md"
                    src={item.imageUrl}
                    alt=""
                  />
                  <div className="flex w-[300px] flex-col gap-4 items-start">
                    <span className="title bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB] text-[14px] font-medium px-3 py-1 rounded-md">
                      {item.dessertCategory}
                    </span>
                    <span className="font-semibold text-[24px] leading-[28px]  ">
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

                        {/* <span className="">{tempsDePreparationTxt}</span> */}
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          className="w-6"
                          src="/src/assets/icons/icon-persons.svg"
                          alt=""
                        />{" "}
                        <span className="">
                          Pour {item.numberOfPersons} personnes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            );
          })}
      </div>
    </div>
  );
}
