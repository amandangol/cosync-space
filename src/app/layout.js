import { Nunito } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import "@liveblocks/react-ui/styles.css";

import './globals.css';

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Flowspace - A powerful platform for team collaboration and project management." />
          <title>Flowspace</title>
        </head>
        <body className={`${nunito.className} bg-gray-50 text-gray-900`}>
          <div className="min-h-screen flex flex-col">
            <Toaster 
              position="top-right" 
              toastOptions={{
                style: {
                  background: '#f3f4f6',
                  color: '#111827',
                },
                success: {
                  style: {
                    background: '#4ADE80',
                    color: '#fff',
                  },
                },
                error: {
                  style: {
                    background: '#F87171',
                    color: '#fff',
                  },
                },
              }}
            />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
