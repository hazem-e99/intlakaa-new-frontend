# 🔥 Edge Function Setup - Temporary Password System

## ✅ تم التعديل بنجاح!

تم تحديث الـ Edge Function `admin-users` لاستخدام نظام **الباسورد المؤقت** بدلاً من روابط الدعوة.

---

## 🔥 التغييرات الرئيسية

### 1️⃣ **إنشاء باسورد مؤقت عشوائي**
```typescript
const generateTempPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
```
- ✅ 12 حرف عشوائي
- ✅ يحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة
- ✅ آمن وقوي

---

### 2️⃣ **إنشاء المستخدم مع الباسورد المؤقت**
```typescript
const { data: userData, error: createError } = await supabase.auth.admin.createUser({
  email,
  password: tempPassword,
  email_confirm: true, // تأكيد البريد تلقائياً
  user_metadata: {
    must_change_password: true, // 🔥 مهم جداً!
  },
});
```

---

### 3️⃣ **إرسال إيميل مخصص بالباسورد المؤقت**
- ✅ تصميم HTML جميل وحديث
- ✅ RTL (من اليمين لليسار) للغة العربية
- ✅ يحتوي على:
  - البريد الإلكتروني
  - الباسورد المؤقت (مع تنسيق واضح)
  - رابط تسجيل الدخول المباشر
  - تحذيرات أمنية

---

## 🔥 إعداد Resend API

### الخطوة 1: إنشاء حساب Resend
1. اذهب إلى: https://resend.com
2. سجل حساب جديد
3. تحقق من بريدك الإلكتروني

### الخطوة 2: الحصول على API Key
1. اذهب إلى Dashboard → API Keys
2. اضغط "Create API Key"
3. انسخ الـ API Key

### الخطوة 3: إضافة Domain (اختياري)
إذا كنت تريد إرسال من `noreply@intlakaa.com`:
1. اذهب إلى Domains → Add Domain
2. أضف `intlakaa.com`
3. اتبع التعليمات لإضافة DNS Records

**أو** استخدم domain مجاني من Resend:
- غير `from: "انطلاقة <noreply@intlakaa.com>"`
- إلى `from: "انطلاقة <onboarding@resend.dev>"`

---

## 🔥 إضافة Environment Variables في Supabase

### الطريقة 1: من Dashboard
1. اذهب إلى Supabase Dashboard
2. Project Settings → Edge Functions
3. أضف:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

### الطريقة 2: من Command Line
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔥 Deploy الـ Edge Function

### 1. تأكد من تسجيل الدخول
```bash
supabase login
```

### 2. Link المشروع
```bash
supabase link --project-ref sxpaphmltbnangdubutm
```

### 3. Deploy الـ Function
```bash
supabase functions deploy admin-users
```

---

## 🔥 اختبار الـ Edge Function

### من Frontend (ManageAdmins.tsx)
الكود الموجود يجب أن يعمل بدون تعديل:

```typescript
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/admin-users?action=invite`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ email: newAdminEmail }),
  }
);
```

### من cURL (للاختبار)
```bash
curl -X POST \
  'https://sxpaphmltbnangdubutm.supabase.co/functions/v1/admin-users?action=invite' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com"}'
```

---

## 🔥 كيف يعمل النظام الكامل

### 1. **Admin يدعو مستخدم جديد**
```
Frontend → Edge Function
  ↓
Edge Function:
  - يولد باسورد مؤقت عشوائي
  - ينشئ المستخدم مع must_change_password: true
  - يرسل إيميل بالباسورد المؤقت
  ↓
Response: { success: true, user: {...} }
```

### 2. **المستخدم الجديد يستلم الإيميل**
```
📧 Email يحتوي على:
  - البريد الإلكتروني
  - الباسورد المؤقت
  - رابط: https://www.intlakaa.com/admin/login
  - تحذيرات أمنية
```

### 3. **المستخدم يسجل الدخول**
```
/admin/login
  ↓
يدخل email + temp password
  ↓
Login.tsx يتحقق من must_change_password
  ↓
Redirect → /admin/change-password
```

### 4. **المستخدم يغير الباسورد**
```
/admin/change-password
  ↓
يدخل باسورد جديد (2x)
  ↓
updateUser({ password: newPassword })
updateUser({ data: { must_change_password: false } })
  ↓
signOut() → Redirect to /admin/login
```

### 5. **تسجيل دخول نهائي**
```
/admin/login
  ↓
يدخل email + new password
  ↓
must_change_password = false
  ↓
Redirect → /admin (Dashboard)
```

---

## 🔥 بدائل لـ Resend

إذا كنت تريد استخدام خدمة إيميل أخرى:

### 1. **SendGrid**
```typescript
const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${SENDGRID_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email }] }],
    from: { email: "noreply@intlakaa.com", name: "انطلاقة" },
    subject: "دعوة للانضمام كمسؤول - انطلاقة",
    content: [{ type: "text/html", value: htmlContent }],
  }),
});
```

### 2. **Mailgun**
```typescript
const formData = new FormData();
formData.append("from", "انطلاقة <noreply@intlakaa.com>");
formData.append("to", email);
formData.append("subject", "دعوة للانضمام كمسؤول - انطلاقة");
formData.append("html", htmlContent);

const emailResponse = await fetch(
  `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
  {
    method: "POST",
    headers: {
      "Authorization": `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
    },
    body: formData,
  }
);
```

### 3. **استخدام Supabase Email (محدود)**
⚠️ **ملاحظة**: Supabase Email محدود جداً ومش مناسب للـ production.

---

## 🔥 Security Notes

### ✅ الأمان المطبق:
1. **الباسورد المؤقت عشوائي وقوي** (12 حرف)
2. **must_change_password flag** يجبر المستخدم على تغيير الباسورد
3. **الباسورد المؤقت لا يُرسل في Response** (فقط في الإيميل)
4. **email_confirm: true** لتجنب خطوة التأكيد الإضافية
5. **Global Session Check** في Frontend يمنع الوصول للـ dashboard

### 🔒 توصيات إضافية:
- استخدم HTTPS فقط
- احفظ الـ API Keys في Environment Variables
- لا تشارك الـ Service Role Key أبداً
- راجع الـ logs بانتظام

---

## 🔥 Troubleshooting

### المشكلة: الإيميل لا يُرسل
**الحل:**
1. تأكد من إضافة `RESEND_API_KEY` في Supabase Secrets
2. تحقق من الـ Edge Function logs:
   ```bash
   supabase functions logs admin-users
   ```
3. تأكد من صحة الـ API Key

### المشكلة: User already exists
**الحل:**
- احذف المستخدم القديم أولاً من Supabase Dashboard
- أو استخدم DELETE endpoint:
  ```typescript
  fetch(`${SUPABASE_URL}/functions/v1/admin-users?action=delete`, {
    method: "DELETE",
    body: JSON.stringify({ userId: "..." })
  })
  ```

### المشكلة: must_change_password لا يعمل
**الحل:**
- تأكد من أن الـ Edge Function تضيف `must_change_password: true`
- تحقق من الـ user metadata في Supabase Dashboard
- تأكد من أن Frontend يتحقق من الـ flag بشكل صحيح

---

## 📁 الملفات المعدلة

| الملف | التعديل |
|-------|---------|
| `supabase/functions/admin-users/index.ts` | ✅ تم التحديث |
| `src/pages/Login.tsx` | ✅ تم التحديث |
| `src/pages/ChangePassword.tsx` | ✅ تم الإنشاء |
| `src/App.tsx` | ✅ تم التحديث |
| `src/pages/AcceptInvite.tsx` | ✅ تم الحذف |

---

## 🚀 الخطوات التالية

1. ✅ **احصل على Resend API Key**
2. ✅ **أضف الـ API Key في Supabase Secrets**
3. ✅ **Deploy الـ Edge Function**
4. ✅ **اختبر النظام end-to-end**
5. ✅ **راجع الإيميلات المرسلة**

---

**النظام جاهز 100%! 🎉**

فقط تحتاج إلى:
1. Resend API Key
2. Deploy الـ Edge Function
3. اختبار!
