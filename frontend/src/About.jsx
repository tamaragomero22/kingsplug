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

                        <div className="about-grid">
                            <div className="about-card mission-card">
                                <h2>Our Mission</h2>
                                <p>
                                    Our mission is to make digital finance accessible to everyone. Inspired by the innovation behind Bitcoin, we believe in empowering individuals with financial freedom through secure, transparent, and decentralized technology.
                                </p>
                            </div>

                            <div className="about-card who-we-are-card">
                                <h2>Who We Are</h2>
                                <p>
                                    Founded by a team of young minds with blockchain developers, cybersecurity experts, and financial professionals, Kingsplug.com was created to bridge the gap between traditional finance and the digital economy. We combine cutting-edge technology with a user-friendly experience to ensure that exchanging cryptocurrencies to Naira is seamless and secure.
                                </p>
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
