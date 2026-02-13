import './Footer.css';

export const Footer = () => {
    return (
        <footer>
            <div className="container footer-container">
                <p>2025 10 KINGS GROUP. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/contact">Contact</a>
                </div>
            </div>
        </footer>
    );
};