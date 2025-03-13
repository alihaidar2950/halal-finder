# Setting Up Supabase Authentication for Halal Finder

This guide will walk you through how to properly set up Supabase authentication for the Halal Finder application.

## Prerequisites

- A Supabase account (free tier is fine)
- The Halal Finder Next.js application

## Step 1: Create a New Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project and give it a name (e.g., "Halal Finder")
3. Choose a region closest to your target audience
4. Set a secure database password (save this somewhere safe)
5. Wait for your project to be created

## Step 2: Get Your API Credentials

1. Once your project is ready, go to Project Settings > API
2. You'll need these two values:
   - **Project URL** (e.g., `https://mziarhokvajfkngtytfc.supabase.co`)
   - **anon public** key (starting with "eyJ...")
3. Add these values to your `.env.local` file in your Next.js app:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 3: Set Up the Database Schema

1. In Supabase, go to the SQL Editor
2. Create a new query
3. Copy and paste the entire contents of the `schema.sql` file from this project
4. Run the query to create all necessary tables and security policies

## Step 4: Configure Authentication Providers

### Email Authentication (Default)

1. Go to Authentication > Providers
2. Email auth is enabled by default
3. You can customize the email templates under "Email Templates"

### Social Login Providers

To enable social login (Google, GitHub, Facebook):

1. Go to Authentication > Providers
2. Select the providers you want to enable
3. Configure each with the appropriate Client ID and Client Secret
4. Detailed instructions for each provider can be found in the `SOCIAL_AUTH_SETUP.md` file

## Step 5: Configure User Management

1. Go to Authentication > Users to manage users
2. You can:
   - View all registered users
   - Delete users if needed
   - Manage user roles

## Step 6: Test Authentication

1. Start your Next.js application
2. Navigate to the sign-up page
3. Create a test account (or use social login)
4. Verify that you can sign in, view your profile, and log out

## Understanding the Authentication Flow

1. **Sign Up**: When a user signs up, Supabase creates a user in the `auth.users` table and sends a confirmation email
2. **Profile Creation**: A trigger automatically creates a profile in the `profiles` table
3. **Sign In**: When a user signs in, we create a session and store it in localStorage
4. **Protected Routes**: Routes are protected by middleware, redirecting unauthenticated users to the sign-in page
5. **Social Login**: Users can authenticate with Google, GitHub, or Facebook without creating a password

## Authentication Features

### Protected Routes

The application includes middleware that:
- Automatically redirects unauthenticated users to the sign-in page
- Preserves the original destination URL to redirect back after sign-in
- Allows public access to specified pages (home, sign-in, sign-up, about)

### Social Authentication

The application supports:
- Google authentication
- GitHub authentication
- Facebook authentication
- Seamless profile creation after social sign-in

## Database Tables

The schema creates three main tables:

- **profiles**: Stores user profile information
- **favorites**: Stores user's favorite restaurants
- **reviews**: Stores user reviews for restaurants

## Row Level Security (RLS)

Security policies are set up to ensure:

- Users can only see and modify their own profiles
- Users can only see and modify their own favorites
- Reviews are visible to everyone, but users can only modify their own reviews

## Troubleshooting

- **Email Confirmation Issues**: Check Supabase auth settings and confirm the email templates are set up correctly
- **Database Errors**: Check the SQL console logs for any errors
- **RLS Issues**: Verify the policies are correctly applied by testing different user accounts
- **Social Login Problems**: See the detailed troubleshooting section in `SOCIAL_AUTH_SETUP.md`

For more help, refer to the [Supabase documentation](https://supabase.com/docs). 