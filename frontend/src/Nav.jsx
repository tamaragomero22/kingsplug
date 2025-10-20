import { NavLink, Link } from 'react-router-dom';
import './Nav.css';
import homeIcon from './assets/home.svg';
import logo from './assets/kingsplug.png';

export const Nav = ({ userEmail, onLogout, logoLinkTo = "/" }) => {
    return (
        <header>
            <div id="headerContainer">
                <div>
                    <Link to={logoLinkTo}><img src={logo} alt="Kignsplug logo" /></Link>
                </div>

                <nav>
                    <ul>
                        {userEmail ? (
                            <>
                                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                                <li className="user-email">{userEmail}</li>
                                <li><button onClick={onLogout} className="nav-logout-btn">Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><NavLink to="/"><img src={homeIcon} alt="Home" />Home</NavLink></li>
                                <li><NavLink to="/about">About</NavLink></li>
                                <li><NavLink to="/register">Sign up</NavLink></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    )
}