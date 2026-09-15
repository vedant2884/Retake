import type { Metadata } from "next";

// Self-hosted via @fontsource rather than next/font/google so the
// production build never depends on a runtime fetch to Google's
// font CDN. Weight files map to the --font-display / --font-body
// variables set in globals.css.
import "@fontsource/chakra-petch/500.css";
import "@fontsource/chakra-petch/600.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retake",
  description: "Win with every agent. A challenge platform for VALORANT players and creators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
