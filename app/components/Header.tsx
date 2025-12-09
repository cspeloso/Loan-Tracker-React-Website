"use client";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Header() {
  return (
    <nav className="navbar navbar-light bg-light px-3">
      <a className="navbar-brand" href="/">
        Finance
      </a>

      <div className="d-flex gap-3">
        <a className="nav-link" href="/loans">
          Loans
        </a>
        <a className="nav-link" href="/accounts">
          Accounts
        </a>
      </div>
    </nav>
  );
}