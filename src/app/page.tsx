import Link from 'next/link';
import { articles } from './lib/articles';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200 bg-clip-text">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.slice(0, 2).map((article) => (
            <Link 
              href={article.link}
              key={article.id}
              target="_blank"
              className="p-4 border border-blue-200 dark:border-blue-700 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
            >
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Posted on {new Date(article.processedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h3 className="font-semibold mb-2 text-indigo-700 dark:text-indigo-300">{article.title}</h3>
              <p className="text-blue-600 dark:text-blue-300 line-clamp-2">{article.description}</p>
              <div className="mt-2 flex items-center justify-end">
                <span className="text-sm text-indigo-600 dark:text-indigo-400">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link 
            href="/articles"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </section>
    </div>
  );
}