# Quick Vercel Environment Variables Setup

## Your Environment Variables (Add These in Vercel):

```
1. Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://ratyazffxlppzurfokxp.supabase.co
   
2. Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdHlhemZmeGxwcHp1cmZva3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzA3NjMsImV4cCI6MjA5MDc0Njc2M30.P5i4fuH3PbcP3MYCX7QWVfnAWlLy-N43OEZ4AMexjTI
   
3. Name: NEXT_PUBLIC_GEMINI_API_KEY
   Value: AIzaSyBBYPWkBSnqeFhyDnlqh2h93pXyMEzx4LA
```

## Steps to Add in Vercel Dashboard:

1. Go to your project: https://vercel.com/mandmautoperformance-6344s-projects/mandmautoperformance
2. Click "Settings" → "Environment Variables"
3. Click "Add Environment Variable"
4. For each variable above:
   - Paste the **Name** in the "Name" field
   - Paste the **Value** in the "Value" field
   - Select "Production" in the Environment dropdown
   - Click "Save"
5. Redeploy or push new code to trigger a rebuild with the new variables

⚠️ **IMPORTANT**: These API keys are now exposed. After you add them to Vercel, please:
- Rotate your Supabase API keys
- Regenerate your Google API key

