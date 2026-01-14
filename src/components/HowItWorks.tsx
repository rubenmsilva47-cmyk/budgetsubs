import { ShoppingCart, UserCheck, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: ShoppingCart,
    title: "Pick what you need",
    description: "Scroll through our handpicked selection of premium subscriptions. Everything from streaming services to productivity tools—all at prices that actually make sense.",
    badge: "Browse",
  },
  {
    icon: UserCheck,
    title: "Tell us your preference",
    description: "Already have an account? We'll add the subscription to it. Starting fresh? We'll set you up with a brand new account. Your call, zero hassle.",
    badge: "Customize",
  },
  {
    icon: Zap,
    title: "You're all set",
    description: "Within minutes, your subscription goes live. No waiting around, no complicated setup. Just open the app and start using it—it's that simple.",
    badge: "Instant",
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-secondary/10" />
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-6 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">How it works</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-foreground">Three steps.</span>
            <br />
            <span className="text-gradient">Zero complexity.</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We've stripped away all the unnecessary fluff. Here's exactly what happens when you choose us.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 z-0 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 text-primary/30 group-hover:text-primary/50 transition-colors" />
                  </div>
                )}
                
                <Card className="relative h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 group-hover:-translate-y-1">
                  <CardContent className="p-8 sm:p-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                        <div className="relative w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-lg font-bold text-primary group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                          {index + 1}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs font-medium border-primary/20 text-primary/80">
                        {step.badge}
                      </Badge>
                    </div>

                    <div className="mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
