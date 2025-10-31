# LINE OAuth Setup for LazyLearn

Follow these steps to set up LINE Login authentication for your LazyLearn application.

## 🚀 Quick Setup

### 1. Create LINE Login Channel

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Sign in with your LINE account
3. Create a new provider or select an existing one
4. Create a new **LINE Login** channel:
   - **Channel type**: Web app
   - **Channel name**: LazyLearn (or your preferred name)
   - **Channel description**: Learning platform with LINE authentication
   - **Email**: Your email address

### 2. Configure LINE Login Settings

1. Go to your **LINE Login** channel settings
2. **App settings** tab:
   - Set **Callback URL** to: `http://localhost:3000/api/auth/callback/line`
   - **Email permission**: Enable if you want user emails (requires email verification)
3. **Login** tab:
   - Enable **Web login**
   - Set **Login button design** or use custom button (we have custom buttons)

### 3. Get Your Credentials

From your LINE Login channel, get:
- **Channel ID** (e.g., `1234567890`)
- **Channel Secret** (e.g., `abcdef1234567890abcdef1234567890`)

### 4. Update Environment Variables

Edit your `.env.local` file and replace the placeholder values:

```env
# LINE OAuth
LINE_CLIENT_ID="your-actual-line-channel-id-here"
LINE_CLIENT_SECRET="your-actual-line-channel-secret-here"
```

### 5. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 🔧 Configuration Details

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `LINE_CLIENT_ID` | ✅ | LINE Login Channel ID | `1234567890` |
| `LINE_CLIENT_SECRET` | ✅ | LINE Login Channel Secret | `abcdef1234567890abcdef1234567890` |

### LINE Developers Console Settings

1. **Channel Information**:
   - **Channel type**: Web app
   - **Provider**: Your LINE provider
   - **Email**: Your support email

2. **App Settings**:
   - **Callback URL**: `http://localhost:3000/api/auth/callback/line`
   - For production: `https://yourdomain.com/api/auth/callback/line`

3. **Login Settings**:
   - **Web login**: Enabled
   - **Bot link feature**: Optional (for LINE bot integration)
   - **Auto login**: Disabled (recommended for web apps)

## 🧪 Testing the Setup

1. **Start the app**: `npm run dev`
2. **Navigate to**: `http://localhost:3000`
3. **Click** "Sign In" or "Sign Up" button
4. **Click** "Continue with LINE"
5. **Sign in** with your LINE account
6. **Approve** the permissions
7. **You should be redirected** to your profile page

## 🔍 Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Make sure `http://localhost:3000/api/auth/callback/line` is exactly added to your LINE channel's callback URLs
   - Check for trailing slashes or protocol differences

2. **"invalid_client" error**
   - Verify your Channel ID and Channel Secret are correct in `.env.local`
   - Make sure there are no extra spaces or quotes

3. **"unauthorized_client" error**
   - Ensure the channel type is set to "Web app"
   - Check that web login is enabled in your LINE Login settings

4. **"access_denied" error**
   - User denied the permissions (this is normal if user cancels)
   - Check that the correct scopes are configured

5. **LINE Login button not working**
   - Check browser console for JavaScript errors
   - Verify NextAuth is loading properly

### LINE Login Callback URL

The callback URL must be exactly:
- **Development**: `http://localhost:3000/api/auth/callback/line`
- **Production**: `https://yourdomain.com/api/auth/callback/line`

### Scopes and Permissions

The application requests these scopes:
- `profile` - User's display name and profile image
- `openid` - OpenID Connect for user identification
- `email` - User's email address (if enabled in LINE console)

## 📱 LINE Login Features

### What You Get from LINE Login
- **User ID**: Unique identifier for the user
- **Display Name**: User's LINE display name
- **Profile Picture**: User's LINE profile image URL
- **Status Message**: User's LINE status message (optional)
- **Email**: User's email (if email permission is granted)

### Benefits of LINE Login
- ✅ **No password required** for users
- ✅ **Secure authentication** via LINE's trusted platform
- ✅ **Access to 200M+ LINE users** especially in Asia
- ✅ **Built-in security** and fraud protection
- ✅ **Mobile-friendly** login experience

## 🌏 Regional Considerations

LINE Login is particularly popular in:
- 🇯🇵 Japan
- 🇹🇭 Thailand
- 🇹🇼 Taiwan
- 🇮🇩 Indonesia

## 📝 Next Steps

Once LINE OAuth is working alongside Google OAuth:

1. ✅ **Users can choose** between Google and LINE authentication
2. ✅ **Multiple login options** increase user conversion
3. ✅ **Unified user experience** regardless of login method
4. ✅ **Same profile functionality** for all authentication methods

## 🛡️ Security Notes

- **Never commit** `.env.local` to version control
- **Use environment variables** for all LINE credentials
- **In production**, use HTTPS URLs for all callbacks
- **Monitor LINE's rate limits** for your application
- **Keep your channel secret** secure and rotate if needed

## 📚 Additional Resources

- [LINE Login Documentation](https://developers.line.biz/en/docs/line-login/)
- [LINE Developers Console](https://developers.line.biz/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [LINE Login Web Integration Guide](https://developers.line.biz/en/docs/line-login/web/integrate-line-login/)

## 🆘 Support

If you encounter issues:

1. Check the [LINE Developers FAQ](https://developers.line.biz/en/faq/)
2. Review the browser console for error messages
3. Verify all environment variables are set correctly
4. Ensure callback URLs match exactly between LINE console and your app