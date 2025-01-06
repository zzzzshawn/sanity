import { ThemeProvider } from "next-themes";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

const Provider = ({ children }) => {
  return (
    <ThemeProvider attribute="class">
      <NextTopLoader />
      <Navbar />
      {children}
      <Footer />
      <Toaster richColors />
      <Analytics />
    </ThemeProvider>
  );
};

export default Provider;
