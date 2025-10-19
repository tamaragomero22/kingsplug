import { NavLink, Link } from 'react-router-dom';
import './Nav.css';
import homeIcon from './assets/home.svg';
import logo from './assets/kingsplug.png';

export const Nav = () => {
    return (
        <header>
            <div id="headerContainer">
                <div>
                    <Link to="/"><img src={logo} alt="Kignsplug logo" /></Link>
                </div>

                <nav>
                    <ul>
                        <li><NavLink to="/"><img src={homeIcon} alt="Home" />Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        <li><NavLink to="/login">Services</NavLink></li>
                        <li><NavLink to="/register">Sign up</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}