import React from 'react';
import "./Footer.css";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="footer">
            <div className="follow-for-more">
                <div className="follow-for-more-text">Follow For More Projects</div>
                <div className="follow-for-more-icons">
                    <a href="https://github.com/nimna29" className="github-logo" target="_blank" rel="noopener noreferrer">
                        <span className="visually-hidden">GitHub profile</span>
                    </a>
                    <a href="https://www.linkedin.com/in/nimna-niwarthana-4b7357207/" className="linkedin-logo" target="_blank" rel="noopener noreferrer">
                        <span className="visually-hidden">LinkedIn profile</span>
                    </a>
                </div>
            </div>
            <div className="end-of-footer">
                <nav className="footer-menu">
                    <ul className="footer-menu-text">
                        <li><a href="https://www.malditectist.com/">HOME</a></li>
                        <li><a href="https://www.malditectist.com/">ABOUT</a></li>
                        <li><a href="https://forms.gle/8xXmTnVY3yGbAVWP8" target="_blank" rel="noopener noreferrer">FEEDBACK</a></li>
                        <li><a href="https://www.malditectist.com/">TERMS & CONDITIONS</a></li>
                    </ul>
                </nav>
                <div className="footer-end">
                    <p className="footer-end-text">
                        © {currentYear} Nimna Niwarthana - All rights reserved <br />
                        &lt;/&gt; WITH ❤️ BY Nimna Niwarthana - Final Year Project 2023
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
