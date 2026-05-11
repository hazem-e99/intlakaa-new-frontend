import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FaCheckCircle,
  FaHome,
  FaRocket,
  FaStar
} from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import FadeIn from "@/components/FadeIn";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <style>{`
        @keyframes thank-you-star {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          20% { opacity: 1; transform: scale(1) translateY(-20px); }
          70% { opacity: 1; transform: scale(1) translateY(-80px); }
          100% { opacity: 0; transform: scale(0) translateY(-100px); }
        }
        @keyframes thank-you-confetti-fall {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(110vh) rotate(var(--confetti-rotate-end, 360deg));
            opacity: 0;
          }
        }
        @keyframes thank-you-sparkle {
          0%, 100% { transform: rotate(0deg); }
          4% { transform: rotate(15deg); }
          8% { transform: rotate(-15deg); }
          12%, 99% { transform: rotate(0deg); }
        }
        .thank-you-sparkle-icon {
          animation: thank-you-sparkle 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-60" />

        {/* Floating Stars */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animation: "thank-you-star 3s ease-out infinite",
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <FaStar size={20} />
          </div>
        ))}
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: particle.color,
                left: `${particle.left}%`,
                top: "-5%",
                ["--confetti-rotate-end" as string]: `${particle.rotation}deg`,
                animation: `thank-you-confetti-fall ${particle.duration}s linear ${particle.delay}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <FadeIn
        className="relative z-10 max-w-2xl w-full"
        direction="scale"
        duration={0.6}
        margin="0px"
      >
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary/20 overflow-hidden">
          {/* Header Section with Icon */}
          <div className="relative gradient-brand p-8 text-center">
            <FadeIn
              as="div"
              className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4"
              delay={0.2}
              direction="scale"
              duration={0.55}
              margin="0px"
            >
              <FaCheckCircle className="w-14 h-14 text-green-500" />
            </FadeIn>

            <FadeIn delay={0.4} margin="0px">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2 flex items-center justify-center gap-3">
                تم الإرسال بنجاح!
                <span className="thank-you-sparkle-icon inline-flex">
                  <IoSparkles className="w-8 h-8" />
                </span>
              </h1>
              <p className="text-xl text-white/90">
                استلمنا بياناتك وسنتواصل معك قريبًا
              </p>
            </FadeIn>
          </div>

          {/* Body Content */}
          <div className="p-8 md:p-12 space-y-8">
            {/* Success Message */}
            <FadeIn className="text-center space-y-4" delay={0.6} margin="0px">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full px-6 py-3">
                <FaRocket className="w-5 h-5 text-primary" />
                <span className="font-bold text-lg">رحلة النجاح بدأت الآن</span>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                فريقنا سيتواصل معك خلال <span className="font-bold text-gradient">24 ساعة</span> لبدء خطة التسويق المخصصة لعلامتك التجارية
              </p>
            </FadeIn>

            {/* What's Next Section */}
            <FadeIn
              className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 space-y-4"
              delay={0.8}
              margin="0px"
            >
              <h3 className="text-xl font-bold text-center mb-4">وش اللي بعده؟</h3>

              <div className="space-y-3">
                {[
                  { step: "1", text: "مراجعة بياناتك وتحليل احتياجاتك" },
                  { step: "2", text: "إعداد خطة تسويقية مخصصة لك" },
                  { step: "3", text: "التواصل معك لمناقشة الخطة والبدء" },
                ].map((item, index) => (
                  <FadeIn
                    key={item.step}
                    className="flex items-center gap-4"
                    delay={1 + index * 0.1}
                    direction="right"
                    margin="0px"
                  >
                    <div className="flex-shrink-0 w-10 h-10 gradient-brand rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {item.step}
                    </div>
                    <p className="text-base font-medium">{item.text}</p>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>

            {/* Action Buttons */}
            <FadeIn className="flex flex-col sm:flex-row gap-4 pt-4" delay={1.5} margin="0px">
              <Button
                onClick={() => navigate("/")}
                className="cta-hover flex-1 gradient-brand text-white px-8 py-6 rounded-full text-lg font-black shadow-lg hover:shadow-xl transition-all"
              >
                <FaHome className="ml-2 w-5 h-5" />
                العودة للرئيسية
              </Button>

              <Button
                onClick={() => navigate("/form")}
                variant="outline"
                className="cta-hover flex-1 px-8 py-6 rounded-full text-lg font-bold border-2 hover:bg-primary/10 transition-all"
              >
                إرسال طلب آخر
              </Button>
            </FadeIn>

            {/* Footer Note */}
            <FadeIn
              as="p"
              className="text-center text-sm text-muted-foreground pt-4"
              delay={1.8}
              direction="none"
              margin="0px"
            >
              شكرًا لثقتك في <span className="font-bold text-gradient">انطلاقة</span> 🚀
            </FadeIn>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default ThankYou;
