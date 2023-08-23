import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Header({ isAuth }) {
  const [searchTxt, setSearchTxt] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname;

  const handleSearch = () => {
    navigate("/search/" + searchTxt);
  };

  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  return (
    <header className="max-w-[1200px] m-auto">
      <nav className="lg:flex lg:justify-between lg:px-6">
        <div className="flex justify-between items-center px-6 my-6 ">
          <NavLink className="font-bold text-xl" to="/">
            LE COIN DES DESSERTS
          </NavLink>
          <div onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden">
            {mobileMenu ? (
              <img
                className="w-9"
                src="/src/assets/icons/icon-close.svg"
                alt=""
              />
            ) : (
              <img
                className="w-9"
                src="/src/assets/icons/icon-menu.svg"
                alt=""
              />
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 lg:gap-16 ">
          <ul className="md:flex gap-6 ">
            {isAuth ? (
              <li>
                {" "}
                <NavLink
                  to="/admin-management"
                  className={
                    pathname === "/admin-management"
                      ? "underline-offset-2 underline"
                      : "hover:underline-offset-2 hover:underline"
                  }
                >
                  Gérer le site
                </NavLink>
              </li>
            ) : null}
          </ul>
          <div className="md:flex gap-2 hidden">
            <form className="relative" onSubmit={() => handleSearch()}>
              <input
                className="bg-[#F4F4F5] px-2 py-2 rounded-md "
                placeholder="Rechercher"
                type="text"
                name=""
                value={searchTxt}
                onChange={(e) => setSearchTxt(e.target.value)}
                id=""
              />
              <img
                className="absolute top-1/2 right-3 -translate-y-1/2 "
                src="/src/assets/icons/search.png"
                alt=""
              />
            </form>
          </div>
        </div>

        {mobileMenu ? (
          <div className="flex w-full flex-col-reverse md:hidden items-center gap-2 lg:gap-16 ">
            <ul className="flex w-full flex-col divide-y-2 border-b-2  ">
              <NavLink to="/" className="p-2 w-full">
                Accueil
              </NavLink>
              <NavLink to="/desserts" className="p-2 w-full">
                Desserts
              </NavLink>
              <NavLink to="/conseils-et-astuces" className="p-2 w-full">
                Conseils et Astuces
              </NavLink>
            </ul>
            <form
              className="relative w-full flex gap-2 px-1"
              onSubmit={() => handleSearch()}
            >
              <input
                className="bg-[#F4F4F5] w-full p-1 rounded-md "
                placeholder="Rechercher"
                type="text"
                name=""
                value={searchTxt}
                onChange={(e) => setSearchTxt(e.target.value)}
                id=""
              />
              <button
                className="cursor-pointer px-3 py-1 rounded-md outline-2 outline outline-[#4B6BFB] duration-75 text-sm  bg-[#4B6BFB] bg-opacity-5 text-[#4B6BFB] font-semibold"
                type="submit"
              >
                Rechercher
              </button>
            </form>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
