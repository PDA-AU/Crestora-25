import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export const PrizesSection = () => {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Neon glow effect background */}
          <div className="absolute -inset-1 bg-[hsl(var(--space-gold))] rounded-2xl opacity-30 blur-xl" />

          {/* Main prizes box */}
          <div className="relative bg-background/90 backdrop-blur-sm border-2 border-[hsl(var(--space-gold))] rounded-2xl p-8 shadow-[0_0_30px_hsl(var(--space-gold))]">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Trophy className="w-8 h-8 text-[hsl(var(--space-gold))]" />
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-[hsl(var(--space-gold))]">
                PRIZES
              </h2>
              <Trophy className="w-8 h-8 text-[hsl(var(--space-gold))]" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Main Event Prizes */}
              <div className="text-center">
                <h3 className="font-orbitron text-xl font-bold mb-4 text-[hsl(var(--space-cyan))]">
                  Title Event
                </h3>
                <div className="space-y-2">
                  {/* 🔥 Glowing Text Animation */}
                  <motion.div
                    initial={{ opacity: 0.7, textShadow: "0 0 10px hsl(var(--space-gold))" }}
                    animate={{
                      opacity: [0.8, 1, 0.8],
                      textShadow: [
                        "0 0 10px hsl(var(--space-gold))",
                        "0 0 20px hsl(var(--space-gold))",
                        "0 0 10px hsl(var(--space-gold))",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-2xl md:text-3xl font-extrabold text-[hsl(var(--space-gold))] drop-shadow-[0_0_12px_hsl(var(--space-gold))]"
                  >
                    TOTAL CASH POOL ₹10,000+
                  </motion.div>
                </div>
              </div>

              {/* Rolling Events Prizes */}
              <div className="text-center">
                <h3 className="font-orbitron text-xl font-bold mb-4 text-[hsl(var(--space-cyan))]">
                  Rolling Events
                  <span className="block text-sm font-normal mt-1 text-muted-foreground">
                    (Individual Registrations)
                  </span>
                </h3>
                <div className="space-y-2">
                  {/* 🔥 Glowing Text Animation */}
                  <motion.div
                    initial={{ opacity: 0.7, textShadow: "0 0 10px hsl(var(--space-gold))" }}
                    animate={{
                      opacity: [0.8, 1, 0.8],
                      textShadow: [
                        "0 0 10px hsl(var(--space-gold))",
                        "0 0 20px hsl(var(--space-gold))",
                        "0 0 10px hsl(var(--space-gold))",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-2xl md:text-3xl font-extrabold text-[hsl(var(--space-gold))] drop-shadow-[0_0_12px_hsl(var(--space-gold))]"
                  >
                    TOTAL CASH POOL ₹2000
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
