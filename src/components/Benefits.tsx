
export const Benefits = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Stop Guessing. <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Start Flying.</span>
          </h2>
        </div>

        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm border border-slate-700">
            <div className="bg-slate-900/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-gray-400 text-xs sm:text-sm">Your Points Balance</span>
                <span className="text-green-400 font-semibold text-xs sm:text-sm">Qantas FF</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">247,500 Points</div>
              <div className="text-xs sm:text-sm text-gray-400">Last updated: Today</div>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-sm sm:text-base">MEL → LAX Business</span>
                  <span className="text-blue-400 text-xs sm:text-sm">Available</span>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border-l-4 border-purple-500">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-sm sm:text-base">MEL → NRT First</span>
                  <span className="text-purple-400 text-xs sm:text-sm">2 seats left</span>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 sm:p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-sm sm:text-base">MEL → SIN Economy</span>
                  <span className="text-green-400 text-xs sm:text-sm">Multiple dates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 mt-1"></div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Maximize Your Points Value</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">See exactly where your 200K Qantas points can take you - from Melbourne to LA in Business Class or multiple Economy trips to Asia.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 mt-1"></div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Real Availability, Real Time</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">No more endless searching. See actual available reward seats across different dates and cabin classes instantly.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex-shrink-0 mt-1"></div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Multi-Program Support</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">Supports major Australian programs: Qantas Frequent Flyer, Velocity, Virgin Australia, and more coming soon.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
