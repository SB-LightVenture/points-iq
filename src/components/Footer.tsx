
import { Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">
                Points<span className="text-orange-500">IQ</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-md mb-4">
              Travel intelligence for your miles. Stop guessing, start flying with our intelligent platform that shows you exactly where your frequent flyer points can take you.
            </p>
            <p className="text-sm text-muted-foreground">
              Made for frequent flyers, by frequent flyers ✈️
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Airlines</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 PointsIQ. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Join 10,000+ travelers maximizing their points</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
