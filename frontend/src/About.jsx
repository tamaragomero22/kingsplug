import React, { useEffect } from 'react';
import './About.css';
import { Nav } from './Nav';
import { Footer } from './Footer';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Nav />
            <div className="about-container">
                <section className="about-hero">
                    <div className="container">
                        <h1>About Us</h1>
                        <p className="hero-subtitle">The Future of Digital Finance</p>
                    </div>
                </section>

                <section className="about-content">
                    <div className="container">
                        <div className="about-card intro-card">
                            <p>
                                Welcome to <strong>Kingsplug.com</strong> — a company designed and managed by <strong>10 KINGS GROUP</strong>, a trusted and secure platform designed to make cryptocurrency trading simple, fast, and reliable. We are a next-generation Bitcoin exchange built for both beginners taking their first step into digital assets and experienced traders seeking advanced tools and deep liquidity.
                            </p>
                        </div>

                        <div className="about-highlight-card">
                            <div className="highlight-content">
                                <section className="highlight-section">
                                    <h3>Who We Are</h3>
                                    <p>
                                        Founded by a team of young minds, blockchain developers, cybersecurity experts, and financial professionals, Kingsplug.com was created to bridge the gap between traditional finance and the digital economy. We are a dedicated team committed to providing a reliable and secure platform for all your digital asset needs.
                                    </p>
                                </section>

                                <div className="highlight-divider"></div>

                                <section className="highlight-section">
                                    <h3>Our Mission</h3>
                                    <p>
                                        Our mission is to make digital finance accessible to everyone. Inspired by the innovation behind Bitcoin, we believe in empowering individuals with financial freedom through secure, transparent, and decentralized technology. We combine cutting-edge technology with a user-friendly experience to ensure that exchanging cryptocurrencies to Naira is seamless and secure.
                                    </p>
                                </section>
                            </div>
                        </div>

                        <div className="about-card offers-card">
                            <h2>What We Offer</h2>
                            <p>At Kingsplug.com, we make buying and selling Bitcoin simple, fast, and secure. Here’s what you can expect:</p>

                            <div className="offers-grid">
                                <div className="offer-item">
                                    <span className="offer-number">01</span>
                                    <h3>Instant Bitcoin to Naira Conversion</h3>
                                    <p>Convert your Bitcoin (BTC) to Nigerian Naira (NGN) in minutes at competitive, real-time market rates. No hidden charges. No unnecessary delays.</p>
                                </div>
                                <div className="offer-item">
                                    <span className="offer-number">02</span>
                                    <h3>Fast Naira Payouts</h3>
                                    <p>Get paid directly into your Nigerian bank account with quick processing times. We prioritize speed so you can access your funds when you need them.</p>
                                </div>
                                <div className="offer-item">
                                    <span className="offer-number">03</span>
                                    <h3>Secure Transactions</h3>
                                    <p>Your security is our top priority. We use advanced encryption and strict verification processes to ensure every transaction is safe and protected.</p>
                                </div>
                                <div className="offer-item">
                                    <span className="offer-number">04</span>
                                    <h3>Transparent Pricing</h3>
                                    <p>Enjoy clear, upfront rates with no hidden fees. What you see is what you get.</p>
                                </div>
                                <div className="offer-item">
                                    <span className="offer-number">05</span>
                                    <h3>24/7 Customer Support</h3>
                                    <p>Our dedicated support team is available around the clock to assist you with any questions or issues.</p>
                                </div>
                                <div className="offer-item">
                                    <span className="offer-number">06</span>
                                    <h3>Easy-to-Use Platform</h3>
                                    <p>Our platform is designed for everyone — whether you’re a beginner or an experienced crypto trader. Smooth interface, simple steps, zero stress.</p>
                                </div>
                                <div className="offer-item">
                                    <span className="offer-number">07</span>
                                    <h3>Trusted & Reliable Service</h3>
                                    <p>We are committed to providing a dependable exchange service you can trust, with a growing community of satisfied users.</p>
                                </div>
                            </div>
                        </div>

                        <div className="about-grid">
                            <div className="about-card security-card">
                                <h2>Security First</h2>
                                <p>
                                    We prioritize your safety. Our platform uses advanced encryption, multi-signature wallets, cold storage solutions, and strict compliance procedures to safeguard your transactions and personal information.
                                </p>
                            </div>

                            <div className="about-card trust-card">
                                <h2>Transparency & Trust</h2>
                                <p>
                                    Trust is the foundation of everything we do. We maintain clear fee structures, real-time reporting, and compliance with Nigerian and global regulatory standards to ensure confidence in every transaction.
                                </p>
                            </div>
                        </div>

                        <section className="team-section">
                            <h2>Our Team</h2>
                            <div className="team-grid">
                                {/* The Visionary - Prominent Card */}
                                <div className="team-card">
                                    <div className="team-image-wrap">
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000" alt="Kingsplug Founder" />
                                    </div>
                                    <div className="team-info">
                                        <h3>Joshua Kings</h3>
                                        <span className="team-role">Founder & CEO</span>
                                        <p className="team-bio">
                                            As the visionary founder and CEO of Kingsplug, Joshua brings his tenacious entrepreneurial spirit to drive the company's mission of pioneering innovation in the digital world. His unwavering commitment to excellence leads the team towards a brighter, more connected future for digital finance.
                                        </p>
                                    </div>
                                </div>

                                {/* Management Team */}
                                <div className="team-card">
                                    <div className="team-image-wrap">
                                        <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1000" alt="Executive" />
                                    </div>
                                    <div className="team-info">
                                        <h3>Emma Richardson</h3>
                                        <span className="team-role">Chief Strategy Officer</span>
                                        <p className="team-bio">
                                            Emma plays a pivotal role in translating big ideas into actionable strategies. With a keen eye for market trends, she ensures that Kingsplug app exceeds customer expectations and stays ahead of the curve.
                                        </p>
                                    </div>
                                </div>

                                <div className="team-card">
                                    <div className="team-image-wrap">
                                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000" alt="Product Designer" />
                                    </div>
                                    <div className="team-info">
                                        <h3>David Adeleke</h3>
                                        <span className="team-role">Head of Product Design</span>
                                        <p className="team-bio">
                                            David is the creative force behind Kingsplug's product and brand designs. He crafts compelling experiences that resonate with our users, ensuring the platform remains intuitive and visually appealing.
                                        </p>
                                    </div>
                                </div>

                                <div className="team-card">
                                    <div className="team-image-wrap">
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000" alt="Customer Success" />
                                    </div>
                                    <div className="team-info">
                                        <h3>Sarah Johnson</h3>
                                        <span className="team-role">Head of Customer Success</span>
                                        <p className="team-bio">
                                            Sarah leads our support team with dedication. She is committed to providing exceptional assistance, ensuring that all inquiries are addressed promptly and with empathy for every user.
                                        </p>
                                    </div>
                                </div>

                                <div className="team-card">
                                    <div className="team-image-wrap">
                                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000" alt="CTO" />
                                    </div>
                                    <div className="team-info">
                                        <h3>Michael Chen</h3>
                                        <span className="team-role">Chief Technology Officer</span>
                                        <p className="team-bio">
                                            Michael is the driving force behind Kingsplug's marketing and technical growth. His expertise in the crypto landscape allows him to showcase our unique offerings to the right audience.
                                        </p>
                                    </div>
                                </div>

                                <div className="team-card">
                                    <div className="team-image-wrap">
                                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000" alt="HR" />
                                    </div>
                                    <div className="team-info">
                                        <h3>Princess Okafor</h3>
                                        <span className="team-role">HR & Operations Manager</span>
                                        <p className="team-bio">
                                            Princess ensures that our team is nurtured and motivated. She is committed to building a positive work culture, fostering a collaborative environment where every member thrives.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="about-card vision-card">
                            <h2>Our Vision</h2>
                            <p>
                                We envision a world where digital currencies are seamlessly integrated into everyday life — where sending value is as easy as sending a message. By continuously innovating and expanding our services, we aim to become a global leader in digital asset exchange.
                            </p>
                            <div className="vision-footer">
                                <p>At Kingsplug.com, we’re not just building an exchange — we’re building the future of finance.</p>
                                <p className="join-us">Join us and experience the power of digital currency today.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default About;
