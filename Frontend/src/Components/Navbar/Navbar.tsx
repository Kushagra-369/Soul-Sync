import { useState, useEffect } from "react";
import { Menu, X, Heart, Sparkles, Home, Users, BookOpen, Info, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";

interface NavbarProps {
  onMoodClick: () => void;
}
export default function Navbar({ onMoodClick }: NavbarProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { toggleTheme, isDark } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1440) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  interface NavLink {
    href: string;
    icon: React.ElementType;
    label: string;
    gradient: string;
    darkGradient: string;
  }

  const navLinks: NavLink[] = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      gradient: "from-blue-500 to-cyan-500",
      darkGradient: "dark:from-blue-400 dark:to-cyan-400"
    },
    {
      href: "/wellness",
      icon: Heart,
      label: "Wellness",
      gradient: "from-emerald-500 to-teal-500",
      darkGradient: "dark:from-emerald-400 dark:to-teal-400"
    },
    {
      href: "/community",
      icon: Users,
      label: "Community",
      gradient: "from-cyan-500 to-blue-500",
      darkGradient: "dark:from-cyan-400 dark:to-blue-400"
    },
    {
      href: "/connect",
      icon: Info,
      label: "Connect",
      gradient: "from-teal-500 to-emerald-500",
      darkGradient: "dark:from-teal-400 dark:to-emerald-400"
    },
  ];

  const mobileLinks: NavLink[] = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      gradient: "from-blue-500 to-cyan-500",
      darkGradient: "dark:from-blue-400 dark:to-cyan-400"
    },
    {
      href: "/wellness",
      icon: Heart,
      label: "Wellness",
      gradient: "from-emerald-500 to-teal-500",
      darkGradient: "dark:from-emerald-400 dark:to-teal-400"
    },
    {
      href: "/community",
      icon: Users,
      label: "Community",
      gradient: "from-teal-500 to-emerald-500",
      darkGradient: "dark:from-teal-400 dark:to-emerald-400"
    },
    {
      href: "/connect",
      icon: Info,
      label: "Connect",
      gradient: "from-blue-400 to-cyan-400",
      darkGradient: "dark:from-blue-300 dark:to-cyan-300"
    },
  ];

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${scrolled
      ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100/50 dark:bg-gray-900/90 dark:border-gray-800/50"
      : "bg-linear-to-r from-blue-50/90 via-cyan-50/90 to-emerald-50/90 backdrop-blur-sm dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90"
      }`}>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo with animated gradient */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Heart className="w-8 h-8 text-transparent fill-current bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text dark:from-blue-400 dark:to-emerald-400" />
              <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-blue-400 animate-pulse dark:text-blue-300" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent tracking-tight hover:scale-105 transition-transform duration-300 dark:from-blue-400 dark:via-cyan-400 dark:to-emerald-400">
              SoulSync
            </span>
          </div>

          {/* Extra Large Screens ( >= 1440px ) - ALL elements visible */}
          <div className="hidden xl:flex items-center justify-end flex-1 gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative group px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 transition-all duration-300 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-blue-600 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full dark:from-blue-400 dark:to-emerald-400" />
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Dashboard Button */}
              <Link to="/dashboard">
                <button className="relative group px-5 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/30">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-gray-800 dark:to-gray-700" />

                  <span className="relative flex items-center gap-2 text-gray-600 group-hover:text-blue-600 transition-colors dark:text-gray-300 dark:group-hover:text-blue-400">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </span>
                </button>
              </Link>

              {/* Daily Submit Button */}
              <button
                onClick={onMoodClick}
                className="relative group px-5 py-2.5 rounded-full bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 hover:scale-105 dark:from-blue-500 dark:to-emerald-500 dark:hover:shadow-blue-900/30">
                <span className="relative flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="font-medium">Daily Mood</span>
                </span>
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10 dark:from-cyan-400 dark:to-emerald-400" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-blue-50 transition-colors dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {isDark ?
                  <Sun className="w-5 h-5 text-yellow-400" /> :
                  <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                }
              </button>
            </div>
          </div>

          {/* Large Screens (1024px to 1439px) - Tablet Layout with Actions and Menu */}
          <div className="hidden lg:flex xl:hidden items-center justify-end flex-1 gap-4">
            {/* Dashboard Button */}
            <button className="relative group px-4 py-2 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/30">
              <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-gray-800 dark:to-gray-700" />
              <span className="relative flex items-center gap-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors dark:text-gray-300 dark:group-hover:text-blue-400">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </span>
            </button>

            {/* Daily Submit Button */}
            <button className="relative group px-4 py-2 rounded-full bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 hover:scale-105 dark:from-blue-500 dark:to-emerald-500 dark:hover:shadow-blue-900/30">
              <span className="relative flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="font-medium">Daily</span>
              </span>
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10 dark:from-cyan-400 dark:to-emerald-400" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-blue-50 transition-colors dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ?
                <Sun className="w-5 h-5 text-yellow-400" /> :
                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              }
            </button>

            {/* Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 rounded-xl bg-linear-to-r from-blue-50 to-emerald-50 hover:from-blue-100 hover:to-emerald-100 transition-all duration-300 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600"
              aria-label="Toggle menu"
            >
              <div className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
                {open ?
                  <X size={24} className="text-blue-600 dark:text-blue-400" /> :
                  <Menu size={24} className="text-blue-600 dark:text-blue-400" />
                }
              </div>
            </button>
          </div>

          {/* Medium Screens (768px to 1023px) - Tablet Layout */}
          <div className="hidden md:flex lg:hidden items-center justify-end flex-1 gap-4">
            {/* Dashboard Button */}
            <button className="relative group px-4 py-2 rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/30">
              <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-gray-800 dark:to-gray-700" />
              <span className="relative flex items-center gap-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors dark:text-gray-300 dark:group-hover:text-blue-400">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </span>
            </button>

            {/* Daily Submit Button */}
            <button className="relative group px-4 py-2 rounded-full bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 hover:scale-105 dark:from-blue-500 dark:to-emerald-500 dark:hover:shadow-blue-900/30">
              <span className="relative flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="font-medium">Daily</span>
              </span>
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10 dark:from-cyan-400 dark:to-emerald-400" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-blue-50 transition-colors dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {isDark ?
                <Sun className="w-5 h-5 text-yellow-400" /> :
                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              }
            </button>

            {/* Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 rounded-xl bg-linear-to-r from-blue-50 to-emerald-50 hover:from-blue-100 hover:to-emerald-100 transition-all duration-300 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600"
              aria-label="Toggle menu"
            >
              <div className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
                {open ?
                  <X size={24} className="text-blue-600 dark:text-blue-400" /> :
                  <Menu size={24} className="text-blue-600 dark:text-blue-400" />
                }
              </div>
            </button>
          </div>

          {/* Small Screens ( <= 767px ) - Original mobile layout */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-linear-to-r from-blue-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700"
              aria-label="Toggle theme"
            >
              {isDark ?
                <Sun className="w-5 h-5 text-yellow-400" /> :
                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              }
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 rounded-xl bg-linear-to-r from-blue-50 to-emerald-50 hover:from-blue-100 hover:to-emerald-100 transition-all duration-300 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600"
              aria-label="Toggle menu"
            >
              <div className={`transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>
                {open ?
                  <X size={24} className="text-blue-600 dark:text-blue-400" /> :
                  <Menu size={24} className="text-blue-600 dark:text-blue-400" />
                }
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu for Tablet and Medium Screens (768px to 1439px) */}
      <div className={`hidden md:block xl:hidden transition-all duration-500 ease-in-out overflow-hidden ${open ? "max-h-150 opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}>
        <div className="bg-linear-to-b from-white to-blue-50/30 backdrop-blur-lg border-t border-blue-100/50 shadow-xl dark:from-gray-900 dark:to-gray-800/30 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 grid grid-cols-2 gap-4">
              {/* All 4 navigation links in grid */}
              {navLinks.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/80 hover:bg-white transition-all duration-300 group dark:bg-gray-800/80 dark:hover:bg-gray-800"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                  }}
                  onClick={() => setOpen(false)}
                >
                  <div className={`p-2.5 rounded-lg bg-linear-to-br ${item.gradient} ${item.darkGradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300 dark:text-gray-300 dark:group-hover:from-blue-400 dark:group-hover:to-emerald-400">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Wellness Quote for Tablet */}
            <div className="pb-6 text-center">
              <p className="text-sm text-gray-500 italic border-t border-blue-100 pt-4 dark:text-gray-400 dark:border-gray-800">
                "Nurture your mind, body, and soul" 🌿
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu for Small Screens ( <= 767px ) */}
      <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${open ? "max-h-150 opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}>
        <div className="bg-linear-to-b from-white to-blue-50/30 backdrop-blur-lg border-t border-blue-100/50 shadow-xl dark:from-gray-900 dark:to-gray-800/30 dark:border-gray-800/50">
          <div className="px-4 py-6 space-y-3">
            {mobileLinks.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white transition-all duration-300 group dark:bg-gray-800/80 dark:hover:bg-gray-800"
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                }}
                onClick={() => setOpen(false)}
              >
                <div className={`p-2 rounded-lg bg-linear-to-br ${item.gradient} ${item.darkGradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300 dark:text-gray-300 dark:group-hover:from-blue-400 dark:group-hover:to-emerald-400">
                  {item.label}
                </span>
              </a>
            ))}

            {/* Mobile CTA Buttons */}
            <div className="pt-4 space-y-3">
              <button className="w-full relative overflow-hidden rounded-xl bg-linear-to-r from-gray-50 to-white p-px group dark:from-gray-800 dark:to-gray-700">
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-blue-500 dark:to-emerald-500" />
                <div className="relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white group-hover:bg-transparent transition-all duration-300 dark:bg-gray-800">
                  <BookOpen className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors dark:text-blue-400" />
                  <span className="font-medium text-gray-700 group-hover:text-white transition-colors dark:text-gray-300">
                    Dashboard
                  </span>
                </div>
              </button>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:scale-[1.02] dark:from-blue-500 dark:to-emerald-500 dark:hover:shadow-blue-900/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
                Daily Submit
              </button>
            </div>

            {/* Wellness Quote */}
            <div className="mt-6 p-4 text-center">
              <p className="text-sm text-gray-500 italic border-t border-blue-100 pt-4 dark:text-gray-400 dark:border-gray-800">
                "Nurture your mind, body, and soul" 🌿
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes in global styles */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </nav>
  );
}