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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header>
      <div id="headerContainer">
        <div>
          <Link to={logoLinkTo} onClick={closeMobileMenu}>
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
                <li className="user-profile-dropdown">
                  <button onClick={toggleDropdown} className="dropdown-toggle">
                    Hi {firstName} <span className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></span>
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link to="/change-password" onClick={closeMobileMenu}>Change Password</Link>
                      <button onClick={() => { onLogout(); closeMobileMenu(); }} className="dropdown-item">
                        Logout
                      </button>
                    </div>
                  )}
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
