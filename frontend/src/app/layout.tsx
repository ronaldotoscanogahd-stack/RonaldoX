import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireFlow AI",
  description: "Plataforma de recrutamento automatizado com IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
