import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-ink text-cream/50 py-12 mt-auto border-t border-cream/5">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-xl font-serif font-black text-cream mb-6 tracking-tighter">
          PLATFORM
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Blog Platform. All rights reserved.
        </p>
        <p className="mt-2 text-xs opacity-50 font-mono">
          Made with passion for premium content.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
