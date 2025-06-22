
export const Benefits = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Stop Guessing. <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Start Flying.</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Maximize Your Points Value</h3>
                  <p className="text-gray-300">See exactly where your 200K Qantas points can take you - from Melbourne to LA in Business Class or multiple Economy trips to Asia.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real Availability, Real Time</h3>
                  <p className="text-gray-300">No more endless searching. See actual available reward seats across different dates and cabin classes instantly.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex-shrink-0 mt-1"></div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Multi-Program Support</h3>
                  <p className="text-gray-300">Supports major Australian programs: Qantas Frequent Flyer, Velocity, Virgin Australia, and more coming soon.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-sm border border-slate-700">
              <div className="bg-slate-900/80 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Your Points Balance</span>
                  <span className="text-green-400 font-semibold">Qantas FF</span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">247,500 Points</div>
                <div className="text-sm text-gray-400">Last updated: Today</div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">MEL → LAX Business</span>
                    <span className="text-blue-400">Available</span>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">MEL → NRT First</span>
                    <span className="text-purple-400">2 seats left</span>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">MEL → SIN Economy</span>
                    <span className="text-green-400">Multiple dates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
