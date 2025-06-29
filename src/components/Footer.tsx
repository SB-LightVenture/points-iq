
export const Footer = () => {
  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-slate-700">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-1 sm:col-span-2 text-center sm:text-left">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="text-white">Points</span>
                <span className="text-orange-400">IQ</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-md mb-2 text-sm sm:text-base">
              Travel intelligence for your miles
            </p>
            <p className="text-gray-400 max-w-md text-sm sm:text-base">
              Unlock the true value of your frequent flyer points. Discover where you can fly, compare classes, and book reward flights - all in one intelligent platform.
            </p>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Product</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Airlines</a></li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 sm:pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 PointsIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-3 md:mt-0">
            <span className="text-gray-400 text-xs sm:text-sm">Made for frequent flyers, by frequent flyers ✈️</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
