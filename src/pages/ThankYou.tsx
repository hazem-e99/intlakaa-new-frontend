import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FaCheckCircle, 
  FaWhatsapp, 
  FaInstagram, 
  FaEnvelope,
  FaHome,
  FaRocket,
  FaStar
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";

const ThankYou = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Auto-hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Confetti particles
  const confettiColors = [
    "#9B50E8", // primary
    "#E774FF", // secondary
    "#FF6B9D",
    "#FFC371",
    "#4ECDC4",
  ];

  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360,
  }));

  const socialLinks = [
    {
      icon: FaWhatsapp,
      label: "واتساب",
      href: "https://wa.me/966511414537",
      color: "hover:bg-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: FaInstagram,
      label: "إنستغرام",
      href: "https://instagram.com/antlaqa",
      color: "hover:bg-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: FaEnvelope,
      label: "البريد",
      href: "mailto:info@antlaqa.com",
      color: "hover:bg-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-60" />
        
        {/* Floating Stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -100],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
          >
            <FaStar size={20} />
          </motion.div>
        ))}
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: particle.color,
                left: `${particle.left}%`,
                top: "-5%",
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: "110vh",
                opacity: [1, 1, 0],
                rotate: particle.rotation,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary/20 overflow-hidden">
          {/* Header Section with Icon */}
          <div className="relative gradient-brand p-8 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2 
              }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4"
            >
              <FaCheckCircle className="w-14 h-14 text-green-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center justify-center gap-3">
                تم الإرسال بنجاح!
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <IoSparkles className="w-8 h-8" />
                </motion.div>
              </h1>
              <p className="text-xl text-white/90">
                استلمنا بياناتك وسنتواصل معك قريبًا
              </p>
            </motion.div>
          </div>

          {/* Body Content */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full px-6 py-3">
                <FaRocket className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">رحلة النجاح بدأت الآن</span>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                فريقنا سيتواصل معك خلال <span className="font-bold text-gradient">24 ساعة</span> لبدء خطة التسويق المخصصة لعلامتك التجارية
              </p>
            </motion.div>

            {/* What's Next Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 space-y-4"
            >
              <h3 className="text-xl font-bold text-center mb-4">وش اللي بعده؟</h3>
              
              <div className="space-y-3">
                {[
                  { step: "1", text: "مراجعة بياناتك وتحليل احتياجاتك" },
                  { step: "2", text: "إعداد خطة تسويقية مخصصة لك" },
                  { step: "3", text: "التواصل معك لمناقشة الخطة والبدء" },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 gradient-brand rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {item.step}
                    </div>
                    <p className="text-base font-medium">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              <p className="text-center text-muted-foreground font-medium">
                أو تواصل معنا مباشرة:
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 1.3 + index * 0.1,
                      type: "spring",
                      stiffness: 200 
                    }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${social.bgColor} ${social.color} transition-all duration-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg border border-transparent hover:border-current group`}
                  >
                    <social.icon className="w-8 h-8 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-bold">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                onClick={() => navigate("/")}
                className="flex-1 gradient-brand text-white px-8 py-6 rounded-full text-lg font-black shadow-lg hover:shadow-xl transition-all"
              >
                <FaHome className="ml-2 w-5 h-5" />
                العودة للرئيسية
              </Button>
              
              <Button
                onClick={() => navigate("/form")}
                variant="outline"
                className="flex-1 px-8 py-6 rounded-full text-lg font-bold border-2 hover:bg-primary/10 transition-all"
              >
                إرسال طلب آخر
              </Button>
            </motion.div>

            {/* Footer Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center text-sm text-muted-foreground pt-4"
            >
              شكرًا لثقتك في <span className="font-bold text-gradient">انطلاقة</span> 🚀
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
