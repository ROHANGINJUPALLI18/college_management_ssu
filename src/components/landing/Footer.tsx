// Full footer with quick links, contact info, social icons, copyright
import React from "react";
import Link from "next/link";

const Footer = () => (
  <footer className="bg-[#2a1a5e] text-white py-12">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-semibold mb-4">Quick Contact</h3>
        <p>Campus: Namthang Bazar, South Sikkim</p>
        <p>Tollfree: +91 9599123451</p>
        <p>Email: info@ssu.ac.in</p>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Quick Links</h3>
        <ul>
          <li>
            <Link href="#about">About</Link>
          </li>
          <li>
            <Link href="#programs">Programs</Link>
          </li>
          <li>
            <Link href="#features">Features</Link>
          </li>
          <li>
            <Link href="#news">News</Link>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Social Media</h3>
        <div className="flex gap-4">
          <a
            href="https://www.facebook.com/people/SSUSikkim/100084095067483/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .733.592 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.311h3.587l-.467 3.622h-3.12v9.294h6.104c.729 0 1.322-.591 1.322-1.324v-21.35c0-.733-.593-1.325-1.324-1.325z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/sikkimskilluniversity/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.974.976 1.246 2.243 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.976-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.974-.976-1.246-2.243-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.976 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.072-1.276.06-2.548.334-3.522 1.308-.974.974-1.248 2.246-1.308 3.522-.06 1.28-.072 1.688-.072 4.947s.012 3.667.072 4.947c.06 1.276.334 2.548 1.308 3.522.974.974 2.246 1.248 3.522 1.308 1.28.06 1.688.072 4.947.072s3.667-.012 4.947-.072c1.276-.06 2.548-.334 3.522-1.308.974-.974 1.248-2.246 1.308-3.522.06-1.28.072-1.688.072-4.947s-.012-3.667-.072-4.947c-.06-1.276-.334-2.548-1.308-3.522-.974-.974-2.246-1.248-3.522-1.308-1.28-.06-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Copyright</h3>
        <p>&copy; 2026, Sikkim Skill University, Sikkim</p>
      </div>
    </div>
    <div className="mt-8 text-center text-xs text-gray-300">
      <p>For UI practice only. No backend logic is affected.</p>
    </div>
  </footer>
);

export default Footer;
