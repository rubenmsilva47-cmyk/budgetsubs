import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Shield, Clock, CreditCard, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "How does this actually work?",
    answer:
      "We work with regional partners and leverage legitimate pricing differences across markets. When you purchase through us, you're getting the same premium subscription you'd buy directly—just at a better price. Your account works exactly the same way, with full access to all features and support from the original service provider.",
    icon: HelpCircle,
  },
  {
    question: "Is this safe and legal?",
    answer:
      "Absolutely. We only use methods that are fully compliant with service provider terms. All subscriptions are legitimate and come directly from authorized sources. Your payment information is processed securely, and we never store sensitive account credentials. If you have concerns, we're happy to explain our process in detail.",
    icon: Shield,
  },
  {
    question: "How quickly will I get access?",
    answer:
      "Most orders are processed and activated within 5-30 minutes. During busy periods (weekends, holidays), it might take up to 24 hours, but we'll keep you updated throughout. If you're in a rush, shoot us a message and we'll prioritize your order.",
    icon: Clock,
  },
  {
    question: "What payment options do you have?",
    answer:
      "We accept major credit and debit cards, PayPal, and various cryptocurrencies. For international customers, we support regional payment methods too. All transactions are secure and encrypted. If you don't see your preferred method, let us know—we're always adding new options.",
    icon: CreditCard,
  },
  {
    question: "What if something goes wrong?",
    answer:
      "We've got your back. Our support team is available 24/7 through live chat and email. Most issues get resolved within a few hours. If we can't fix it, we'll refund you—no questions asked. We also maintain detailed guides and troubleshooting resources for common questions.",
    icon: MessageCircle,
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-6 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
            <HelpCircle className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">FAQ</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-foreground">Got questions?</span>
            <br />
            <span className="text-gradient">We've got answers.</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know, explained clearly and honestly.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm p-2 sm:p-4">
            <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl border border-border/50 bg-card/50 hover:bg-card/70 hover:border-primary/20 transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="px-6 sm:px-8 py-5 sm:py-6 hover:no-underline group">
                    <div className="flex items-start gap-4 sm:gap-5 w-full text-left">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <faq.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors pr-4">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 sm:px-8 pb-5 sm:pb-6 pt-0">
                    <div className="pl-14 sm:pl-16">
                      <div className="h-px bg-border/50 mb-4" />
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Still have questions?{" "}
              <a href="#contact" className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors">
                Get in touch
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
