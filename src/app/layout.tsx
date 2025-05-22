import './globals.css';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'Intercom Clone',
  description: 'Replicating Intercom Admin Panel UI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
