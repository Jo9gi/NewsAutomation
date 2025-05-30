export default function Gallery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 animate-gradient">
          Visual Showcase
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((image) => (
            <div key={image} className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-600/80 opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-2">Artwork {image}</h3>
                <p className="text-sm text-white/90 text-center px-4 mb-4">A stunning piece capturing the essence of modern design</p>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium backdrop-blur-sm transition-colors">
                  View Details
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 via-black/20 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    <span className="text-sm font-medium text-white">Artist Name</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}