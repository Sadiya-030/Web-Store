import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar variant="store" />
      <main>{children}</main>
      <Footer />
    </>
  );
}
