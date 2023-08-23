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
      <nav className="flex justify-center gap-10 w-full px-6 my-6 ">
        <NavLink
          className="font-bold text-xl lg:text-2xl outline-offset-4 outline py-3 px-3 lg:px-4 lg:py-3 text-center"
          to="/"
        >
          LE COIN DES DESSERTS
        </NavLink>

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
        </div>
      </nav>
    </header>
  );
}
