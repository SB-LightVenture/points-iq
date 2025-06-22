
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CTA = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Take Off</span>?
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of frequent flyers who've discovered the true potential of their points. 
            Get early access to our revolutionary platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 flex-1"
            />
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
              Get Early Access
            </Button>
          </div>
          
          <p className="text-sm text-gray-400 mb-8">
            🔒 We respect your privacy. No spam, just early access updates.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pt-8 border-t border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">10K+</div>
              <div className="text-gray-400 text-sm">Waitlist Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">5★</div>
              <div className="text-gray-400 text-sm">Beta Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
