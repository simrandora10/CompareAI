"use client";

import AnimatedBlurTestimonials from "./ui/animated-blur-testimonials";
import Hero from "./ui/Hero";
import Navbar from "./ui/Navbar";
import About from "./ui/About";
import Contact from "./ui/Contact";
import Footer from "./ui/Footer";

const testimonialsData = [
  {
    avatar: { src: "https://randomuser.me/api/portraits/women/44.jpg", fallback: "A" },
    message: "This platform has completely transformed the way I work. The interface is clean and intuitive!",
  },
  {
    avatar: { src: "https://randomuser.me/api/portraits/men/32.jpg", fallback: "B" },
    message: "I love the simplicity and the attention to detail. Everything just works seamlessly.",
  },
  {
    avatar: { src: "https://randomuser.me/api/portraits/women/68.jpg", fallback: "C" },
    message: "Fantastic experience so far! The animations make the app feel alive and modern.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black scroll-smooth">
      <Navbar />

      <section id="hero">
        <Hero />
      </section>

      <section id="features">
        <About />
      </section>

      <section id="testimonials" className="flex items-center justify-center px-4 pt-24">
        <div className="max-w-lg w-full mb-10">
          <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
            What People Are Saying
          </h1>
          <AnimatedBlurTestimonials data={testimonialsData} />
        </div>
      </section>

      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </main>
  );
}
