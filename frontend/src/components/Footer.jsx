import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-deep-purple py-12 border-t border-white/5">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm text-light-purple/60">
                    © {new Date().getFullYear()} OmniaTickets. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
