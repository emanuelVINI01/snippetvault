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
  title: 'SnippetVault | Seu Cofre de Código Pessoal',
  description: 'Organize, armazene e recupere seus trechos de código favoritos instantaneamente. Otimizado para desenvolvedores poliglotas com tema Dracula.',
  keywords: ['code snippets', 'gerenciador de código', 'programação', 'dracula theme', 'developer tools', 'github auth'],
  authors: [{ name: 'Emanuel', url: 'https://github.com/emanuelVINI01' }],
  openGraph: {
    title: 'SnippetVault - Proteja seu conhecimento',
    description: 'Nunca mais perca aquele comando de Git ou configuração de banco de dados. Salve tudo no seu cofre pessoal.',
    url: 'https://snippetvault-delta.vercel.app', // Sua URL real aqui
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
    title: 'SnippetVault | O cofre do desenvolvedor',
    description: 'Gerencie seus snippets com tags e busca instantânea.',
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
