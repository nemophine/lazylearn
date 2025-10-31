# Google OAuth Setup for LazyLearn

Follow these steps to set up Google OAuth authentication for your LazyLearn application.

## 🚀 Quick Setup

### 1. Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application** as the application type
6. Add these **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`

### 2. Get Your Credentials

After creating the OAuth client, you'll get:
- **Client ID** (e.g., `123456789-abcdef.apps.googleusercontent.com`)
- **Client Secret** (e.g., `GOCSPX-abcdef123456`)

### 3. Update Environment Variables

Edit your `.env.local` file and replace the placeholder values:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-actual-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret-here"
```

### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 🔧 Configuration Details

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth Client ID | `123456789-abcdef.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth Client Secret | `GOCSPX-abcdef123456` |
| `NEXTAUTH_URL` | ✅ | Your application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | ✅ | NextAuth secret key | `CEC1yVApnCay/ipCBvgkJcw9io1uxieVYje2nCukPbQ=` |

### Google Cloud Console Settings

1. **OAuth consent screen**:
   - Application type: **External**
   - App name: `LazyLearn`
   - User support email: Your email
   - Developer contact: Your email

2. **Scopes** (required for user info):
   - `email` - View email address
   - `profile` - View basic profile information
   - `openid` - OpenID Connect

3. **Test users** (if using External app type):
   - Add your Google email as a test user during development

## 🧪 Testing the Setup

1. **Start the app**: `npm run dev`
2. **Navigate to**: `http://localhost:3000`
3. **Click** "Sign In" or "Sign Up" button
4. **Click** "Continue with Google"
5. **Sign in** with your Google account
6. **Approve** the permissions
7. **You should be redirected** to your profile page

## 🔍 Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Make sure `http://localhost:3000/api/auth/callback/google` is added to your Google OAuth app's authorized redirect URIs

2. **"invalid_client" error**
   - Check that your Client ID and Client Secret are correct in `.env.local`
   - Make sure there are no extra spaces or quotes

3. **"access_denied" error**
   - If using External app type, make sure your Google email is added as a test user
   - Check that all required scopes are approved

4. **NextAuth session not working**
   - Restart the development server after updating environment variables
   - Check browser console for any JavaScript errors

### Debug Mode

Add this to your `.env.local` to enable NextAuth debug logging:

```env
NEXTAUTH_DEBUG=true
```

## 📝 Next Steps

Once Google OAuth is working:

1. ✅ **Users can sign in with Google**
2. ✅ **User data is stored in SQLite database**
3. ✅ **Sessions are managed securely**
4. ✅ **Profile shows real user information**

## 🛡️ Security Notes

- **Never commit** `.env.local` to version control
- **Use environment variables** for all sensitive data
- **In production**, use HTTPS URLs for `NEXTAUTH_URL`
- **Regularly rotate** your client secret if needed

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console Help](https://cloud.google.com/docs/authentication)