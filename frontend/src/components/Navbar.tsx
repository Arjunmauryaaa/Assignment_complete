import Link from 'next/link';
import { Layout } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Layout className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">ProManage</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20"></div>
      </div>
    </nav>
  );
}
