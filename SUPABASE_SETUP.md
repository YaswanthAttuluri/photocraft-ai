# 🗄️ Supabase Setup Guide

Follow these steps to set up real user authentication and database for PhotoCraft AI.

## 🚀 **Step 1: Create Supabase Project**

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up/Sign in with GitHub**
4. **Create new project:**
   - Name: `photocraft-ai`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users

## 🗃️ **Step 2: Create Database Tables**

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  credits_remaining INTEGER DEFAULT 50,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create processing history table
CREATE TABLE processing_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  processing_mode TEXT NOT NULL,
  credits_used INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_history ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can read their own processing history
CREATE POLICY "Users can read own processing history" ON processing_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own processing history" ON processing_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, is_admin, credits_remaining, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.email = 'yaswanth.attuluri@gmail.com' THEN TRUE ELSE FALSE END,
    CASE WHEN NEW.email = 'yaswanth.attuluri@gmail.com' THEN 999999 ELSE 50 END,
    CASE WHEN NEW.email = 'yaswanth.attuluri@gmail.com' THEN 'enterprise' ELSE 'free' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 🔑 **Step 3: Get API Keys**

1. **Go to Settings → API**
2. **Copy these values:**
   - Project URL
   - Anon (public) key

## ⚙️ **Step 4: Configure Environment**

Update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_EMAIL=yaswanth.attuluri@gmail.com
```

## 🔐 **Step 5: Configure Authentication**

1. **Go to Authentication → Settings**
2. **Site URL:** Add your domain (e.g., `https://your-app.netlify.app`)
3. **Redirect URLs:** Add your domain
4. **Email Templates:** Customize signup/reset emails (optional)

## ✅ **Step 6: Test Everything**

1. **Start your app:** `npm run dev`
2. **Sign up with a test email**
3. **Check Supabase dashboard:**
   - User appears in Authentication
   - Profile created in users table
   - Credits set to 50

## 🎯 **What This Gives You:**

### **Real User Management:**
- ✅ Actual user signups and logins
- ✅ Email verification (optional)
- ✅ Password reset functionality
- ✅ User profiles and settings

### **Credit System:**
- ✅ 50 free credits for new users
- ✅ Real credit deduction on downloads
- ✅ Processing history tracking
- ✅ Admin gets unlimited credits

### **Database Features:**
- ✅ User data persistence
- ✅ Processing history
- ✅ Subscription management
- ✅ Row-level security

### **Admin Features:**
- ✅ Your email gets admin privileges
- ✅ Unlimited credits
- ✅ Can view all user data (if needed)

## 🚀 **Ready for Production!**

Once set up, your app will have:
- Real user authentication
- Persistent user data
- Credit tracking
- Processing history
- Admin system

**Your PhotoCraft AI is now enterprise-ready!** 🔥