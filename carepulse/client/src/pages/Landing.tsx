import { ShieldCheck, HeartPulse, Brain, ChevronRight, Activity, Users, Building2, Globe, Sparkles, BarChart3, Stethoscope, Cpu, Target, Zap, ArrowRight, CheckCircle2, Clock, TrendingUp, Eye, Pill, AlertTriangle, MapPin, Layers } from "lucide-react";
import { CarePulseLogo } from "@/components/CarePulseLogo";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocation } from "wouter";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08 }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {value}{suffix}
    </motion.span>
  );
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <CarePulseLogo size="sm" />
              <span className="font-display font-bold text-xl tracking-tight">Care<motion.span
                className="text-red-500 inline-block"
                animate={{ opacity: [0.7, 1, 0.7], scale: [0.98, 1.03, 0.98] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >Pulse</motion.span></span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a>
              <button
                onClick={() => setLocation("/login")}
                className="px-5 py-2.5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all text-sm cursor-pointer"
                data-testid="button-login-nav"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl animate-enter">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI-Powered Healthcare Analytics
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1] mb-6">
              Smarter Care <br/>
              <span className="text-gradient">Better Outcomes</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Advanced analytics and real-time insights for healthcare professionals.
              Predict risks, optimize resources, and save lives with data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setLocation("/login")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                data-testid="button-get-started"
              >
                Get Started
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>HIPAA Compliant & Secure Data Processing</span>
            </div>
          </div>

          <div className="relative lg:h-[600px] w-full hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative h-full w-full bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-6 rotate-2 hover:rotate-0 transition-all duration-700 ease-out">
              <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                <div className="flex gap-4">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="h-2 w-32 bg-muted rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <HeartPulse className="h-8 w-8 text-primary mb-4" />
                  <div className="h-2 w-24 bg-primary/20 rounded-full mb-2"></div>
                  <div className="h-8 w-16 bg-primary/40 rounded-lg"></div>
                </div>
                <div className="bg-accent/5 p-6 rounded-2xl border border-accent/10">
                  <Brain className="h-8 w-8 text-accent mb-4" />
                  <div className="h-2 w-24 bg-accent/20 rounded-full mb-2"></div>
                  <div className="h-8 w-16 bg-accent/40 rounded-lg"></div>
                </div>
                <div className="col-span-2 bg-muted/30 h-48 rounded-2xl border border-border p-4 flex items-end gap-2">
                  {[40, 60, 45, 70, 50, 80, 65, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/30 rounded-t-sm hover:bg-primary/50 transition-colors" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">Engineered for Modern Healthcare</h2>
            <p className="text-muted-foreground">Comprehensive tools designed to streamline hospital operations and improve patient care quality.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: HeartPulse, title: "Real-time Analytics", desc: "Monitor patient vitals and hospital resources with live updates and predictive alerts." },
              { icon: Brain, title: "MedAssist AI Chat", desc: "Instant access to medical protocols and drug interaction data powered by advanced AI." },
              { icon: ShieldCheck, title: "Secure & Compliant", desc: "Enterprise-grade security ensuring patient data privacy and regulatory compliance." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={scaleIn}
                custom={i}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT — PAGE 1: INTRO & MISSION ===== */}
      <section id="about" className="relative py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
        <motion.div
          className="absolute top-20 left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-[-5%] w-[35%] h-[35%] rounded-full bg-accent/5 blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              About CarePulse
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              Transforming India's Healthcare<br />
              <span className="text-gradient">One Insight at a Time</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed">
              CarePulse is a comprehensive AI-powered healthcare analytics platform purpose-built
              for India's vast and diverse healthcare ecosystem. From rural clinics to metropolitan
              super-specialty hospitals, we bring intelligence to every level of care.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24" ref={parallaxRef}>
            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={slideLeft}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  To democratize healthcare analytics across India by empowering every hospital,
                  clinic, doctor, and patient with intelligent tools that predict health risks,
                  streamline clinical workflows, and enable data-driven decisions that save lives.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base">
                  A future where no diagnosis is delayed, no outbreak goes undetected, and every
                  healthcare professional has AI-powered intelligence at their fingertips — making
                  world-class healthcare accessible to 1.4 billion people.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {["AI-Powered", "HIPAA Compliant", "Made for India", "Real-time", "Open Platform"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={slideRight}
            >
              <motion.div style={{ y: parallaxY }} className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, value: "35,000+", label: "Hospitals Mapped", color: "from-blue-500 to-indigo-600" },
                  { icon: Users, value: "3 Roles", label: "Patient · Doctor · Admin", color: "from-violet-500 to-purple-600" },
                  { icon: Activity, value: "Real-time", label: "Live Analytics", color: "from-emerald-500 to-teal-600" },
                  { icon: Globe, value: "Pan-India", label: "Nationwide Coverage", color: "from-orange-500 to-red-500" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={scaleIn}
                    custom={i}
                    data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-bold font-display text-xl sm:text-2xl">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT — PAGE 2: PLATFORM CAPABILITIES ===== */}
      <section className="py-28 sm:py-36 bg-secondary/30 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-foreground"/>
        </svg>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
              <Layers className="h-3.5 w-3.5" />
              Platform Capabilities
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Everything You Need,<br />
              <span className="text-gradient">All in One Platform</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed">
              From patient intake to predictive outbreak mapping, CarePulse provides an end-to-end
              suite of tools designed for every role in the healthcare chain.
            </motion.p>
          </motion.div>

          <div className="space-y-8 sm:space-y-12">
            {[
              {
                icon: Stethoscope, color: "from-blue-500 to-cyan-500",
                title: "Comprehensive Patient Management",
                desc: "Track complete patient journeys with detailed health records, vitals monitoring, lab results, and medical history. Doctors get instant access to critical patient data while patients can view their own health dashboard with AI-powered insights.",
                features: ["Health Records & Vitals", "Medical ID Cards", "Patient Portal", "Doctor-Patient Linking"],
                align: "left" as const,
              },
              {
                icon: Brain, color: "from-violet-500 to-purple-500",
                title: "CareIntelligence — AI-Powered Insights",
                desc: "Our flagship AI engine powered by Google Gemini analyzes patient data to predict health risks, recommend smart appointment scheduling, summarize complex medical reports in plain language, and forecast disease outbreaks before they spread.",
                features: ["Health Risk Prediction", "Smart Appointments", "Report Summarizer", "Outbreak Forecasting"],
                align: "right" as const,
              },
              {
                icon: BarChart3, color: "from-emerald-500 to-green-500",
                title: "Predictive Analytics Dashboard",
                desc: "Hospital administrators and doctors access powerful analytics — disease trend visualization, resource optimization insights, regional health pattern analysis, and data-driven predictions. Transform raw health data into actionable intelligence.",
                features: ["Disease Trends", "Resource Optimization", "Regional Analysis", "Data Visualization"],
                align: "left" as const,
              },
              {
                icon: Cpu, color: "from-orange-500 to-amber-500",
                title: "MedAssist AI — Your Medical Co-Pilot",
                desc: "An advanced conversational AI assistant trained on medical protocols, drug interactions, and clinical guidelines. Ask about symptoms, drug dosages, contraindications, or treatment protocols and get instant, evidence-based answers.",
                features: ["Drug Interaction Check", "Symptom Analysis", "Treatment Protocols", "Clinical Guidelines"],
                align: "right" as const,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex flex-col ${item.align === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <motion.div
                  className="flex-1 space-y-5"
                  variants={item.align === "left" ? slideLeft : slideRight}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((f, fi) => (
                      <motion.span
                        key={fi}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium"
                        variants={fadeIn}
                        custom={fi + 2}
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {f}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="flex-1 w-full max-w-md lg:max-w-none"
                  variants={item.align === "left" ? slideRight : slideLeft}
                >
                  <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {item.features.map((f, fi) => (
                        <motion.div
                          key={fi}
                          className="bg-secondary/50 rounded-xl p-4 text-center border border-border/50 hover:border-primary/30 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + fi * 0.1, duration: 0.5 }}
                        >
                          <div className="text-xs font-semibold text-foreground">{f}</div>
                          <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                              initial={{ width: "0%" }}
                              whileInView={{ width: `${65 + fi * 10}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.6 + fi * 0.15, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT — PAGE 3: WHY CAREPULSE + ROLES + CTA ===== */}
      <section className="py-28 sm:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
              <Zap className="h-3.5 w-3.5" />
              Why CarePulse
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
              Built Different,<br />
              <span className="text-gradient">Built for India</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed">
              Every design decision, every algorithm, and every data model is optimized for the unique
              challenges and scale of India's healthcare landscape.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">
            {[
              { icon: MapPin, title: "35,000+ Hospitals", desc: "Comprehensive hospital directory covering every state and district across India, with real-time availability data.", color: "text-blue-500" },
              { icon: Pill, title: "Drug Interaction Checker", desc: "Instantly verify drug combinations and potential adverse interactions before prescribing — powered by verified medical databases.", color: "text-violet-500" },
              { icon: AlertTriangle, title: "Outbreak Detection", desc: "AI monitors disease patterns across regions to predict and alert authorities about potential outbreaks before they escalate.", color: "text-orange-500" },
              { icon: Clock, title: "Smart Scheduling", desc: "Intelligent appointment recommendations that consider doctor availability, patient urgency, travel time, and historical patterns.", color: "text-emerald-500" },
              { icon: TrendingUp, title: "Health Risk Scoring", desc: "Machine learning models analyze patient vitals, history, and demographics to generate personalized health risk assessments.", color: "text-red-500" },
              { icon: ShieldCheck, title: "Role-Based Security", desc: "Three-tier access system ensures patients see their data, doctors manage their patients, and admins oversee everything securely.", color: "text-cyan-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={scaleIn}
                custom={i}
                data-testid={`why-card-${i}`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base mb-1.5">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mb-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} custom={0} className="text-center mb-14">
              <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3">Designed for Every Role</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">Three tailored experiences, one unified platform.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  role: "Patient",
                  icon: Users,
                  gradient: "from-blue-500 to-cyan-500",
                  bg: "bg-blue-500/5 border-blue-500/20",
                  features: ["Personal health dashboard", "Medical ID card with QR code", "Symptom checker & health tools", "BMI, heart rate & calorie calculators", "View prescriptions & appointments", "AI health insights & risk scores"],
                },
                {
                  role: "Doctor",
                  icon: Stethoscope,
                  gradient: "from-violet-500 to-purple-500",
                  bg: "bg-violet-500/5 border-violet-500/20",
                  features: ["Patient management & records", "Predictive analytics dashboard", "CareIntelligence AI tools", "Prescription management", "Emergency alert system", "Drug interaction checker"],
                },
                {
                  role: "Admin",
                  icon: ShieldCheck,
                  gradient: "from-emerald-500 to-teal-500",
                  bg: "bg-emerald-500/5 border-emerald-500/20",
                  features: ["Full system administration", "User management & roles", "Hospital-wide analytics", "Resource allocation insights", "Outbreak monitoring", "Compliance & audit logs"],
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`rounded-2xl border p-6 sm:p-8 ${item.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={scaleIn}
                  custom={i}
                  data-testid={`role-card-${item.role.toLowerCase()}`}
                >
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="text-xl font-display font-bold mb-1">{item.role}</h4>
                  <p className="text-xs text-muted-foreground mb-5">Access Level {i + 1} of 3</p>
                  <ul className="space-y-2.5">
                    {item.features.map((f, fi) => (
                      <motion.li
                        key={fi}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + fi * 0.07 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent" />
            <motion.div
              className="absolute top-0 right-0 w-[50%] h-full bg-white/5 rounded-l-full blur-2xl"
              animate={{ x: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-[10%] w-[30%] h-[60%] bg-white/5 rounded-full blur-3xl"
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            <div className="relative z-10 px-8 sm:px-12 lg:px-20 py-16 sm:py-20 text-center text-white">
              <motion.div variants={fadeUp} custom={0}>
                <Sparkles className="h-8 w-8 mx-auto mb-4 opacity-80" />
              </motion.div>
              <motion.h3 variants={fadeUp} custom={1} className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-4">
                Ready to Transform Healthcare?
              </motion.h3>
              <motion.p variants={fadeUp} custom={2} className="text-white/80 mb-8 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                Join the movement to bring intelligent, data-driven healthcare to every corner of India.
                Start your journey with CarePulse today — it's free to get started.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setLocation("/login")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-base"
                  data-testid="button-about-get-started"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 text-base"
                  data-testid="link-explore-features"
                >
                  Explore Features
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <CarePulseLogo size="sm" />
                <span className="font-display font-bold text-lg">CarePulse</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Intelligent Healthcare Analytics Platform built for India's healthcare ecosystem.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-3">Platform</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><button onClick={() => setLocation("/login")} className="hover:text-primary transition-colors">Get Started</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-3">Capabilities</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Patient Management</li>
                <li>CareIntelligence AI</li>
                <li>Predictive Analytics</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-3">Roles</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Patient Portal</li>
                <li>Doctor Dashboard</li>
                <li>Admin Console</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} CarePulse. Intelligent Healthcare Analytics for India.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>HIPAA Compliant</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span>Secure by Design</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span>Made with Care</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
