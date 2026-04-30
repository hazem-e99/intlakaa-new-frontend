import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { createRequest } from "@/services/requestsService";
import { pushGTMEvent } from "@/utils/gtm";
import FadeIn from "@/components/FadeIn";

const Form = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const entries = Object.fromEntries(formData.entries());

      // Get user's IP address and country
      let ipAddress = null;
      let country = null;
      let phoneCountry = null;
      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 2500);
        try {
          const ipResponse = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
          country = ipData.country_name;
          // Get country calling code from IP data
          phoneCountry = ipData.country_calling_code || null;
        } finally {
          window.clearTimeout(timeoutId);
        }
      } catch (ipError) {
        console.warn('Could not fetch IP address:', ipError);
      }

      // 1️⃣ — Insert into Backend API
      await createRequest({
        name: String(entries.name),
        phone: String(entries.phone),
        storeUrl: String(entries.store_url),
        monthlySales: String(entries.monthly_sales),
        field: String(entries.field),
        motivation: String(entries.motivation),
        ipAddress,
        country,
        phoneCountry,
      });

      // 2️⃣ — Send email using Web3Forms
      const web3Payload = {
        access_key: "3b3c60f6-dd04-4b27-a7ed-8de9cabe77de",
        name: entries.name,
        phone: entries.phone,
        store_url: entries.store_url,
        monthly_sales: entries.monthly_sales,
        field: entries.field,
        motivation: entries.motivation,
      };

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(web3Payload),
      });

      // Success
      toast({
        title: "تم الإرسال بنجاح",
        description: "سيتم إعادة توجيهك الآن...",
      });

      // Track form submission in GTM
      pushGTMEvent('form_submit', {
        form_name: 'contact_form',
        form_fields: Object.keys(entries).length,
        timestamp: new Date().toISOString(),
      });

      // Track as lead/conversion event
      pushGTMEvent('generate_lead', {
        currency: 'SAR',
        value: 0,
        lead_source: 'website_form',
      });

      setTimeout(() => navigate("/thank-you"), 800);

    } catch (err) {
      console.error(err);
      toast({
        title: "حدث خطأ",
        description: "تعذر إرسال البيانات. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="w-full md:container md:mx-auto md:max-w-3xl">
        <FadeIn duration={0.6} direction="up" margin="0px">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowRight className="ml-2 w-4 h-4" />
            العودة للرئيسية
          </Button>

          <div className="gradient-brand rounded-3xl p-1 shadow-medium">
            <div className="bg-background rounded-3xl p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
                ابدأ رحلتك مع انطلاقة
              </h1>
              <p className="text-lg text-center text-muted-foreground mb-8">
                عبّي البيانات وخلنا نبدأ معك خطوة النمو الحقيقي
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسمك</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="أدخل اسمك الكامل"
                      className="form-input text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم جوالك</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="مثال: +966501234567 أو 0501234567"
                      className="form-input text-right"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_url">رابط المتجر</Label>
                  <Input
                    id="store_url"
                    name="store_url"
                    type="text"
                    required
                    placeholder="مثال: اسم المتجر أو رابط الموقع"
                    className="form-input text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_sales">المبيعات الشهرية</Label>
                  <Input
                    id="monthly_sales"
                    name="monthly_sales"
                    type="text"
                    required
                    placeholder="مثال: 50,000 ريال أو وصف المبيعات"
                    className="form-input text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field">ما هو مجالك؟</Label>
                  <Input
                    id="field"
                    name="field"
                    type="text"
                    required
                    placeholder="مثال: ملابس، إلكترونيات، عطور..."
                    className="form-input text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">ما الذي حفزك على حجز هذه المكالمة؟</Label>
                  <Input
                    id="motivation"
                    name="motivation"
                    type="text"
                    required
                    placeholder="أخبرنا بما دفعك للتواصل معنا"
                    className="form-input text-right"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-hover w-full gradient-brand text-white py-5 text-lg font-bold shadow-medium hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال النموذج"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default memo(Form);
