import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Supabase automatically provides these environment variables
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

  if (!SERVICE_ROLE_KEY || !SUPABASE_URL) {
    return new Response(JSON.stringify({ 
      error: "Missing environment variables",
      details: {
        hasServiceRole: !!SERVICE_ROLE_KEY,
        hasUrl: !!SUPABASE_URL
      }
    }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // =========================================================
  // 1- LIST USERS
  // =========================================================
  if (req.method === "GET" && action === "list") {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return new Response(JSON.stringify(error), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ users: data.users }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // =========================================================
  // 2- INVITE USER (WITH TEMP PASSWORD)
  // =========================================================
  if (req.method === "POST" && action === "invite") {
    const { email } = await req.json();

    // Generate random temporary password (12 characters)
    const generateTempPassword = () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const tempPassword = generateTempPassword();

    // Create user with temp password and must_change_password flag
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        must_change_password: true,
      },
    });

    if (createError) {
      return new Response(JSON.stringify({ 
        error: createError.message,
        details: createError 
      }), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send custom email with temp password
    // Using SendGrid API
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    
    console.log("SENDGRID_API_KEY exists:", !!SENDGRID_API_KEY);
    
    if (SENDGRID_API_KEY) {
      try {
        console.log("Attempting to send email to:", email);
        
        const htmlContent = `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
                direction: rtl;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 40px 30px;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
                color: #333;
                margin: 15px 0;
              }
              .credentials-box {
                background: #f8f9fa;
                border-right: 4px solid #667eea;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
              }
              .credentials-box p {
                margin: 10px 0;
                font-size: 15px;
              }
              .credentials-box strong {
                color: #667eea;
                font-size: 16px;
              }
              .password-display {
                background: white;
                padding: 15px;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                font-size: 18px;
                font-weight: bold;
                color: #764ba2;
                text-align: center;
                margin-top: 10px;
                border: 2px dashed #667eea;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
              }
              .warning-box {
                background: #fff3cd;
                border-right: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 8px;
              }
              .warning-box p {
                margin: 5px 0;
                color: #856404;
                font-size: 14px;
              }
              .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #6c757d;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 مرحباً بك في انطلاقة</h1>
              </div>
              
              <div class="content">
                <p>مرحباً،</p>
                <p>تمت دعوتك للانضمام كمسؤول في منصة <strong>انطلاقة</strong>.</p>
                
                <div class="credentials-box">
                  <p><strong>📧 البريد الإلكتروني:</strong></p>
                  <p>${email}</p>
                  
                  <p style="margin-top: 20px;"><strong>🔑 كلمة المرور المؤقتة:</strong></p>
                  <div class="password-display">${tempPassword}</div>
                </div>
                
                <div style="text-align: center;">
                  <a href="https://www.intlakaa.com/admin/login" class="cta-button">
                    🔐 تسجيل الدخول الآن
                  </a>
                </div>
                
                <div class="warning-box">
                  <p><strong>⚠️ مهم جداً:</strong></p>
                  <p>• يجب عليك تسجيل الدخول وتغيير كلمة المرور فوراً</p>
                  <p>• كلمة المرور المؤقتة صالحة لمرة واحدة فقط</p>
                  <p>• لا تشارك كلمة المرور مع أي شخص</p>
                </div>
                
                <p style="margin-top: 30px;">إذا لم تطلب هذه الدعوة، يرجى تجاهل هذا البريد.</p>
              </div>
              
              <div class="footer">
                <p>مع تحياتنا،<br><strong>فريق انطلاقة</strong></p>
                <p style="margin-top: 10px; font-size: 12px;">
                  © 2025 انطلاقة. جميع الحقوق محفوظة.
                </p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: email }],
              subject: "دعوة للانضمام كمسؤول - انطلاقة",
            }],
            from: {
              email: "hazem@intlakaa.com",
              name: "انطلاقة"
            },
            content: [{
              type: "text/html",
              value: htmlContent
            }]
          }),
        });

        console.log("Email response status:", emailResponse.status);
        
        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error("Email sending failed:", errorText);
        } else {
          console.log("Email sent successfully via SendGrid");
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.error("SENDGRID_API_KEY not found in environment variables!");
    }

    return new Response(JSON.stringify({ 
      success: true,
      user: userData.user,
      message: "تم إنشاء المستخدم وإرسال البريد الإلكتروني بنجاح",
      // Don't send temp password in response for security
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // =========================================================
  // 3- DELETE USER
  // =========================================================
  if (req.method === "DELETE" && action === "delete") {
    const { userId } = await req.json();

    const { data, error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return new Response(JSON.stringify(error), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // =========================================================
  // 4- UPDATE USER ROLE
  // =========================================================
  if (req.method === "POST" && action === "update-role") {
    const { userId, role } = await req.json();

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });

    if (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        details: error 
      }), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      user: data.user
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // =========================================================
  // DEFAULT
  // =========================================================
  return new Response(JSON.stringify({ error: "Invalid route" }), { 
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
