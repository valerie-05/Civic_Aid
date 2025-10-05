# HackUMBC Hackathon Integration Guide

This project integrates **TWO** hackathon sponsor technologies:

## 1. Streamlit - Admin Dashboard

### What It Does
A beautiful Python web app for managing the crisis guidance system, viewing analytics, and monitoring AI performance.

### Features
- **Real-time Analytics**: View chat sessions, message counts, language distribution
- **Scenario Management**: Add, edit, and delete crisis scenarios
- **Resource Management**: Manage emergency contacts and resources
- **AI Performance Metrics**: Track scenario match rates and AI effectiveness
- **User-Friendly Interface**: Built with Streamlit's intuitive widgets and visualizations

### Setup Instructions

1. **Navigate to the Streamlit app directory:**
   ```bash
   cd streamlit_app
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Copy your Supabase credentials from the main `.env` file:
   ```bash
   export VITE_SUPABASE_URL="your_supabase_url"
   export VITE_SUPABASE_ANON_KEY="your_anon_key"
   ```

4. **Run the Streamlit app:**
   ```bash
   streamlit run app.py
   ```

5. **Access the dashboard:**
   Open your browser to `http://localhost:8501`

### Deployment
Deploy for free to **Streamlit Community Cloud**:
1. Push your code to GitHub
2. Go to https://share.streamlit.io
3. Connect your repository
4. Add environment variables in settings
5. Deploy!

---

## 2. Cloudflare Workers AI - Intelligent Crisis Detection

### What It Does
Powers the AI assistant with **real LLM capabilities** using Cloudflare's Workers AI platform and the Llama 3.1 8B model.

### Features
- **Natural Language Understanding**: Uses Llama 3.1 to understand crisis queries in natural language
- **Smart Category Detection**: AI determines which crisis scenario matches the user's situation
- **Empathetic Responses**: Generates compassionate, context-aware messages
- **Fallback System**: If Cloudflare AI is unavailable, falls back to keyword matching
- **Edge Computing**: Runs on Cloudflare's global network for low latency

### How It Works
The edge function at `supabase/functions/ai-guidance/index.ts`:
1. Receives user query
2. Calls Cloudflare Workers AI API with context about available scenarios
3. AI analyzes the query and returns matched category + empathetic message
4. System retrieves relevant guidance steps and emergency resources
5. Returns comprehensive response to the user

### Setup Instructions

1. **Create a Cloudflare account:**
   - Go to https://dash.cloudflare.com/sign-up
   - Free tier includes 10,000 AI requests per day!

2. **Get your credentials:**
   - Navigate to "Workers & Pages" in the Cloudflare dashboard
   - Go to "AI" section
   - Copy your Account ID
   - Create an API token with "Workers AI" permissions

3. **Configure the edge function:**
   You need to set these environment variables in Supabase:

   ```bash
   CLOUDFLARE_ACCOUNT_ID=your_account_id_here
   CLOUDFLARE_API_TOKEN=your_api_token_here
   ```

   **Note:** These are already configured automatically in the Supabase environment. The edge function will work without manual configuration.

4. **Deploy the updated edge function:**
   The edge function is automatically deployed. It will:
   - Try to use Cloudflare AI first
   - Fall back to keyword matching if Cloudflare is not configured
   - Always provide a response to users

### Testing the AI

Try these queries in the AI assistant:
- "My father was just detained by immigration officers, what should I do?"
- "I'm a federal employee affected by the government shutdown"
- "My visa is about to expire and I don't know what to do"
- "I need help applying for asylum"

The AI will:
1. Understand the context and emotional situation
2. Match it to the appropriate crisis category
3. Provide empathetic guidance
4. Show urgent steps and emergency contacts

---

## Architecture Overview

```
User Query
    ↓
AI Assistant (React Component)
    ↓
Supabase Edge Function (ai-guidance)
    ↓
Cloudflare Workers AI (Llama 3.1 8B) ← AI-powered understanding
    ↓
Supabase Database ← Store scenarios, steps, resources
    ↓
Response with guidance + emergency contacts
```

Admin manages everything through:
```
Streamlit Dashboard
    ↓
Supabase Database (same data)
    ↓
View analytics, manage scenarios, monitor AI performance
```

---

## Why These Technologies?

### Streamlit
- **Easy to build**: 25 lines of code for a full web app
- **Beautiful UI**: Professional widgets without CSS
- **Perfect for demos**: Quick to build, impressive to show
- **Free deployment**: Streamlit Community Cloud

### Cloudflare Workers AI
- **Real AI**: Llama 3.1 8B model for natural language understanding
- **Global Edge Network**: Low latency worldwide
- **Generous free tier**: 10,000 requests/day
- **Simple API**: Easy to integrate with edge functions

---

## Hackathon Submission Checklist

- [x] Streamlit admin dashboard with multiple pages
- [x] Real-time analytics and data visualizations
- [x] Cloudflare Workers AI integration with Llama 3.1
- [x] Fallback system for reliability
- [x] Chat history with persistent storage
- [x] Multi-language support
- [x] Text-to-speech functionality
- [x] Production-ready with error handling

---

## Demo Tips

1. **Show the user flow:**
   - User asks a crisis question
   - AI understands and responds empathetically
   - System provides step-by-step guidance

2. **Show the admin dashboard:**
   - Open Streamlit dashboard
   - Show real-time analytics
   - Add a new scenario or resource
   - Monitor AI performance metrics

3. **Highlight the AI:**
   - Show how natural language queries work
   - Compare AI responses to keyword matching
   - Show the fallback system reliability

4. **Show the data:**
   - Chat history persistence
   - Multiple language support
   - Emergency resources and contacts

---

## Resources

- **Streamlit Docs**: https://docs.streamlit.io
- **Cloudflare Workers AI**: https://developers.cloudflare.com/workers-ai/
- **Llama 3.1 Model**: https://ai.meta.com/llama/
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions

---

## Questions?

Both technologies have excellent documentation and active communities. Good luck with your hackathon submission!
