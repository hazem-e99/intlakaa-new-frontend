# Admin Users Edge Function

This Supabase Edge Function handles admin user management operations (list, invite, delete) using the service role key.

## Setup

### 1. Deploy the Edge Function

```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy admin-users
```

### 2. Set Environment Variables

In your Supabase Dashboard:
1. Go to **Edge Functions** → **admin-users**
2. Click on **Settings**
3. Add the following secrets:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (found in Project Settings → API)

Or use CLI:
```bash
supabase secrets set SUPABASE_URL=your-project-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## API Endpoints

### List All Users
```
GET /functions/v1/admin-users?action=list
Authorization: Bearer <user_access_token>
```

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "last_sign_in_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Invite User by Email
```
POST /functions/v1/admin-users?action=invite
Authorization: Bearer <user_access_token>
Content-Type: application/json

{
  "email": "newadmin@example.com",
  "redirectTo": "https://yourdomain.com/admin/login"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "newadmin@example.com"
  }
}
```

### Delete User
```
DELETE /functions/v1/admin-users?action=delete
Authorization: Bearer <user_access_token>
Content-Type: application/json

{
  "userId": "user-uuid-to-delete"
}
```

**Response:**
```json
{
  "success": true
}
```

## Security

- All endpoints require authentication via Bearer token
- The function uses the service role key internally to perform admin operations
- CORS is enabled for all origins (adjust in production if needed)

## Testing Locally

```bash
# Start Supabase locally
supabase start

# Serve the function locally
supabase functions serve admin-users

# Test with curl
curl -i --location --request GET 'http://localhost:54321/functions/v1/admin-users?action=list' \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

## Environment Variables Required

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations

## Notes

- The service role key bypasses Row Level Security (RLS)
- Only use this function for admin operations
- Ensure proper authentication is in place on the client side
- The function automatically handles CORS preflight requests
