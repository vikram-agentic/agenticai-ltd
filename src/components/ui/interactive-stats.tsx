import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  icon: React.ElementType;
  number: string;
  label: string;
  description?: string;
}

interface InteractiveStatsProps {
  stats: Stat[];
  className?: string;
}

export function InteractiveStats({ stats, className = "" }: InteractiveStatsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div 
      className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-glass border-primary/20 text-center hover:border-primary/40 transition-all hover-lift">
            <CardContent className="p-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg mx-auto mb-4 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </motion.div>
              <motion.div 
                className="text-3xl font-bold text-gradient mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.div>
              <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              {stat.description && (
                <p className="text-xs text-muted-foreground/80 mt-1">{stat.description}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}