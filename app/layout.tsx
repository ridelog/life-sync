import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life-Sync | ペットの毎日を記録",
  description: "一緒に過ごす毎日を記録し、その子らしさを未来につなぐ。",
  manifest: "/manifest.webmanifest",
  other: {
    "codex-preview": "development",
  },
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
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
