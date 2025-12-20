import { NavLink, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
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
  return (
    <header>
      <div id="headerContainer">
        <div>
          <Link to={logoLinkTo}>
            <img
              src={logo}
              alt="Kignsplug logo"
              style={{ marginTop: "20px" }}
            />
          </Link>
        </div>

        <nav>
          <ul>
            {userEmail ? (
              <>
                <li>
                  <NavLink to="/dashboard">Wallet</NavLink>
                </li>
                <li className="user-email">Hi {firstName}</li>
                <li>
                  <button onClick={onLogout} className="nav-logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/">
                    <img src={homeIcon} alt="Home" />
                    Home
                  </NavLink>
                </li>
                <li>
                  <HashLink smooth to="/#features">
                    About
                  </HashLink>
                </li>
                {!hideSignUp && (
                  <li>
                    <NavLink to="/register">Sign up</NavLink>
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
