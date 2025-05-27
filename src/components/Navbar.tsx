import React from "react";
import { NavLink } from "react-router";

function Navbar() {
  return (
    <div className="navbar shadow-sm bg-neutral text-neutral-content">
      <div className="flex-1">
        <NavLink to={"/"} className="btn btn-ghost normal-case text-xl">
          Legions
        </NavLink>
      </div>
      <ul className="menu menu-horizontal px-1">
        <li>
          <NavLink to={"/players"}>Players</NavLink>
        </li>
        <li>
          <NavLink to={"/tierlist"}>Tierlist</NavLink>
        </li>
        <li>
          <NavLink to={"/changes"}>Recent Changes</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
