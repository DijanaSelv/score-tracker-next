"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import NewBoardGame from "./NewBoardGame";
import NewPlayer from "./NewPlayer";
import NewSession from "./NewSession";
import Link from "next/link";

interface SubLink {
  text: string;
  description: string;
  href: string;
  isSubDropdown?: boolean;
}

interface Link {
  text: string;
  href: string;
  isDropdown: boolean;
  subLinks?: SubLink[];
}

const NavBar = () => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeout = useRef<NodeJS.Timeout | null>(null);

  const links: Link[] = [
    { text: "Board Games", href: "/", isDropdown: false },
    { text: "Players", href: "/players", isDropdown: false },
    { text: "Sessions Log", href: "/sessions-log", isDropdown: false },
    /* { text: "Archives", href: "/archives", isDropdown: false }, */
  ];

  const isCurrentPath = useCallback(
    (href: string): boolean => {
      return pathname === href || (href !== "/" && pathname.includes(href));
    },
    [pathname]
  );

  console.log(pathname);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollY.current ? "down" : "up";
    const sticky = currentScrollY > 100;

    setIsSticky(sticky);

    if (!sticky) {
      setIsVisible(true);
    } else if (direction === "down" && sticky) {
      setIsVisible(false);
    } else if (direction === "up" && sticky) {
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }, []);

  const handleDropdownHover = useCallback((linkText: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (leaveTimeout.current) clearTimeout(leaveTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      setHoveredDropdown(linkText);
    }, 20);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    leaveTimeout.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 200);
  }, []);

  // Handle body scroll lock when mobile menu is active
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (isActive) {
      const scrollY = window.scrollY;
      body.dataset.scrollY = String(scrollY);
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      html.classList.add("overscroll-none");
    } else {
      const scrollY = parseInt(body.dataset.scrollY || "0", 10);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overflow = "";
      html.classList.remove("overscroll-none");
      window.scrollTo(0, scrollY);
    }
  }, [isActive]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-0 z-1000 w-full group/menu transition-all bg-background border-b border-foregorund max-lg:shadow-md max-lg:shadow-highlight/40 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } `}
    >
      <div className={`container mx-auto px-4 lg:px-6 relative`}>
        <div className="flex w-full items-center justify-between py-2 sm:py-3 lg:py-0 ">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center w-fit divide-x border-x divide-foreground border-foreground">
            {links.map((link) => (
              <div key={link.text}>
                {!link.isDropdown ? (
                  <Link
                    href={link.href}
                    className={`flex items-center cursor-pointer transition-class group text-base p-4 hover:opacity-100 button-neon-hover hover:bg-white hover:text-black font-electrolize tracking-wide font-semibold  ${
                      isCurrentPath(link.href)
                        ? "bg-white text-black relative z-10 "
                        : ""
                    } `}
                  >
                    <span>{link.text}</span>
                  </Link>
                ) : (
                  <div
                    className="group/NavLinkOne mainNavElement"
                    onMouseEnter={() => handleDropdownHover(link.text)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button className="transition-all flex w-full cursor-pointer items-center">
                      <Link
                        href={link.href}
                        className={`flex items-center max-xl:text-sm text-base gap-2 transition-all group opacity-85 hover:opacity-100  ${
                          isCurrentPath(link.href)
                            ? "font-medium opacity-100"
                            : "font-normal"
                        } `}
                      >
                        {link.text}
                      </Link>
                      <span className="inline-block">
                        <i
                          className={`fa-regular fa-chevron-down transition-all pl-1.5 text-xs text-heading ${
                            isCurrentPath(link.href)
                              ? "opacity-100"
                              : "opacity-85"
                          } group-hover/NavLinkOne:opacity-100`}
                        />
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`transition-all border-heading/20 absolute top-full right-1/10 -mt-2 w-[710px] rounded-sm border bg-white p-4 text-base font-normal shadow-sm ${
                        hoveredDropdown === link.text
                          ? "pointer-events-auto visible translate-y-0 opacity-100"
                          : "pointer-events-none invisible -translate-y-5 opacity-0"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-x-4">
                        {link.subLinks?.map((subLink, index) => (
                          <div key={subLink.text}>
                            <a
                              href={subLink.href}
                              className={`transition-all text-heading  group block rounded-sm px-4 py-4 text-sm capitalize ${
                                index < (link.subLinks?.length || 0) - 2
                                  ? "border-b border-heading/10"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="max-w-0 overflow-hidden transition-all duration-600 ease-in group-hover:max-w-full">
                                  <span className="mr-2">✨</span>
                                </span>
                                <span className="font-heading  pb-1 text-base font-medium">
                                  {subLink.text}
                                </span>
                              </div>
                              <p className="text-body tracking-one max-w-64 text-sm">
                                {subLink.description}
                              </p>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Logo */}
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-foreground hover:text-white transition-class logo-shadow lg:text-3xl text-xl"
            >
              <i className="fa-solid fa-trophy  "></i>{" "}
              <span className=" tracking-widest block max-xl:hidden font-zen-dots  ">
                DASH
              </span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center justify-center divide-x border-x divide-foreground border-foreground">
            <NewBoardGame />
            <NewPlayer />
            <NewSession />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsActive(true)}
            className={`transition-all flex aspect-square h-full cursor-pointer items-center justify-center rounded-xs p-2 pr-0 text-lg lg:hidden ${
              isSticky ? "text-heading" : "text-white"
            }`}
          >
            <i className="fa-solid fa-bars text-base" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`transition-all bg-background/40 fixed top-0 left-0 z-10000 h-dvh w-full backdrop-blur-sm lg:hidden ${
          isActive ? "opacity-100 visible" : "invisible opacity-0"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsActive(false);
            setOpenDropdown(null);
          }
        }}
      >
        <div
          className={`border-foreground relative flex h-full min-h-dvh w-full max-w-xs shadow-highlight shadow-xl flex-col justify-between gap-10 overflow-x-hidden overflow-y-auto border-r p-4 transition-all duration-700 ease-in-out bg-background ${
            isActive ? "translate-x-0 delay-100" : "-translate-x-full"
          }`}
        >
          <div className="relative z-10">
            <div className="mb-10 flex items-center justify-between">
              <Link
                href="/"
                className="flex shrink-0 items-center gap-2 text-foreground hover:text-white transition-class logo-shadow lg:text-3xl text-xl"
              >
                <i className="fa-solid fa-trophy"></i>{" "}
                <span className=" tracking-widest block max-xl:hidden font-zen-dots  ">
                  DASH
                </span>
              </Link>
              <button
                onClick={() => {
                  setIsActive(false);
                  setOpenDropdown(null);
                }}
                className="transition-all cursor-pointer text-base text-white"
              >
                <i className="fa-regular fa-x" />
              </button>
            </div>

            <div className="flex flex-col capitalize divide-y divide-foreground/50">
              {links.map((link) => (
                <div key={link.text}>
                  {!link.isDropdown ? (
                    <Link
                      href={link.href}
                      className=" relative block  font-normal text-white py-3"
                    >
                      <span className="relative z-10">{link.text}</span>
                    </Link>
                  ) : (
                    <div className="group/NavLinkOne mainNavElement relative">
                      <button
                        onClick={() => {
                          setOpenDropdown(
                            openDropdown === link.text ? null : link.text
                          );
                        }}
                        className="relative flex w-full flex-col items-start gap-1 "
                      >
                        <div className="flex w-full items-center justify-between">
                          <Link
                            href={link.href}
                            className=" relative inline-block font-normal text-white"
                          >
                            {link.text}
                          </Link>
                          <span
                            className={`transition-all inline-block text-white ${
                              openDropdown === link.text
                                ? "rotate-180"
                                : "rotate-0"
                            }`}
                          >
                            <i className="fa-regular fa-chevron-down text-sm" />
                          </span>
                        </div>

                        <div
                          className={`transition-all relative w-full overflow-hidden ${
                            openDropdown === link.text
                              ? "max-h-[500px]"
                              : "max-h-0"
                          }`}
                        >
                          <div className="mt-3 flex w-full flex-col items-start divide-y divide-white/10 border-t border-white/10">
                            {link.subLinks?.map((subLink) => (
                              <a
                                key={subLink.text}
                                href={subLink.href}
                                className="transition-all  block w-full py-3 text-start text-sm font-light text-white/85"
                              >
                                {subLink.text}
                              </a>
                            ))}
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-foreground/40 pt-4  divide-foreground/40 divide-y *:pb-3 ">
            <NewBoardGame />
            <NewPlayer />
            <NewSession />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
