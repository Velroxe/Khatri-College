"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BACKEND}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSuccess("Your message has been sent!");
      setForm({ name: "", phone: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-center mb-12"
      >
        Contact Us
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* -------- LEFT SIDE: STATIC INFO -------- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 shadow-lg rounded-2xl border">
            <CardContent className="space-y-6">

              <div>
                <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
                <p className="text-muted-foreground">
                  Reach out to us anytime. We will get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <p className="text-lg font-medium">+91 98116 54422</p>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <p className="text-lg font-medium">team@khatricollege.com</p>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <p className="text-lg font-medium">
                    E-37, Tagore Garden Extn., New Delhi - 110027
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </motion.div>

        {/* -------- RIGHT SIDE: CONTACT FORM -------- */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 p-6 shadow-lg rounded-2xl border border-border bg-background"
        >
          <h3 className="text-2xl font-semibold mb-2">Send Us a Message</h3>

          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-green-500 dark:text-green-400 text-sm">{success}</p>}

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your message..."
              rows={5}
              className="resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
