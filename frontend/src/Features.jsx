import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Features.css";
import instantIcon from "./assets/icons/instant.png";
import secureIcon from "./assets/icons/secure.png";
import supportIcon from "./assets/icons/support.png";
import ratesIcon from "./assets/icons/rates.png";
import user1 from "./assets/images/user1.png";
import user2 from "./assets/images/user2.png";
import user3 from "./assets/images/user3.png";
import user4 from "./assets/images/user4.png";

export const Features = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section id="features" className="features-section">
        <h2 className="features-title">Why Choose Kingsplug Exchange?</h2>
        <div className="features-container">
          <div className="feature-card fade-up">
            <img
              src={instantIcon}
              alt="Instant Conversion Icon"
              className="feature-icon"
            />
            <h3>Instant Conversion</h3>
            <p>
              Convert your Bitcoin, Ethereum, or USDT to Naira instantly - no
              delays.
            </p>
          </div>

          <div className="feature-card fade-up">
            <img src={ratesIcon} alt="Rates Icon" className="feature-icon" />
            <h3>Best Exchange Rates</h3>
            <p>
              Enjoy competitive and transparent conversion rates with zero
              hidden fees.
            </p>
          </div>

          <div className="feature-card fade-up">
            <img
              src={secureIcon}
              alt="Security Icon"
              className="feature-icon"
            />
            <h3>Secure Transactions</h3>
            <p>
              Your funds and data are protected with top-tier encryption and
              security layers.
            </p>
          </div>

          <div className="feature-card fade-up">
            <img
              src={supportIcon}
              alt="Support Icon"
              className="feature-icon"
            />
            <h3>24/7 Support</h3>
            <p>
              We’re always available to assist you whenever you need help - day
              or night.
            </p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials-section">
        <h2 className="testimonials-title">What Our Users Say</h2>
        <div className="testimonial-container">
          <div className="testimonial-card">
            <img src={user1} alt="User 1" className="user-photo" />
            <p className="testimonial-text">
              “Kingsplug made my crypto-to-Naira conversion super fast. Highly
              recommended!”
            </p>
            <h4 className="user-name">— Ada Eze</h4>
          </div>

          <div className="testimonial-card">
            <img src={user2} alt="User 2" className="user-photo" />
            <p className="testimonial-text">
              “Their rates are fair and the support team is fantastic. Smooth
              experience every time.”
            </p>
            <h4 className="user-name">— Tunde Fasehun</h4>
          </div>

          <div className="testimonial-card">
            <img src={user3} alt="User 3" className="user-photo" />
            <p className="testimonial-text">
              “I’ve tried several platforms - Kingsplug is easily the best for
              instant payouts.”
            </p>
            <h4 className="user-name">- Faith Azuka</h4>
          </div>

          <div className="testimonial-card">
            <img src={user4} alt="User 3" className="user-photo" />
            <p className="testimonial-text">
              “Kingsplug is indeed king in the game. From their easy-to-use
              website, they're my no. 1 destination for exchange crypto.”
            </p>
            <h4 className="user-name">- Tejiri Akpobome</h4>
          </div>
        </div>

        <Link to="/register" className="cta-button">
          Get Started Now
        </Link>
      </section>
    </>
  );
};
