import './footer.css';

export const Footer = () => {
    return (
        <footer>
            <div className="container footer-container">
                <p>&copy; 2025 Kingsplug Nigeria Limited. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/contact">Contact</a>
                </div>
            </div>
        </footer>
    );
};