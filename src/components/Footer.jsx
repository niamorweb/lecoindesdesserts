import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#F6F6F7] border-[1px] border-[#E8E8EA] px-6">
      <div className="flex flex-col gap-4 md:flex-row items-center justify-between border-t-2 border-[#DCDDDF] py-10">
        <div className="flex justify-between w-full items-center gap-2">
          <span className="font-semibold">LE COIN DES DESSERTS</span>
          <span className="text-sm  ">Tout droit réservé - 2023</span>
        </div>
      </div>
    </footer>
  );
}
