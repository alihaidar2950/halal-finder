# Setting Up Social Authentication in Supabase

This guide will walk you through the process of setting up social authentication (Google, Facebook, GitHub) for your Halal Finder application.

## Prerequisites

- A Supabase project already set up (as per README_SUPABASE.md)
- Appropriate developer accounts for the social providers you want to use

## Step 1: Set Up Google Authentication

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a new project
2. Navigate to "APIs & Services" > "Credentials"
3. Click "Create Credentials" and select "OAuth client ID"
4. Select "Web application" as the application type
5. Add a name for your OAuth client
6. Add the following as authorized redirect URIs:
   - `https://mziarhokvajfkngtytfc.supabase.co/auth/v1/callback`
7. Click "Create" and note down your Client ID and Client Secret

In Supabase:
1. Go to Authentication > Providers
2. Find Google and click "Enable"
3. Enter your Client ID and Client Secret
4. Save changes

## Step 2: Set Up GitHub Authentication

1. Go to your GitHub account settings
2. Click on "Developer settings" > "OAuth Apps" > "New OAuth App"
3. Fill in the following:
   - Application name: "Halal Finder"
   - Homepage URL: Your app's URL (e.g., `https://halal-finder.example.com`)
   - Authorization callback URL: `https://mziarhokvajfkngtytfc.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Generate a new client secret and note down your Client ID and Client Secret

In Supabase:
1. Go to Authentication > Providers
2. Find GitHub and click "Enable"
3. Enter your Client ID and Client Secret
4. Save changes

## Step 3: Set Up Facebook Authentication

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app (choose "Business" type)
3. Once created, navigate to "Settings" > "Basic"
4. Note down your App ID and App Secret
5. Add a platform: Website
6. Under Facebook Login > Settings, add the following as a valid OAuth redirect URI:
   - `https://mziarhokvajfkngtytfc.supabase.co/auth/v1/callback`
7. Save changes

In Supabase:
1. Go to Authentication > Providers
2. Find Facebook and click "Enable"
3. Enter your App ID as the Client ID and App Secret as the Client Secret
4. Save changes

## Step 4: Testing Social Login

1. Start your application
2. Navigate to the sign-in page
3. Click on one of the social provider buttons
4. You should be redirected to the provider's login page
5. After logging in, you should be redirected back to your application

## Troubleshooting

### Redirect URI Issues
- Double-check that you've added the correct redirect URI to your social provider
- The URI should be: `https://mziarhokvajfkngtytfc.supabase.co/auth/v1/callback`

### Permissions Issues
- Some providers require additional permissions to access user information
- For Google, ensure you have the "email" and "profile" scopes
- For Facebook, ensure you have the "email" permission

### Testing in Development
- When testing locally, some providers may not work with localhost URLs
- Consider using a service like ngrok to create a temporary public URL for testing

## Security Considerations

- Never commit your client secrets to version control
- Use environment variables to store sensitive information
- Regularly rotate your client secrets

## Next Steps

After setting up social authentication, you may want to:
1. Customize the user profile creation process
2. Implement additional security measures like MFA
3. Add more social providers as needed 