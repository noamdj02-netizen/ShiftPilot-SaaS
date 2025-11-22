"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "Combien de temps faut-il pour configurer ShiftPilot ?",
    answer:
      "La configuration initiale prend moins de 30 minutes. Vous ajoutez vos employés, définissez vos horaires d'ouverture, et c'est prêt ! Votre premier planning peut être généré en quelques secondes.",
  },
  {
    question: "ShiftPilot respecte-t-il la législation du travail ?",
    answer:
      "Absolument. ShiftPilot intègre automatiquement les règles légales : 11h de repos entre deux shifts, gestion des coupures, heures supplémentaires, et respect des conventions collectives HCR. Vous êtes toujours en conformité.",
  },
  {
    question: "Puis-je modifier un planning après génération ?",
    answer:
      "Oui, bien sûr ! Vous pouvez modifier manuellement n'importe quel shift, déplacer des employés, ou régénérer le planning avec de nouvelles contraintes. Toutes les modifications sont sauvegardées automatiquement.",
  },
  {
    question: "Mes employés peuvent-ils voir leurs plannings ?",
    answer:
      "Oui, une fois le planning publié, vos employés reçoivent une notification et peuvent consulter leurs shifts depuis leur smartphone. Ils peuvent également indiquer leurs disponibilités directement dans l'application.",
  },
  {
    question: "Que se passe-t-il pendant la période d'essai ?",
    answer:
      "Pendant 14 jours, vous avez accès à toutes les fonctionnalités sans engagement. Aucune carte bancaire n'est requise. Si ShiftPilot ne vous convient pas, vous pouvez annuler à tout moment sans frais.",
  },
  {
    question: "Puis-je utiliser ShiftPilot pour plusieurs établissements ?",
    answer:
      "Oui, selon votre formule, vous pouvez gérer plusieurs établissements depuis un seul compte. Parfait pour les chaînes de restaurants ou les groupes.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">Questions fréquentes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur ShiftPilot
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass border border-border/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 backdrop-blur-md group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors rounded-xl"
              >
                <span className="font-semibold text-lg text-foreground pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-muted-foreground leading-relaxed">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

