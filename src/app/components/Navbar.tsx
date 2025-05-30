'use client';

import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="text-2xl font-bold text-slate-800 dark:text-slate-100"
          >
            Tech Articles
          </Link>
          <div className="flex space-x-6">
            <Link 
              href="/articles" 
              className="font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors"
            >
              Articles
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar