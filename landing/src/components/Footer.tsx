"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

import { NAV_LINKS } from "@/lib/constants"; // same array used in navbar
import { INFORMATION as info, SOCIAL as social } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* TOP SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-12"
        >
          {/* -------- LOGO + ABOUT -------- */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Khatri College</h2>
            <p className="text-muted-foreground">
              Empowering students with quality education and excellence for a brighter future.
            </p>
          </div>

          {/* -------- QUICK LINKS -------- */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ x: 5 }}
                  className="transition text-muted-foreground hover:text-primary cursor-pointer"
                >
                  <Link href={link.href}>{link.label}</Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* -------- CONTACT INFO -------- */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>

            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>{info.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>{info.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{info.address}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* DIVIDER */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full border-t my-10"
        />

        {/* BOTTOM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Social Links */}
          <div className="flex items-center gap-6">
            <motion.a whileHover={{ scale: 1.1 }} href={social.facebook}>
              <Facebook className="w-6 h-6 hover:text-primary transition" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} href={social.instagram}>
              <Instagram className="w-6 h-6 hover:text-primary transition" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.1 }} href={social.youtube}>
              <Youtube className="w-6 h-6 hover:text-primary transition" />
            </motion.a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © 1991 Khatri College. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
