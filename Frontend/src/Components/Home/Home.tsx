import {
  Heart,
  Sparkles,
  Users,
  Brain,
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "Mental Wellness",
      desc: "Harness the power of AI to track your daily emotional landscape with deep clarity.",
      color: "from-blue-500 to-indigo-600",
      delay: "delay-100",
    },
    {
      icon: Users,
      title: "Global Sanctuary",
      desc: "Find belonging in a safe, anonymous space where every voice is heard and valued.",
      color: "from-purple-500 to-fuchsia-600",
      delay: "delay-200",
    },
    {
      icon: ShieldCheck,
      title: "Private & Secure",
      desc: "Your journey is yours alone. We prioritize your privacy with medical-grade security.",
      color: "from-emerald-500 to-teal-600",
      delay: "delay-300",
    },
  ];

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-[120px] -z-10 animate-pulse [animation-delay:2s]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        {/* ================= HERO SECTION ================= */}
        <section className="text-center space-y-10 mb-32 relative">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="bg-blue-500 p-1 rounded-full animate-spin-slow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide uppercase text-blue-700 dark:text-blue-300">
              Evolution of Mental Wellness
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
            <span className="inline-block transition-transform hover:scale-[1.02] duration-500">
              Sync Your
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-br from-blue-600 via-indigo-600 to-emerald-500 dark:from-sky-400 dark:via-blue-400 dark:to-emerald-400">
              Inner Peace
            </span>
          </h1>

          {/* Subtext */}
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            SoulSync bridges the gap between your emotional reality and wellness goals with state-of-the-art AI companionship.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            
            <Link
              to="/ai-counselor"
              className="px-10 py-5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-700 text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-500 flex items-center gap-3 group relative overflow-hidden"
            >
              <Zap className="w-6 h-6 animate-pulse" />
              Begin Discovery
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>

            <button className="px-10 py-5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md font-black text-xl shadow-xl">
              <span className="flex items-center gap-2">
                The Science
                <Star className="w-5 h-5 transition-transform duration-700" />
              </span>
            </button>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-10 rounded-[2.5rem] bg-white/30 dark:bg-gray-800/20 backdrop-blur-2xl border border-white/40 dark:border-gray-700/30 shadow-2xl transition-all duration-700 hover:-translate-y-4 ${feature.delay}`}
            >
              <div
                className={`w-20 h-20 rounded-3xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white shadow-2xl mb-10`}
              >
                <feature.icon className="w-10 h-10 stroke-[1.5]" />
              </div>

              <h3 className="text-3xl font-black mb-6 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
                {feature.desc}
              </p>

              <div className="mt-8 flex items-center text-blue-600 dark:text-blue-400 font-extrabold text-sm uppercase tracking-widest cursor-pointer">
                Learn Detail
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          ))}
        </section>

        {/* ================= CTA BANNER ================= */}
        <section className="mt-40 p-16 lg:p-24 rounded-[4rem] bg-linear-to-br from-indigo-600 via-blue-600 to-emerald-500 text-white relative shadow-[0_30px_100px_-20px_rgba(0,0,100,0.3)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 text-center lg:text-left">
            
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-7xl font-black leading-[1.1]">
                Transform your <br /> Mindset today.
              </h2>

              <p className="text-white/80 text-xl lg:text-2xl max-w-2xl">
                Join our premium ecosystem of wellness. Exclusive tools, professional insights, and a community that truly cares.
              </p>
            </div>

            <button className="px-14 py-7 rounded-4xl bg-white text-blue-700 font-black text-2xl hover:bg-sky-50 transition-all duration-500">
              Enter Sanctuary
            </button>
          </div>
        </section>

        {/* ================= FOOTER META ================= */}
        <section className="mt-32 text-center space-y-8">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-emerald-500 fill-emerald-500" />
            <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              Crafted for Your Inner Harmony
            </span>
            <Heart className="w-6 h-6 text-emerald-500 fill-emerald-500" />
          </div>
        </section>

      </div>
    </div>
  );
}