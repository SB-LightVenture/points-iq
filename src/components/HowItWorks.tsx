
export const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Connect Your Accounts",
      description: "Add your frequent flyer programs - Qantas, Velocity, and more.",
      color: "blue"
    },
    {
      step: "02", 
      title: "Set Your Home Airport",
      description: "Choose your preferred departure airport. We'll show options from your city and nearby major hubs.",
      color: "purple"
    },
    {
      step: "03",
      title: "Explore Your Options",
      description: "Watch our interactive globe light up with destinations. See what's possible with your points across all cabin classes.",
      color: "green"
    },
    {
      step: "04",
      title: "Book Your Dream Trip",  
      description: "Found the perfect flight? We'll redirect you to your airline's booking portal to complete your reward flight reservation.",
      color: "orange"
    }
  ];

  const colorMap = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500", 
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500"
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-800/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            How It <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl sm:max-w-3xl mx-auto px-2">
            Four simple steps to unlock your points potential and start planning your next adventure
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              )}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r ${colorMap[step.color]} mb-4 sm:mb-6 text-white font-bold text-lg sm:text-xl`}>
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
