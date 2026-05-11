import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/src/components/main/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://snippetvault.emanuelvini.dev'),
  title: 'SnippetVault | Case Full-Stack de Portfólio',
  description: 'Case de portfólio full-stack para organização de conhecimento técnico, com autenticação GitHub, dashboard, busca pública e tema Dracula.',
  keywords: ['code snippets', 'portfolio full-stack', 'next.js', 'prisma', 'nextauth', 'developer tools', 'github auth'],
  authors: [{ name: 'emanuelVINI', url: 'https://github.com/emanuelVINI01' }],
  openGraph: {
    title: 'SnippetVault - Case Full-Stack',
    description: 'Aplicação de portfólio com autenticação, CRUD, busca pública, dashboard e experiência dark-first para desenvolvedores.',
    url: 'https://snippetvault.emanuelvini.dev',
    siteName: 'SnippetVault',
    images: [
      {
        url: '/snippet_dash.png', // Uma imagem do dashboard com o tema Dracula
        width: 1200,
        height: 630,
        alt: 'Interface do SnippetVault com tema Dracula',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnippetVault | Case Full-Stack',
    description: 'Projeto para demonstrar arquitetura, autenticação, dados e UX em uma aplicação real.',
    images: ['/snippet_dash.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="PT-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster closeButton position="top-right" theme="dark" richColors />
        <Footer />
      </body>
    </html>
  );
}
