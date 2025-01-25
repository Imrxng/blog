import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div id="socials">
                <a href="https://github.com/Imrxng?tab=repositories" target="_blank"><i className="fa-brands fa-github"></i></a>
                <a href="https://www.linkedin.com/in/imran-g-b1b778255" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
            </div>
            <div>
                <p>&copy; 2024 Alle Rechten Voorbehouden.</p>
                <p>Door <span>Imran Ghaddoura</span></p>
            </div>
            <div>
                <a href="#top"><i className="fa-solid fa-angles-up"></i></a>
            </div>
        </footer>
    );
}

export default Footer;