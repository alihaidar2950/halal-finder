# Deploying Halal Finder to Vercel

This guide will walk you through the process of deploying your Halal Finder application to Vercel, from initial setup to having your site live on the internet.

## Prerequisites

✓ GitHub repository with your Halal Finder code
✓ Supabase project already set up with your database schema
✓ Google Maps API keys (for both client and server)
✓ A successful local build (`npm run build` completes without errors)

## Step 1: Prepare Your Repository

Make sure your latest code is committed to GitHub:

```bash
git add .
git commit -m "Prepare for deployment"
git push
```

## Step 2: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Complete the sign-up process

## Step 3: Import Your Project

1. From the Vercel dashboard, click "Add New..." > "Project"
2. Find and select your `halal-finder` repository from the list
3. Vercel will automatically detect that it's a Next.js project
4. Click "Import"

## Step 4: Configure the Deployment

On the "Configure Project" page:

1. **Project Name**: Keep the default or customize it
   - This will determine your project URL: `project-name.vercel.app`

2. **Framework Preset**: Should be automatically set to Next.js

3. **Root Directory**: Leave as `.` (default)

4. **Environment Variables**: Add all required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL             [Your Supabase URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY        [Your Supabase anon key]
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY      [Your Google Maps API key]
   GOOGLE_MAPS_API_KEY                  [Your Google Maps API key]
   ```

5. Click **Deploy**

## Step 5: Watch the Deployment

1. Vercel will now build and deploy your application
2. You can watch the progress in real-time in the Vercel dashboard
3. Wait for the "Congratulations!" message indicating a successful deployment
4. Click on the deployment URL (e.g., `halal-finder.vercel.app`) to view your live site

## Step 6: Configure Supabase for Production

Now that your site is live, you need to update your Supabase configuration:

1. Go to your Supabase dashboard > Project Settings > API
2. In the "URL Configuration" section, add your Vercel domain as a trusted domain:
   ```
   https://halal-finder.vercel.app
   ```

3. In "Authentication" > "URL Configuration", set:
   - Site URL: `https://halal-finder.vercel.app`
   - Add to Redirect URLs: `https://halal-finder.vercel.app/auth/callback`

4. Save the changes

## Step 7: Configure Social Auth Providers (If Using)

For each social auth provider you're using, update the callback URLs:

### Google:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your project > Credentials > OAuth 2.0 Client IDs
3. Add to Authorized redirect URIs:
   ```
   https://[your-supabase-project].supabase.co/auth/v1/callback
   ```

### GitHub:
1. Go to GitHub > Settings > Developer settings > OAuth Apps
2. Update the Authorization callback URL:
   ```
   https://[your-supabase-project].supabase.co/auth/v1/callback
   ```

### Facebook:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Navigate to your app > Facebook Login > Settings
3. Add to Valid OAuth Redirect URIs:
   ```
   https://[your-supabase-project].supabase.co/auth/v1/callback
   ```

## Step 8: Test Your Deployed Application

Thoroughly test your deployed application:

1. Open your Vercel URL (`https://halal-finder.vercel.app`)
2. Test user authentication (sign up and sign in)
3. Test social login if you've configured it
4. Test searching for restaurants
5. Test viewing restaurant details
6. Test saving favorites (requires authentication)

## Step 9: Configure a Custom Domain (Optional)

If you want to use your own domain instead of `halal-finder.vercel.app`:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" > "Domains"
3. Enter your domain name (e.g., `halalfinder.com`)
4. Follow Vercel's instructions to configure your DNS settings
5. Once verified, update your Supabase settings with the new domain

## Step 10: Set Up Continuous Deployment

Vercel automatically sets up continuous deployment for your project:

1. When you push changes to your GitHub repository's main branch, Vercel automatically deploys them
2. For pull requests, Vercel creates preview deployments so you can test changes before merging

## Step 11: Monitor Your Application

1. Go to the Vercel dashboard > your project
2. Click on "Analytics" to view traffic stats
3. Click on "Logs" to see runtime logs and debug issues

## Troubleshooting Common Issues

### Authentication Redirect Issues:
- Check that your Supabase redirect URLs are correctly set
- Verify the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables

### API Errors:
- Check your Google Maps API key restrictions
- Verify that the `GOOGLE_MAPS_API_KEY` is set correctly in Vercel

### Build Failures:
- Check the build logs in Vercel for specific errors
- Make sure your local build works before pushing to GitHub

### CORS Issues:
- Add your Vercel domain to the allowed origins in Supabase settings

## Next Steps

After successful deployment, consider:

1. Setting up error monitoring with Sentry
2. Implementing analytics with Google Analytics or Vercel Analytics
3. Setting up a CI/CD pipeline with automated testing
4. Adding performance monitoring

---

Congratulations! Your Halal Finder application is now live on the internet, accessible to users worldwide. 