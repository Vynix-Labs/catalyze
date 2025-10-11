"use client";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/ui/button";
import { RoutePath } from "../../routes/routePath";
import Cookies from "js-cookie";

function Slider() {
  const [activeSlide, setActiveSlide] = useState(1);
  const [previousSlide, setPreviousSlide] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const isNewUser = Cookies.get("marker");

  const slideRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const sliders = [
    {
      id: 1,
      title: "Start Small. Grow Steady.",
      description:
        "With Catalyze, you can invest in crypto and digital assets with as little as $1 — no complex steps, no experience needed.",
      tag: "Safe. Smart. Designed for You.",
    },
    {
      id: 2,
      title: "Grow and Learn Together",
      description:
        "We make sure you understand every step. Access bite-sized lessons and tips while investing — because confidence builds success.",
      tag: "Learn as You Go",
    },
    {
      id: 3,
      title: "Built for Everyday Life",
      description:
        "Catalyze works on any smartphone, protects your data, and helps you stay in control — wherever you are, whenever you’re ready.",
      tag: "Investing Made Simple",
    },
  ];

  // Auto-slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setActiveSlide((prev) => (prev === sliders.length ? 1 : prev + 1));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sliders.length, isAnimating]);

  // Initialize first slide
  useEffect(() => {
    console.log(isNewUser);

    if (isNewUser === undefined) {
      Cookies.set("marker", "true");
    } else if (isNewUser === "false") {
      navigate(RoutePath.CREATE_ACCOUNT);
    }

    if (!containerRef.current) return;

    const allSlides = Object.values(slideRefs.current).filter(Boolean);
    const firstSlide = slideRefs.current[1];

    // Hide all slides initially
    gsap.set(allSlides, { x: "100%" });

    // Show first slide
    if (firstSlide) {
      gsap.set(firstSlide, { x: "0%" });
      setPreviousSlide(1);
    }
  }, []);

  const navigate = useNavigate();

  // Slide transition logic
  useEffect(() => {
    if (
      !containerRef.current ||
      !previousSlide ||
      activeSlide === previousSlide
    )
      return;

    setIsAnimating(true);

    const currentSlide = slideRefs.current[activeSlide];
    const prevSlide = slideRefs.current[previousSlide];

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        setPreviousSlide(activeSlide);
      },
    });

    // Ensure correct layering
    tl.set(currentSlide, { x: "100%", zIndex: 2 });
    tl.set(prevSlide, { zIndex: 1 });

    // Animate prev out + current in at same time
    tl.to(prevSlide, {
      x: "-100%",
      duration: 1.2,
      ease: "power2.inOut",
    }).to(
      currentSlide,
      { x: "0%", duration: 1.2, ease: "power2.inOut" },
      "<" // sync animations
    );
  }, [activeSlide, previousSlide]);

  const handleProcessed = () => {
    Cookies.set("marker", "false");
    navigate(RoutePath.CREATE_ACCOUNT);
  };
  if (isNewUser === "true")
    return (
      <div className=" flex justify-center gap-10 w-full  items-center h-full  flex-col  px-5 pb-6">
        <div
          ref={containerRef}
          className="relative overflow-hidden flex h-full  w-full "
        >
          {/* Slides */}
          {sliders.map((slider) => (
            <div
              key={slider.id}
              ref={(el) => {
                if (el) slideRefs.current[slider.id] = el;
                else delete slideRefs.current[slider.id];
              }}
              className="absolute bottom-8 w-full h-full flex flex-col items-center pt-16 justify-between gap-14 text-center"
              style={{ transform: "translateX(100%)" }}
            >
              {/* Image */}
              <div className=" size-70 bg-blue-500 blur-md rounded-full">
                <img src="" alt="" />
              </div>
              <div className="text-left   max-w-[36rem] space-y-4 leading-[100%]">
                {/* tag */}
                <p className="w-fit py-2 px-3 bg-[#0647DF1A] text-primary-100 text-xs font-semibold rounded-full">
                  {slider.tag}
                </p>
                <h1 className="text-5xl max-w-[19.3rem]  font-black text-black leading-[132%]">
                  {slider.title}
                </h1>
                <p className="text-sm font-semibold text-gray-600 leading-[150%]">
                  {slider.description}
                </p>
              </div>
            </div>
          ))}

          {/* Indicators */}
          <div className="absolute z-40 bottom-0 left-0  transform flex space-x-2">
            {sliders.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => !isAnimating && setActiveSlide(index + 1)}
                className={`outline-0 h-3 ${
                  activeSlide === index + 1 ? "w-6" : "w-2.5 bg-primary-100/20"
                }  rounded-full  relative z-30 flex items-center`}
              >
                {activeSlide === index + 1 && (
                  <motion.div
                    layoutId="activeSlideBtn"
                    className="absolute inset-0 rounded-full bg-[#0647DF] w-6 h-2.5"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <Button
          variants="primary"
          text="Get Started"
          handleClick={handleProcessed}
        />
      </div>
    );
}

export default Slider;
