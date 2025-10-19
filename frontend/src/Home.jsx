import { Link } from 'react-router-dom';
import { Nav } from './Nav';
import './Home.css';

export const Home = () => {
  return (
    <>
      <Nav />
      <div className="container">
        <div className="home-content">
          <div className="hero-text">
            <h1>Buy & sell <br />cryptocurrencies with ease</h1>
            <h3>
              Instantly get <b>&#8358;</b>aira equivalent of your crypto without stress.
              Nyson.com is a cryptocurrency platform that lets you convert you Bitcoin, ETH and USDT into Naira. 
            </h3>
            <Link to="/register">
              <button className="btn-signup">Create Account</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
