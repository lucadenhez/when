import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css"

const sanFranciscoPro = localFont({
  src: [
    {
      path: "./fonts/sf-pro-display-black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-display-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-display-heavy.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-display-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-display-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-display-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-display-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-display-thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/sf-pro-display-ultralight.woff2",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});

export const metadata: Metadata = {
  title: "When",
  openGraph: {
    title: "When",
    type: "website",
    url: "https://wherewhen.us",
    siteName: "When",
    description: "Planning is hard with lots of people. Let's make it easier!",
    locale: "en_US",
    images: [
      {
        url: "https://lucadenhez.com/images/icons/when_icon.png",
        width: 1200,
        height: 1200,
      },
    ],
  },
  robots: {
    index: true,
    follow: false,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="images/icons/when_icon.png" />
      </head>
      <body
        className={`${sanFranciscoPro.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
