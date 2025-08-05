import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";

interface EnhancedHeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryAction: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  badge?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  features?: Array<{
    icon: React.ElementType;
    text: string;
  }>;
}

export function EnhancedHero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  badge,
  stats,
  features
}: EnhancedHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-background/50">
      {/* Animated background elements */}
      <div className="absolute inset-0 neural-grid opacity-30" />
      <motion.div 
        className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {badge && (
            <motion.div variants={itemVariants} className="mb-6">
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm backdrop-blur-glass border-primary/20 bg-primary/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {badge}
              </Badge>
            </motion.div>
          )}

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-gradient">{title}</span>
          </motion.h1>

          <motion.h2 
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-muted-foreground"
          >
            {subtitle}
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {features && (
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6 mb-8"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <feature.icon className="w-4 h-4 text-primary" />
                  {feature.text}
                </div>
              ))}
            </motion.div>
          )}

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={primaryAction.onClick}
            >
              {primaryAction.text}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {secondaryAction && (
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/20 hover:bg-primary/10 px-8 py-3 text-lg backdrop-blur-glass"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.text}
              </Button>
            )}
          </motion.div>

          {stats && (
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/50"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}