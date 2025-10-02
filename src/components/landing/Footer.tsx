import { Link } from "react-router-dom";
import { BannerLogo, LinkedinIcon, TwitterIcon } from "../../assets/svg";

function Footer() {
  return (
    <footer className="md:max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24">
      {/* Top section */}
      <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-20 pb-16">
        {/* Quick Links */}
        <div className="space-y-6 flex-1">
          <p className="text-xl md:text-2xl font-bold leading-7 capitalize">
            quick links
          </p>
          <ul className="text-black text-xs md:text-base font-semibold space-y-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/features">Features</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-6 flex-1">
          <p className="text-xl md:text-2xl font-bold leading-7 capitalize">
            resources
          </p>
          <ul className="text-black text-xs md:text-base font-semibold space-y-4">
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/learn">Learn</Link>
            </li>
            <li>
              <Link to="/support">Support</Link>
            </li>
            <li>
              <Link to="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Social & Info */}
        <div className="space-y-6 flex-1">
          
          <p className="text-xl md:text-2xl font-bold leading-7 capitalize">
            connect
          </p>
          <div className="space-y-4">
            <div className="flex gap-6">
              <Link
                className="size-10 rounded-full flex items-center justify-center bg-[#F3F3F3] hover:bg-gray-200 transition"
                to="https://linkedin.com"
                target="_blank"
              >
                <LinkedinIcon />
              </Link>
              <Link
                className="size-10 rounded-full flex items-center justify-center bg-[#F3F3F3] hover:bg-gray-200 transition"
                to="https://twitter.com"
                target="_blank"
              >
                <TwitterIcon />
              </Link>
            </div>
            
            <p className="text-xs md:text-base font-semibold text-gray-500 max-w-xs">
              © 2025 Catalyze. All rights reserved. Designed to empower your
              financial future.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Logo */}
      <div className="flex justify-center md:justify-start">
        <BannerLogo />
      </div>
    </footer>
  );
}

export default Footer;
