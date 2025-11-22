"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Users, Clock, TrendingUp, Shield, ArrowRight, Sparkles, Play } from "lucide-react"
import { motion } from "framer-motion"
import { StatsSection } from "@/components/landing/stats-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FAQSection } from "@/components/landing/faq-section"
import { DemoSection } from "@/components/landing/demo-section"
import { TextReveal } from "@/components/animations/text-reveal"
import { MagneticButton } from "@/components/animations/magnetic-button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-lg"
            >
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <span className="text-2xl font-bold text-foreground">ShiftPilot</span>
          </motion.div>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#features", label: "Fonctionnalités" },
              { href: "#demo", label: "Démo" },
              { href: "#before-after", label: "Avant/Après" },
              { href: "#pricing", label: "Tarifs" },
            ].map((link) => (
              <motion.div key={link.href} whileHover={{ y: -2 }}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
            </motion.div>
            <MagneticButton strength={0.15}>
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/signup">Essayer gratuitement</Link>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-sm font-medium mb-6 text-card-foreground">
              <Sparkles className="h-4 w-4" />
              Spécialement conçu pour la restauration
            </div>
            <TextReveal
              text="La planification du personnel enfin pensée pour les restaurants"
              className="text-5xl lg:text-7xl font-bold text-balance mb-6 text-foreground leading-tight"
            />
            <p className="text-xl lg:text-2xl text-muted-foreground text-balance mb-10 leading-relaxed max-w-3xl mx-auto">
              Créez vos plannings en quelques secondes, optimisez vos services midi et soir, éliminez les
              sous-effectifs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton strength={0.2}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14" asChild>
                  <Link href="/signup">
                    Essayer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-transparent" asChild>
                  <Link href="#demo">
                    <Play className="mr-2 h-5 w-5" />
                    Voir une démo
                  </Link>
                </Button>
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              14 jours gratuits • Sans carte bancaire • Annulation à tout moment
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-card border-2 border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="text-center font-medium text-sm text-muted-foreground"
                >
                  {day}
                </motion.div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { name: "Service Midi", color: "bg-chart-1", delay: 0.6 },
                { name: "Service Soir", color: "bg-chart-2", delay: 0.7 },
                { name: "Bar", color: "bg-chart-3", delay: 0.8 },
              ].map((service) => (
                <div key={service.name} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-28 text-foreground">{service.name}</span>
                  <div className="flex-1 grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: service.delay + i * 0.05 }}
                        className={`${service.color} rounded-lg h-12 flex items-center justify-center text-xs font-medium text-white`}
                      >
                        {i < 5 ? "2-3" : "3-4"}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center text-sm text-muted-foreground mt-6"
              >
                Planning généré automatiquement en 5 secondes
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      <StatsSection />

      <DemoSection />

      <section id="before-after" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">Avant / Après ShiftPilot</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Abandonnez les outils inadaptés pour une solution pensée pour vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-destructive/5 border-2 border-destructive/20 rounded-2xl p-8"
            >
              <div className="text-destructive font-bold text-sm mb-4">AVANT</div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Excel + WhatsApp</h3>
              <ul className="space-y-4">
                {[
                  "2h pour faire un planning par semaine",
                  "Erreurs de saisie constantes",
                  "Conflits d'horaires non détectés",
                  "Messages WhatsApp sans fin",
                  "Temps de travail non comptabilisé",
                  "Stress permanent du manager",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-destructive text-xs">✕</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-accent-green/5 border-2 border-accent-green/40 rounded-2xl p-8"
            >
              <div className="text-accent-green font-bold text-sm mb-4">APRÈS</div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Avec ShiftPilot</h3>
              <ul className="space-y-4">
                {[
                  "5 minutes pour générer un planning",
                  "Zéro erreur de calcul",
                  "Conflits détectés automatiquement",
                  "Équipe notifiée en 1 clic",
                  "Suivi temps réel des heures",
                  "Sérénité retrouvée",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground">
                    <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Fonctionnalités pensées pour le service
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Chaque détail a été conçu pour les réalités de la restauration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Service Midi / Soir"
              description="Organisez vos deux services quotidiens avec des plannings dédiés. Gérez les coupures légalement."
              color="bg-chart-1"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Rôles Métiers"
              description="Serveur, Barman, Runner, Commis, Chef de rang... Assignez les bonnes personnes aux bons postes."
              color="bg-chart-2"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Conformité Légale"
              description="Respect automatique des 11h de repos, coupures, heures sup et conventions collectives HCR."
              color="bg-chart-3"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Équité des Heures"
              description="Évitez les extras abusifs. Distribuez équitablement les heures entre votre équipe permanente."
              color="bg-chart-4"
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Disponibilités"
              description="Vos employés indiquent leurs dispos. Le planning s'adapte automatiquement à vos contraintes."
              color="bg-chart-1"
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="Génération IA"
              description="L'IA crée le planning optimal en fonction de l'affluence prévue, des compétences et des préférences."
              color="bg-accent"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Utilisé par les meilleurs établissements
            </h2>
            <p className="text-lg text-muted-foreground">Ce que disent les managers qui nous font confiance</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "ShiftPilot nous fait gagner 10h par semaine sur la gestion des plannings. Un gain de sérénité incroyable. L'IA comprend vraiment nos contraintes de service.",
                author: "Marie Dubois",
                role: "Manager - Brasserie Le Central, Paris",
                rating: 5,
                image: "MD",
              },
              {
                quote:
                  "Fini les conflits d'horaires et les heures sup non comptées. Tout est transparent et automatisé. Mon équipe est plus sereine et moi aussi !",
                author: "Thomas Laurent",
                role: "Propriétaire - Bistrot Moderne, Lyon",
                rating: 5,
                image: "TL",
              },
              {
                quote:
                  "L'équipe adore pouvoir indiquer ses dispos et recevoir le planning directement. Zéro WhatsApp, zéro stress. C'est exactement ce qu'il nous fallait.",
                author: "Sophie Martin",
                role: "Cheffe de rang - Restaurant Le Jardin, Nice",
                rating: 5,
                image: "SM",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <motion.svg
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15 + j * 0.1 }}
                        className="w-5 h-5 fill-chart-2 text-chart-2"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </motion.svg>
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed text-lg italic relative">
                    <span className="text-4xl font-bold text-primary/20 absolute -top-2 -left-2">"</span>
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">Tarifs transparents</h2>
            <p className="text-lg text-muted-foreground">Adapté à la taille de votre établissement</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Petit Resto"
              price="59"
              description="Idéal pour cafés et petits restaurants"
              features={["Jusqu'à 15 employés", "Planning midi & soir", "Génération IA basique", "Support email"]}
            />
            <PricingCard
              name="Brasserie"
              price="129"
              description="Pour établissements moyens"
              features={[
                "Jusqu'à 50 employés",
                "Multi-établissements (2 lieux)",
                "IA avancée + analytics",
                "Support prioritaire",
              ]}
              popular
            />
            <PricingCard
              name="Groupe"
              price="Sur devis"
              description="Pour chaînes et grands groupes"
              features={[
                "Employés illimités",
                "Multi-établissements illimité",
                "IA personnalisée",
                "Support dédié 24/7",
              ]}
            />
          </div>
        </div>
      </section>

      <HowItWorks />

      <FAQSection />

      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border-2 border-current rounded-full" />
          <div className="absolute bottom-40 right-20 w-48 h-48 border-2 border-current rounded-lg rotate-45" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border-2 border-current rounded-full" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold mb-6 text-balance"
            >
              Reprenez le contrôle de vos plannings
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-10 text-balance opacity-90 max-w-2xl mx-auto leading-relaxed"
            >
              Rejoignez les centaines de restaurants qui gagnent du temps chaque semaine avec ShiftPilot
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <MagneticButton strength={0.15}>
                <Button size="lg" variant="secondary" className="text-lg px-8 h-14" asChild>
                  <Link href="/signup">
                    Essayer 14 jours gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">ShiftPilot</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La planification intelligente pour les professionnels de la restauration.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Produit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-foreground transition">
                    Démo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground transition">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="hover:text-foreground transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Légal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#privacy" className="hover:text-foreground transition">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="hover:text-foreground transition">
                    CGU
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>2025 ShiftPilot. Conçu pour les restaurants, bars et brasseries.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-card border-2 border-border rounded-xl p-6 hover:shadow-2xl transition-all relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ duration: 0.5, type: "tween" }}
          className={`${color} text-white w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg`}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

function PricingCard({
  name,
  price,
  description,
  features,
  popular,
}: {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: popular ? 1.08 : 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-card border-2 rounded-2xl p-8 relative transition-all overflow-hidden group ${
        popular ? "border-accent shadow-2xl scale-105 bg-gradient-to-br from-accent/5 to-card" : "border-border"
      }`}
    >
      {popular && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg"
        >
          Populaire
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 text-foreground">{name}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="mb-8">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-foreground"
          >
            {price}
          </motion.span>
          {price !== "Sur devis" && <span className="text-muted-foreground">/mois</span>}
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
              </motion.div>
              <span className="text-sm text-foreground">{feature}</span>
            </motion.li>
          ))}
        </ul>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className={`w-full ${popular ? "bg-accent hover:bg-accent/90" : ""}`}
            variant={popular ? "default" : "outline"}
            asChild
          >
            <Link href="/signup">Commencer</Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
