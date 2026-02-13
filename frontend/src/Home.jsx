import { Nav } from "./Nav";
import "./Home.css";
import LoginForm from "./LoginForm";
import { Footer } from "./Footer";
import { Features } from "./Features";
import WavyDivider from "./WavyDivider";

export const Home = () => {
  return (
    <>
      <Nav />

      <div className="container hero-section">
        <div className="home-content">
          <div className="hero-text">
            <h1>
              <span>
                Convert your <br />
              </span>
              <span>cryptocurrencies to </span>
              <span class="typewriter">
                <b>&#8358;</b>aira with ease.
              </span>
            </h1>
            <h3>
              Kingsplug Exchange is a trusted cryptocurrency platform that
              allows users to instantly convert their digital currencies - such
              as Bitcoin (BTC), Ethereum (ETH), Tether (USDT) and more - into
              ₦aira without stress.
            </h3>
          </div>

          <LoginForm />
        </div>
      </div>
      <WavyDivider />
      <Features />

      <Footer />
    </>
  );
};
