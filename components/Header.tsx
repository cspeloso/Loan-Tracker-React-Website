"use client";

import { useEffect } from "react";

export default function Header() {

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <nav className="navbar navbar-light bg-light px-3">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between">
        <a className="navbar-brand" href="/">
          Finance
        </a>

        <div className="d-flex gap-3 flex-wrap align-items-center">

          {/* Loans Dropdown */}
          <div className="dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="loansDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Loans
            </a>
            <ul className="dropdown-menu" aria-labelledby="loansDropdown">
              <li>
                <a className="dropdown-item" href="/loans">
                  View All Loans
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/loans/new">
                  Add a Loan
                </a>
              </li>
            </ul>
          </div>

          {/* Accounts Link */}
          <a className="nav-link" href="/accounts">
            Accounts
          </a>

        </div>
      </div>
    </nav>
  );
}