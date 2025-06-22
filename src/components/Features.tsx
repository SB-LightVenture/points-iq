
import { MapPin, Plane, CircleArrowUp } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Interactive Globe Dashboard",
      description: "Visualize your points potential on a beautiful 3D globe interface. See where your points can take you at a glance.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Plane,
      title: "Multi-Class Comparison",
      description: "Compare Economy, Premium Economy, Business, and First Class options. Know exactly what your points can buy.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: CircleArrowUp,
      title: "Real-Time Availability",
      description: "Check live reward seat availability across multiple airlines. Never miss out on your dream destination.",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Points, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Visualized</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your frequent flyer points from mysterious numbers into clear travel opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl from-blue-600/20 to-purple-600/20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
