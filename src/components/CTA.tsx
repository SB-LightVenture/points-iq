
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, save to database
      const { error: dbError } = await supabase
        .from("early_access_signups")
        .insert([{ email }]);

      if (dbError) {
        if (dbError.code === "23505") { // Unique constraint violation
          toast({
            title: "Already Signed Up",
            description: "This email is already on our early access list!",
          });
          setIsSubmitting(false);
          return;
        } else {
          throw dbError;
        }
      }

      // Then send confirmation email
      try {
        const { error: emailError } = await supabase.functions.invoke(
          'send-confirmation-email',
          {
            body: { email }
          }
        );

        if (emailError) {
          console.error("Email sending error:", emailError);
          // Don't fail the whole process if email fails
        }
      } catch (emailError) {
        console.error("Email function error:", emailError);
        // Don't fail the whole process if email fails
      }

      toast({
        title: "Success! 🚀",
        description: "You're on the list! Check your email for confirmation details.",
      });
      setEmail(""); // Clear the form

    } catch (error) {
      console.error("Error signing up:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user) {
    return (
      <section data-section="cta" className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PointsIQ</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              You're logged in and ready to explore! The Interactive Globe Dashboard is coming soon, 
              and you'll be among the first to experience it.
            </p>
            
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pt-8 mt-8 border-t border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">✓ Registered</div>
                <div className="text-gray-400 text-sm">Account Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">Early Access</div>
                <div className="text-gray-400 text-sm">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">AI Powered</div>
                <div className="text-gray-400 text-sm">Intelligence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">Globe View</div>
                <div className="text-gray-400 text-sm">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section data-section="cta" className="py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Take Off</span>?
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of frequent flyers who've discovered the true potential of their points. 
            Get early access to our revolutionary platform.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center mb-8 max-w-md mx-auto">
            <Input 
              type="email"
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 flex-1"
              required
            />
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              {isSubmitting ? "Signing Up..." : "Get Early Access"}
            </Button>
          </form>
          
          <p className="text-sm text-gray-400 mb-8">
            🔒 We respect your privacy. No spam, just early access updates.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto pt-8 border-t border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">5K+</div>
              <div className="text-gray-400 text-sm">Early Access</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">5★</div>
              <div className="text-gray-400 text-sm">Beta Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">AI Powered</div>
              <div className="text-gray-400 text-sm">Intelligence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">Community</div>
              <div className="text-gray-400 text-sm">Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
