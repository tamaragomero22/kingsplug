import { NavLink, Link } from 'react-router-dom';
import './Nav.css';
import homeIcon from './assets/home.svg';

export const Nav = () => {
    return (
        <header>
            <div id="headerContainer">
                <div>
                    <Link to="/" className="logo">Nyson</Link>
                </div>

                <nav>
                    <ul>
                        <li><NavLink to="/" className="nav-link-with-icon"><img src={homeIcon} alt="Home" />Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        <li><NavLink to="/login">Services</NavLink></li>
                        <li><NavLink to="/register">Sign up</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}