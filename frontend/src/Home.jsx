import { Nav } from './Nav';
import './Home.css';
import LoginForm from './LoginForm';
import { Footer } from './Footer';

export const Home = () => {
  return (
    <>
      <Nav />
      
      <div className="container">
        <div className="home-content">
          <div className="hero-text">
            <h1>Convert your <br />cryptocurrencies to <b>&#8358;</b>aira with ease.</h1>
            <h3>
              Instantly get <b>&#8358;</b>aira equivalent of your crypto without stress. <b>Kingsplug Exchange</b> is a cryptocurrency platform that lets you convert you Bitcoin, ETH and USDT into Naira. 
            </h3>
          </div>

          <LoginForm />

        </div>
      </div>

      <Footer />
    </>
  );
};
