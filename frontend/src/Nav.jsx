import { NavLink, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useState } from "react";
import "./Nav.css";
import homeIcon from "./assets/home.svg";
import logo from "./assets/kingsplug.png";

export const Nav = ({
  userEmail,
  firstName,
  onLogout,
  logoLinkTo = "/",
  hideSignUp = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header>
      <div id="headerContainer">
        <div>
          <Link to={logoLinkTo}>
            <img
              src={logo}
              alt="Kingsplug logo"
              className="logo"
            />
          </Link>
        </div>

        <button
          className="hamburger-menu"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={isMobileMenuOpen ? "open" : ""}></span>
          <span className={isMobileMenuOpen ? "open" : ""}></span>
          <span className={isMobileMenuOpen ? "open" : ""}></span>
        </button>

        <nav className={isMobileMenuOpen ? "mobile-menu-open" : ""}>
          <ul>
            {userEmail ? (
              <>
                <li>
                  <NavLink to="/dashboard" onClick={closeMobileMenu}>Wallet</NavLink>
                </li>
                <li className="user-email">Hi {firstName}</li>
                <li>
                  <button onClick={() => { onLogout(); closeMobileMenu(); }} className="nav-logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/" onClick={() => { window.scrollTo(0, 0); closeMobileMenu(); }}>
                    <img src={homeIcon} alt="Home" />
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" onClick={closeMobileMenu}>
                    About
                  </NavLink>
                </li>
                {!hideSignUp && (
                  <li>
                    <NavLink to="/register" onClick={closeMobileMenu}>Sign up</NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
