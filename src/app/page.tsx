import Link from 'next/link';
import CacheStatus from './components/CacheStatus';
import DynamicNews from './components/DynamicNews';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Cache Status Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">
          Data Management
        </h2>
        <CacheStatus />
      </section>

      {/* Dynamic News Section */}
      <DynamicNews />

      {/* Additional Links Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-purple-200">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/articles"
            className="p-4 border border-purple-200 dark:border-purple-700 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 text-center"
          >
            <h3 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">View All Articles</h3>
            <p className="text-purple-600 dark:text-purple-400 text-sm">Browse complete article collection</p>
          </Link>
          <Link 
            href="/news"
            className="p-4 border border-purple-200 dark:border-purple-700 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 text-center"
          >
            <h3 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">News Dashboard</h3>
            <p className="text-purple-600 dark:text-purple-400 text-sm">Advanced news analytics and insights</p>
          </Link>
        </div>
      </section>
    </div>
  );
}