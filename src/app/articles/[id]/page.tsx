import { articles } from '../../lib/articles';
import { notFound } from 'next/navigation';

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articles.find(a => a.id === parseInt(params.id));

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <span className="px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 rounded-full">
              {article.category}
            </span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{article.readTime}</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
            {article.title}
          </h1>
          
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{article.author}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(article.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">
              {article.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}