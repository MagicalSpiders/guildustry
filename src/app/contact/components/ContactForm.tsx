"use client";

import { useState } from "react";
import { Button } from "@/src/components/Button";

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <section className="relative bg-grid bg-white/60 text-neutral-900 dark:bg-main-bg dark:text-main-text">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-subtle bg-white dark:bg-surface p-8 shadow-elevated">
            <h2 className="text-2xl sm:text-3xl font-title font-bold mb-6 text-neutral-900 dark:text-main-text">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-main-light-text">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-subtle bg-white dark:bg-main-bg text-neutral-900 dark:text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-main-light-text">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-subtle bg-white dark:bg-main-bg text-neutral-900 dark:text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-main-light-text">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-subtle bg-white dark:bg-main-bg text-neutral-900 dark:text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-main-light-text">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-subtle bg-white dark:bg-main-bg text-neutral-900 dark:text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-neutral-700 dark:text-main-light-text">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-subtle bg-white dark:bg-main-bg text-neutral-900 dark:text-main-text focus:outline-none focus:ring-2 focus:ring-main-accent transition-colors resize-y"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit button */}
              <Button type="submit" variant="accent" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
