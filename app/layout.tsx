import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Stair Club",
  description:
    "Make stair climbing competitive with goals, streaks, and leaderboards.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
