# Invite Acceptance Flow - Quick Reference

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INVITE FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

1. Admin Dashboard (/admin/manage-admins)
   │
   ├─► Admin enters email and clicks "إرسال الدعوة"
   │
   └─► Edge Function: admin-users?action=invite
       │
       ├─► supabase.auth.admin.inviteUserByEmail(email, {
       │       redirectTo: "https://yoursite.com/admin/accept-invite"
       │   })
       │
       └─► Supabase sends email with invite link
           │
           └─► Email contains:
               https://yoursite.com/admin/accept-invite?
                 access_token=xxx&
                 refresh_token=yyy&
                 type=invite&
                 expires_in=3600

2. User clicks email link
   │
   └─► Lands on /admin/accept-invite
       │
       ├─► AcceptInvite.tsx validates:
       │   ├─ type === "invite" ✓
       │   ├─ access_token exists ✓
       │   └─ refresh_token exists ✓
       │
       ├─► Sets Supabase session with tokens
       │
       └─► Shows password form

3. User sets password
   │
   ├─► Enters new password (min 6 chars)
   ├─► Confirms password
   └─► Clicks "تعيين كلمة المرور"
       │
       └─► supabase.auth.updateUser({ password })
           │
           ├─► Success ✓
           │   ├─ Show success toast
           │   ├─ Sign out user
           │   └─ Redirect to /admin/login
           │
           └─► Error ✗
               └─ Show error toast

4. User logs in
   │
   └─► /admin/login
       │
       ├─► Enter email
       ├─► Enter password (the one just set)
       └─► Click "تسجيل الدخول"
           │
           └─► supabase.auth.signInWithPassword({ email, password })
               │
               └─► Success → Redirect to /admin

┌─────────────────────────────────────────────────────────────────────┐
│                      MAGIC LINK FLOW (Optional)                     │
└─────────────────────────────────────────────────────────────────────┘

1. User receives magic link (not invite)
   │
   └─► Link: https://yoursite.com/admin/login?
       access_token=xxx&
       refresh_token=yyy&
       type=magiclink  (NOT "invite")

2. User clicks link
   │
   └─► Lands on /admin/login
       │
       ├─► Login.tsx detects tokens
       ├─► Checks: type !== "invite" ✓
       ├─► Calls: supabase.auth.setSession({ access_token, refresh_token })
       └─► Redirects to /admin (automatic login)

┌─────────────────────────────────────────────────────────────────────┐
│                         ERROR SCENARIOS                             │
└─────────────────────────────────────────────────────────────────────┘

Scenario 1: Invalid Invite Link
   User clicks expired/invalid invite link
   └─► /admin/accept-invite?type=invite&access_token=expired
       └─► Shows error page: "رابط الدعوة غير صالح أو منتهي الصلاحية"
           └─► Button: "العودة إلى تسجيل الدخول"

Scenario 2: Wrong Type
   User tries to access accept-invite without type=invite
   └─► /admin/accept-invite?type=magiclink
       └─► Shows error page: "رابط غير صالح"

Scenario 3: Missing Tokens
   User tries to access accept-invite directly
   └─► /admin/accept-invite
       └─► Shows error page: "رابط غير صالح"

Scenario 4: Password Mismatch
   User enters different passwords
   └─► Shows toast: "كلمات المرور غير متطابقة"

Scenario 5: Weak Password
   User enters password < 6 characters
   └─► Shows toast: "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
```

## Key Files and Their Roles

| File | Role | Changes Made |
|------|------|--------------|
| `AcceptInvite.tsx` | New invite acceptance page | ✅ CREATED |
| `Login.tsx` | Enhanced to handle magic links | ✅ MODIFIED |
| `ManageAdmins.tsx` | Changed redirectTo URL | ✅ MODIFIED |
| `App.tsx` | Added new route | ✅ MODIFIED |
| `admin-users/index.ts` | Edge Function (unchanged) | ⚪ NO CHANGE |

## URL Parameters Reference

### Invite Link Parameters
```
/admin/accept-invite?
  access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  &refresh_token=v1.MRjVsuUn-AFZVXx-AgJPHA...
  &type=invite
  &expires_in=3600
```

### Magic Link Parameters
```
/admin/login?
  access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  &refresh_token=v1.MRjVsuUn-AFZVXx-AgJPHA...
  &type=magiclink
  &expires_in=3600
```

## Testing Commands

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to admin
http://localhost:5173/admin/login

# 3. Login as admin

# 4. Go to manage admins
http://localhost:5173/admin/manage-admins

# 5. Send invite to test email

# 6. Check email and click invite link

# 7. Should land on:
http://localhost:5173/admin/accept-invite?access_token=...&type=invite

# 8. Set password and verify redirect to login
```

## Environment Variables

```env
# Required in .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_URL=http://localhost:5173  # or production URL
```

## Success Criteria

✅ Invite email contains link to `/admin/accept-invite`
✅ Accept-invite page validates tokens correctly
✅ Password form appears for valid invites
✅ Password update succeeds
✅ User is redirected to login after password setup
✅ User can login with new password
✅ Invalid/expired links show error page
✅ Magic links (if used) still work via login page
✅ No 404 errors on any route
✅ All pages styled consistently
✅ Arabic RTL support throughout
