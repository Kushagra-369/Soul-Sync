import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-semibold text-blue-600 tracking-wide">
          SoulSync 💙
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <a href="/" className="hover:text-blue-600 transition">Home</a>
          <a href="/check-in" className="hover:text-blue-600 transition">Check-In</a>
          <a href="/journal" className="hover:text-blue-600 transition">Journal</a>
          <a href="/community" className="hover:text-blue-600 transition">Community</a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
            Dashboard
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4 text-gray-600">
          <a href="#" className="block hover:text-blue-600">Home</a>
          <a href="#" className="block hover:text-blue-600">Check-In</a>
          <a href="#" className="block hover:text-blue-600">Journal</a>
          <a href="#" className="block hover:text-blue-600">Community</a>
          <button className="w-full bg-blue-600 text-white py-2 rounded-full mt-2">
            Dashboard
          </button>
        </div>
      )}
    </nav>
  );
}