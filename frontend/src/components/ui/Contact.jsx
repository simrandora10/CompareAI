"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent:", form);
    // Here you can integrate email service or API
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          Get in Touch
        </h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Have a question or want to collaborate? Send us a message and we’ll get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-6 text-left"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="group/btn relative block h-10 w-full rounded-md 
             bg-gradient-to-br from-gray-900 to-gray-700 
             font-medium text-white 
             shadow-[0px_1px_0px_0px_#ffffff40_inset,
                     0px_-1px_0px_0px_#ffffff40_inset] 
             dark:from-gray-100 dark:to-gray-300 
             dark:text-black 
             dark:shadow-[0px_1px_0px_0px_#27272a_inset,
                         0px_-1px_0px_0px_#27272a_inset]">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
