import { Link } from "react-router-dom";
import { LogoIcon } from "../../assets/svg";
import Button from "../../common/ui/button";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

function Nav() {
  const [showHeader, setShowHeader] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastScrollY = useRef(window.scrollY);
  const dropDownRef = useRef<HTMLLIElement | null>(null);

  // Hide/show header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShowHeader(true);
      } else if (window.scrollY > lastScrollY.current) {
        setShowHeader(false); // scrolling down
      } else {
        setShowHeader(true); // scrolling up
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <motion.header
      className="fixed left-0 w-full z-50 top-11 px-4"
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : "-30vh" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <nav className="max-w-4xl w-full bg-white p-3 rounded-4xl mx-auto ">
        <div className="flex items-center w-full">
          {/* Logo */}
          <div className="flex gap-2 items-center flex-1">
            <LogoIcon />
            <p className="text-2xl font-bold text-black">catalyze</p>
          </div>

          {/* Links & Button */}
          <div className="flex-1 flex gap-6 items-center justify-between">
            <ul className="flex gap-6 items-center text-gray-700 text-base font-bold capitalize relative">
              {/* Dropdown */}
              <li className="relative" ref={dropDownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex gap-1 items-center"
                >
                  <span>company</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-0 w-40 bg-white shadow-lg rounded-lg p-2"
                    >
                      <ul className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                        <li>
                          <Link to="/about">About Us</Link>
                        </li>
                        <li>
                          <Link to="/careers">Careers</Link>
                        </li>
                        <li>
                          <Link to="/team">Our Team</Link>
                        </li>
                        <li>
                          <Link to="/contact">Contact</Link>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li>
                <Link to="/features">features</Link>
              </li>
              <li>
                <Link to="/pricing">pricing</Link>
              </li>
            </ul>

            <div>
              <Button
                variants="primary"
                classes="text-base text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
              >
                Join waitlist
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}

export default Nav;
