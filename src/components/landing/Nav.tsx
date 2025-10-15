import { Link } from "react-router-dom";
import { LogoIcon } from "../../assets/svg";
import Button from "../../common/ui/button";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

function Nav() {
  const [showHeader, setShowHeader] = useState(true);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(window.scrollY);
  const dropDownRef = useRef<HTMLLIElement | null>(null);

  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist-cta");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Add inside your Nav component
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = ""; // restore scroll
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  // Auto-close dropdown when mobileMenuOpen closes
  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileDropdownOpen(false);
    }
  }, [mobileMenuOpen]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node)
      ) {
        setDesktopDropdownOpen(false);
      }
    };

    if (desktopDropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [desktopDropdownOpen]);

  return (
    <motion.header
      className="fixed left-0 w-full z-50 md:top-11 top-2 px-4"
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : "-30vh" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <nav className="max-w-4xl w-full mx-auto ">
        <div className="flex items-center w-full bg-white p-3 rounded-4xl">
          {/* Logo */}
          <div className="flex gap-2 items-center flex-1">
            <LogoIcon />
            <p className="text-2xl font-bold text-black hidden md:block">
              catalyze
            </p>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex flex-1 gap-6 items-center justify-between">
            <ul className="flex gap-6 justify-between w-full items-center text-gray-700 text-base font-bold capitalize relative">
              {/* Dropdown */}
              <li className="relative" ref={dropDownRef}>
                <button
                  onClick={() => setDesktopDropdownOpen((prev) => !prev)}
                  className="flex gap-1 items-center"
                >
                  <span>company</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      desktopDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {desktopDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-5 left-0 w-40 bg-white shadow-lg rounded-lg p-2 z-50"
                    >
                      <ul className="flex flex-col text-sm font-medium text-gray-700">
                        <li className="hover:bg-slate-200 p-2">
                          <Link to="/about">About Us</Link>
                        </li>
                        <li className="hover:bg-slate-200 p-2">
                          <Link to="/careers">Careers</Link>
                        </li>
                        <li className="hover:bg-slate-200 p-2">
                          <Link to="/team">Our Team</Link>
                        </li>
                        <li className="hover:bg-slate-200 p-2">
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

            <div className="md:block hidden">
              <Button
                variants="primary"
                classes="text-base text-nowrap px-6 py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
                handleClick={scrollToWaitlist}
              >
                Join waitlist
              </Button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="sm:hidden relative z-[9999]">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg  hover:bg-neutral-50"
            >
              {mobileMenuOpen ? (
                <X size={22} className="text-gray-700" />
              ) : (
                <Menu size={22} className="text-gray-700" />
              )}  
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          <motion.div
            initial={{ x: "100%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            animate={
              mobileMenuOpen
                ? { x: "0" }
                : {
                    x: "100%",
                  }
            }
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)} // backdrop closes menu
          >
            {/* Drawer */}
            <motion.div
              className="absolute inset-0 h-full w-full bg-white px-4 py-2 flex flex-col justify-between shadow-lg"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              {/* Nav Links */}
              <ul className="flex flex-col gap-6 pr-4 mt-24 [&>li]:border-b [&>li]:border-gray-100/40 [&>li]:pb-4  text-gray-700 text-base font-bold capitalize flex-1">
                <li>
                  <button
                    onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    className="flex items-center justify-between w-full"
                  >
                    <span>Company</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        mobileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 pl-4 flex flex-col gap-4 text-sm font-medium text-gray-700"
                      >
                        <Link
                          to="/about"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          About Us
                        </Link>
                        <Link
                          to="/careers"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Careers
                        </Link>
                        <Link
                          to="/team"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Our Team
                        </Link>
                        <Link
                          to="/contact"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Contact
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                <li>
                  <Link to="/features" onClick={() => setMobileMenuOpen(false)}>
                    features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                    pricing
                  </Link>
                </li>
              </ul>

              {/* Button pinned at bottom */}
              <div className="pt-6">
                <Button
                  fullWidth
                  variants="primary"
                  classes="w-full text-sm py-3 font-bold shadow-[inset_4px_4px_16px_#0647DF]"
                  handleClick={() => {
                    setMobileMenuOpen(false);
                    scrollToWaitlist();
                  }}
                >
                  Join waitlist
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

export default Nav;
