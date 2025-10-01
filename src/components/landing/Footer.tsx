import { Link } from "react-router-dom";
import { BannerLogo, LinkedinIcon, TwitterIcon } from "../../assets/svg";

function Footer() {
  return (
    <footer className="max-w-[65rem] mx-auto pt-34">
      <div className="flex justify-between pb-24">
        <div className="space-y-6">
          <p className="text-2xl font-bold leading-7 capitalize">quick links</p>
          <ul className="text-black text-base font-semibold space-y-6">
            <li>
              <Link to={""}>Home</Link>
            </li>
            <li>
              <Link to={""}>Features</Link>
            </li>
            <li>
              <Link to={""}>contact</Link>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <p className="text-2xl font-bold leading-7 capitalize">Resources</p>
          <ul className="text-black text-base font-semibold space-y-6">
            <li>
              <Link to={""}>Blog</Link>
            </li>
            <li>
              <Link to={""}>Learn</Link>
            </li>
            <li>
              <Link to={""}>Support</Link>
            </li>
            <li>
              <Link to={""}>terms of service</Link>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <p className="text-2xl font-bold leading-7 capitalize">Resources</p>
          <div className="space-y-4">
            <div className="gap-8 flex ">
              <Link
                className="size-10 rounded-full flex items-center justify-center bg-[#F3F3F3]"
                to=""
              >
                <LinkedinIcon />
              </Link>
              <Link
                className="size-10 rounded-full flex items-center justify-center bg-[#F3F3F3]"
                to=""
              >
                <TwitterIcon />
              </Link>
            </div>
            <p className="text-base font-semibold text-gray-100 max-w-2xs">
              © 2025 Catalyze. All rights reserved. Designed to empower your
              financial future.
            </p>
          </div>
        </div>
      </div>
      <div>
        <BannerLogo />
      </div>
    </footer>
  );
}

export default Footer;
