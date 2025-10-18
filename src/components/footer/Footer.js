import './Footer.css';

const currentYear = new Date().getFullYear();

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© {currentYear} PcPal. All Rights Reserved.</p>

                <div className="footer-sections">
                    <div className="footer-section">
                        <p>You dream, we build!.</p>
                    </div>
                    <br />
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>Email: devdelta72@gmail.com</p>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;