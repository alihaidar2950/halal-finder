# Setting up Google Authentication for Halal Finder

This guide walks you through configuring Google OAuth for your Halal Finder application.

## 1. Create a Google OAuth Client

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: "Halal Finder"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue

6. Create OAuth client ID:
   - Application type: Web application
   - Name: "Halal Finder Web Client"
   - Authorized JavaScript origins: 
     - Add your production URL (e.g., `https://your-app-domain.com`)
     - Add your local development URL (e.g., `http://localhost:3000`)
   - Authorized redirect URIs:
     - Add `https://your-app-domain.com/auth/callback`
     - Add `http://localhost:3000/auth/callback` 
     - Add your Supabase URL: `https://<your-project-reference>.supabase.co/auth/v1/callback`

7. Click "Create"
8. Note down the generated Client ID and Client Secret

## 2. Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to "Authentication" > "Providers"
4. Find "Google" in the list and click "Edit"
5. Enable the provider by toggling the switch
6. Enter the Client ID and Client Secret from the previous step
7. Set the Authorized redirect URI to `https://<your-project-reference>.supabase.co/auth/v1/callback`
8. Click "Save"

## 3. Test the Authentication Flow

1. Start your local development server (`npm run dev`)
2. Navigate to your sign-in page
3. Click "Continue with Google"
4. You should be redirected to Google's authentication page
5. After authentication, you should be redirected back to your application

## Troubleshooting

### Callback URL Issues

If you're getting redirect errors:
- Ensure your redirect URIs exactly match what's configured in the Google Cloud Console
- Check that you've added both the Supabase callback URL and your application callback URL

### CORS Issues

If you see CORS errors:
- Ensure your application domain is added to the Authorized JavaScript origins

### API Credentials Not Working

If authentication fails:
- Double-check that you've copied the correct Client ID and Client Secret
- Ensure the API is enabled in the Google Cloud Console
- Check that you haven't hit any API quotas or limits

### Local Development Testing

For local development:
- Ensure `http://localhost:3000` is added to both the Authorized JavaScript origins and redirect URIs
- Use `http://localhost:3000/auth/callback` as the callback URL in your application

## Security Considerations

- Never commit your Google Client Secret to your repository
- Use environment variables for sensitive credentials
- Regularly review the OAuth consent screen and permissions 