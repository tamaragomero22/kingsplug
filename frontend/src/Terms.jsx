import React from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';
import './Terms.css';

const Terms = () => {
    return (
        <div className="terms-container">
            <Nav />

            <header className="terms-hero">
                <div className="container">
                    <h1>Terms of Service</h1>
                    <p>Welcome to Kingsplug.com. These terms govern your use of our platform and services.</p>
                </div>
            </header>

            <main className="terms-content">
                <div className="container">
                    <section className="terms-section">
                        <p>
                            Welcome to Kingsplug.com, a cryptocurrency exchange platform that enables users to sell Bitcoin (Cryptocurrency) in exchange for Nigerian Naira (NGN). By accessing or using our website, mobile application, or services, you agree to be bound by these Terms of Service (“Terms”). Please read them carefully.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>1.</span> Eligibility</h2>
                        <p>By using our Platform, you represent and warrant that:</p>
                        <ul>
                            <li>You are at least 18 years old.</li>
                            <li>You have full legal capacity to enter into a binding agreement.</li>
                            <li>You are not prohibited from using cryptocurrency services under applicable laws.</li>
                            <li>All information you provide is accurate and up to date.</li>
                        </ul>
                        <p>We reserve the right to suspend or terminate accounts that do not meet eligibility requirements.</p>
                    </section>

                    <section className="terms-section">
                        <h2><span>2.</span> Account Registration & Verification</h2>
                        <p>To access trading services, you must create an account and complete identity verification (KYC).</p>
                        <p>You agree to:</p>
                        <ul>
                            <li>Provide truthful and accurate information.</li>
                            <li>Maintain the confidentiality of your login credentials.</li>
                            <li>Notify us immediately of any unauthorized access.</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2><span>3.</span> Services Provided</h2>
                        <p>Our Platform allows users to:</p>
                        <ul>
                            <li>Exchange Bitcoin and other cryptocurrencies supported digital assets to Nigerian Naira (NGN).</li>
                            <li>Deposit and withdraw NGN through supported banking channels.</li>
                        </ul>
                        <p>We do not guarantee uninterrupted access and may modify or suspend services at any time.</p>
                    </section>

                    <section className="terms-section">
                        <h2><span>4.</span> Fees & Charges</h2>
                        <p>
                            All applicable fees, including exchange fees, withdrawal fees, and deposit charges, will be clearly displayed on the Platform.
                        </p>
                        <p>We reserve the right to adjust fees with prior notice.</p>
                    </section>

                    <section className="terms-section">
                        <h2><span>5.</span> Prohibited Activities</h2>
                        <p>You agree not to use the Platform for:</p>
                        <ul>
                            <li>Money laundering or terrorist financing</li>
                            <li>Fraudulent or deceptive activities</li>
                            <li>Market manipulation</li>
                            <li>Violating Nigerian or international laws</li>
                            <li>Circumventing account limits or verification processes</li>
                        </ul>
                        <p>We reserve the right to freeze or terminate accounts involved in suspicious activities.</p>
                    </section>

                    <section className="terms-section">
                        <h2><span>6.</span> Withdrawals (Naira – NGN)</h2>
                        <ul>
                            <li>Users must ensure bank details provided are accurate.</li>
                            <li>Deposits may be subject to verification before being credited.</li>
                            <li>Processing times may vary depending on banking partners.</li>
                        </ul>
                        <p>We are not responsible for delays caused by financial institutions or incorrect banking details.</p>
                    </section>

                    <section className="terms-section">
                        <h2><span>7.</span> Intellectual Property</h2>
                        <p>
                            All content, logos, software, and materials on the Platform are owned by 10 KINGS GROUP and protected under applicable intellectual property laws. Unauthorized use is strictly prohibited.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>8.</span> Limitation of Liability</h2>
                        <p>To the fullest extent permitted by law, Kingsplug shall not be liable for:</p>
                        <ul>
                            <li>Indirect or consequential damages</li>
                            <li>Losses resulting from technical failures or third-party services</li>
                            <li>Losses arising from user negligence or unauthorized account access</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2><span>9.</span> Account Suspension & Termination</h2>
                        <p>We reserve the right to suspend, restrict, or terminate your account if:</p>
                        <ul>
                            <li>You violate these Terms</li>
                            <li>We suspect fraudulent activity</li>
                            <li>Required by law or regulatory authority</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2><span>11.</span> Amendments</h2>
                        <p>
                            We may update these Terms from time to time. Continued use of the Platform after updates constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>12.</span> Governing Law</h2>
                        <p>
                            These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of Nigerian courts.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>13.</span> Contact Information</h2>
                        <p>For inquiries regarding these Terms, please contact:</p>
                        <div className="contact-box">
                            <div className="contact-item">
                                <strong>Email:</strong>
                                <a href="mailto:support@kingsplug.com">support@kingsplug.com</a>
                            </div>
                            <div className="contact-item">
                                <strong>Address:</strong>
                                <span>10 KINGS GROUP, Nigeria</span>
                            </div>
                        </div>
                    </section>

                    <div className="last-updated">
                        By creating an account or using our Platform, you confirm that you have read, understood, and agreed to these Terms of Service.
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
