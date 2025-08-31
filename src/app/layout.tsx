import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Firewall Dashboard" };

export default function RootLayout({ children }:{children:React.ReactNode}) {
  return (
    <html lang="en"><body style={{minHeight:"100dvh", display:"flex", flexDirection:"column"}}>
      {children}
    </body></html>
  );
}

