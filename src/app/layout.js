import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'LinkedIn Lite',
  description: 'Mini LinkedIn-like app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer autoClose={3000} />
      </body>
    </html>
  );
}
