# Immigration Crisis Guidance Platform

A comprehensive web application that provides immediate guidance and resources for immigrants, families, government workers, and visa holders facing crisis situations.

## Features

- **Multi-Language Support**: Available in 10 languages (English, Spanish, Chinese, French, Arabic, Russian, Portuguese, Hindi, Korean, Vietnamese)
- **Text-to-Speech**: Voice guidance in multiple languages for accessibility
- **AI-Powered Search**: Natural language queries to find relevant help
- **Step-by-Step Guidance**: Clear, actionable instructions for crisis situations
- **Emergency Resources**: Verified organizations with contact information
- **Crisis Scenarios Covered**:
  - ICE Detention
  - Visa Issues
  - Government Shutdown
  - Deportation Proceedings
  - Work Authorization
  - Asylum Applications

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Cloudflare Workers AI (Llama 3.1 8B)
- **Admin Dashboard**: Streamlit (Python)
- **Icons**: Lucide React
- **Speech**: Web Speech API

## Hackathon Technologies

This project was built for **HackUMBC** and integrates:

1. **Streamlit** - Beautiful Python admin dashboard for managing scenarios and viewing analytics
2. **Cloudflare Workers AI** - Real LLM-powered crisis detection using Llama 3.1 8B model

See [HACKATHON_SETUP.md](./HACKATHON_SETUP.md) for detailed setup instructions and integration details.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/immigration-crisis-guidance.git
cd immigration-crisis-guidance
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:

The migrations are located in `supabase/migrations/`. Apply them through your Supabase dashboard or CLI.

5. Start the development server:
```bash
npm run dev
```

## Database Setup

The application uses Supabase for data storage. The database schema includes:

- `crisis_scenarios`: Different crisis situations
- `guidance_steps`: Step-by-step instructions for each scenario
- `resources`: Emergency contacts and helpful organizations
- `faqs`: Frequently asked questions
- `translations`: Multi-language content support

All tables have Row Level Security (RLS) enabled with public read access.

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Add environment variables in the deployment platform
4. Deploy!

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Important Resources

- [USCIS Official Website](https://www.uscis.gov/)
- [ICE Detainee Locator](https://locator.ice.gov/)
- [Immigration Advocates Network](https://www.immigrationadvocates.org/)
- [ACLU Immigrants Rights](https://www.aclu.org/issues/immigrants-rights)

## License

MIT License

## Disclaimer

This application provides general guidance and information. It is not a substitute for legal advice. Always consult with a qualified immigration attorney for your specific situation.

## Support

For issues or questions, please open an issue on GitHub.
