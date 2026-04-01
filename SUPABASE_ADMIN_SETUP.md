# 🔧 إعداد Supabase Auth

## خطوات إنشاء مستخدم Admin

### الطريقة 1: من Supabase Dashboard (موصى بها)

1. **افتح مشروعك في Supabase:**
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   ```

2. **اذهب إلى Authentication:**
   - من القائمة الجانبية → **Authentication**
   - اضغط على **Users**

3. **أضف مستخدم جديد:**
   - اضغط على زر **"Add user"**
   - اختر **"Create new user"**
   
4. **أدخل البيانات:**
   ```
   Email: admin@intlakaa.com
   Password: YourSecurePassword123!
   ```
   
   ✅ تأكد من تفعيل **Auto Confirm User**

5. **احفظ المستخدم:**
   - اضغط **"Create user"**
   - سيظهر المستخدم في القائمة

---

### الطريقة 2: باستخدام SQL (متقدم)

1. **افتح SQL Editor في Supabase**

2. **نفذ هذا الكود:**
   ```sql
   -- إنشاء مستخدم Admin
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     created_at,
     updated_at,
     confirmation_token,
     raw_app_meta_data,
     raw_user_meta_data
   )
   VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'admin@intlakaa.com',
     crypt('YourSecurePassword123!', gen_salt('bf')),
     NOW(),
     NOW(),
     NOW(),
     '',
     '{"provider":"email","providers":["email"]}',
     '{}'
   );
   ```

   ⚠️ **ملاحظة:** غيّر البريد الإلكتروني وكلمة المرور!

---

### الطريقة 3: باستخدام Supabase Admin API (للمطورين)

```javascript
// في ملف منفصل (مثلاً: scripts/create-admin.js)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY' // NOT anon key!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@intlakaa.com',
    password: 'YourSecurePassword123!',
    email_confirm: true
  })

  if (error) {
    console.error('Error creating user:', error)
  } else {
    console.log('User created successfully:', data)
  }
}

createAdminUser()
```

---

## ✅ التحقق من المستخدم

### 1. تحقق من القائمة:
```
Dashboard → Authentication → Users
```
يجب أن ترى المستخدم الجديد في القائمة

### 2. جرّب تسجيل الدخول:
```
http://localhost:5173/admin/login

Email: admin@intlakaa.com
Password: YourSecurePassword123!
```

---

## 🔐 أمان إضافي (اختياري)

### 1. تفعيل Email Confirmation:

في Dashboard → Authentication → Settings:
```
Enable email confirmations: ON
```

⚠️ إذا فعّلت هذا، المستخدم يحتاج تأكيد البريد الإلكتروني أولاً

### 2. تعطيل التسجيل العام:

في Dashboard → Authentication → Settings:
```
Enable Signup: OFF
```

هذا يمنع أي شخص من إنشاء حساب جديد

### 3. إضافة Rate Limiting:

في Dashboard → Authentication → Rate Limits:
```
تحديد عدد محاولات تسجيل الدخول
```

---

## 🧪 اختبار سريع

### Test 1: تسجيل دخول ناجح
```bash
# افتح المشروع
npm run dev

# اذهب إلى
http://localhost:5173/admin/login

# أدخل:
Email: admin@intlakaa.com
Password: YourSecurePassword123!

# النتيجة المتوقعة:
✅ رسالة "تم تسجيل الدخول بنجاح"
✅ توجيه إلى /admin
```

### Test 2: تسجيل دخول فاشل
```bash
# أدخل:
Email: wrong@email.com
Password: wrongpassword

# النتيجة المتوقعة:
❌ رسالة خطأ بالعربية
```

---

## 🔧 استكشاف الأخطاء

### مشكلة: "Invalid login credentials"

**الحل:**
1. تأكد من صحة البريد الإلكتروني وكلمة المرور
2. تحقق من أن المستخدم موجود في Dashboard
3. تأكد من تأكيد البريد الإلكتروني (إذا كان مفعّلاً)

### مشكلة: "Email not confirmed"

**الحل:**
1. اذهب إلى Dashboard → Authentication → Users
2. ابحث عن المستخدم
3. في **Email Confirmed At** يجب أن يكون هناك تاريخ
4. إذا كان فارغاً، اضغط على المستخدم → **Confirm Email**

### مشكلة: "Session expired"

**الحل:**
```javascript
// الجلسات تنتهي بعد 60 دقيقة افتراضياً
// سجّل دخول مرة أخرى
```

---

## 📚 موارد إضافية

### Supabase Auth Documentation:
```
https://supabase.com/docs/guides/auth
```

### إدارة المستخدمين:
```
https://supabase.com/docs/guides/auth/managing-users
```

### Row Level Security:
```
https://supabase.com/docs/guides/auth/row-level-security
```

---

## ✅ قائمة التحقق النهائية

- [ ] مستخدم Admin تم إنشاؤه في Supabase
- [ ] البريد الإلكتروني مؤكد (إذا كان Email Confirmation مفعّل)
- [ ] جرّبت تسجيل الدخول بنجاح
- [ ] التطبيق يعيد التوجيه إلى `/admin` بعد تسجيل الدخول
- [ ] تسجيل الخروج يعمل بشكل صحيح
- [ ] المسارات المحمية تعمل (لا يمكن الوصول بدون تسجيل دخول)

**إذا كانت جميع النقاط محققة، النظام جاهز! 🎉**

---

## 💡 نصائح

### للتطوير:
```javascript
// استخدم بريد إلكتروني سهل التذكر
Email: admin@test.com
Password: admin123
```

### للإنتاج:
```javascript
// استخدم بريد إلكتروني وكلمة مرور قوية
Email: admin@yourdomain.com
Password: StrongPassword!@#$123
```

### كلمات مرور قوية:
- ✅ على الأقل 12 حرف
- ✅ تحتوي على أحرف كبيرة وصغيرة
- ✅ تحتوي على أرقام
- ✅ تحتوي على رموز خاصة
- ✅ لا تستخدم كلمات شائعة

---

**جاهز! الآن يمكنك تسجيل الدخول والبدء في استخدام النظام** 🚀
