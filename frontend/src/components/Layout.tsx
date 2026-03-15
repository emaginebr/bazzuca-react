import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="noise min-h-screen transition-colors">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
