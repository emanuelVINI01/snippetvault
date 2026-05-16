import type { Metadata } from "next";
import { Fira_Code, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/src/components/main/Footer";
import { Toaster } from "sonner";
import Providers from "@/src/components/Providers";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
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
      lang="pt-BR"
      className={`${jetbrains.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className={`${jetbrains.className} min-h-full`}>
        <Providers>
          {children}
          <Toaster closeButton position="top-right" theme="dark" richColors />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
