"use client";

import Link from "next/link";
import { appHook } from "@/context/AppProvider";

export default function Navbar() {
  const { logout, authToken } = appHook();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" href="/">
          ShowcaseHub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {authToken ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/auth">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
