import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/src/components/main/Footer";
import { Toaster } from "sonner";
import Providers from "@/src/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://snippetvault.emanuelvini.dev'),
  title: 'SnippetVault | Full-Stack Snippet Manager',
  description: 'Full-stack developer tool for organizing technical knowledge with GitHub authentication, dashboard, public search and a Dracula theme.',
  keywords: ['code snippets', 'full-stack', 'next.js', 'prisma', 'nextauth', 'developer tools', 'github auth'],
  authors: [{ name: 'emanuelVINI', url: 'https://github.com/emanuelVINI01' }],
  openGraph: {
    title: 'SnippetVault - Full-Stack Developer Tool',
    description: 'Developer application with authentication, CRUD, public search, dashboard and dark-first developer experience.',
    url: 'https://snippetvault.emanuelvini.dev',
    siteName: 'SnippetVault',
    images: [
      {
        url: '/snippet_dash.png', // Uma imagem do dashboard com o tema Dracula
        width: 1200,
        height: 630,
        alt: 'SnippetVault interface with Dracula theme',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnippetVault | Full-Stack Developer Tool',
    description: 'Project demonstrating architecture, authentication, data modeling and UX in a real application.',
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
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <Providers>
          {children}
          <Toaster closeButton position="top-right" theme="dark" richColors />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
