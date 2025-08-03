# KindKart - Donation Center Finder

KindKart is a comprehensive web application that helps users find local donation centers, food banks, shelters, and other charitable organizations in their area. Built with Next.js, TypeScript, and PostgreSQL.

## 🌟 Features

- **Location-Based Search**: Find donation centers by address, city, or ZIP code
- **Interactive Map**: View centers on an interactive map with clustering
- **Advanced Filtering**: Filter by category, distance, and operating hours
- **Real-Time Information**: See which centers are currently open
- **Detailed Center Information**: View contact details, accepted items, and special instructions
- **Mobile Responsive**: Optimized for all device sizes
- **Offline Fallback**: Works even when database is unavailable

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Maps**: Leaflet with OpenStreetMap
- **Geocoding**: OpenCage Geocoder API (optional)
- **Deployment**: Vercel-ready

## 📦 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- Git

### One-Command Setup

\`\`\`bash
# Clone, install, and set up everything
git clone <your-repo-url>
cd kindkart
npm run setup
\`\`\`

### Manual Setup

1. **Clone and install**
   \`\`\`bash
   git clone <your-repo-url>
   cd kindkart
   npm install
   \`\`\`

2. **Environment setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL
   \`\`\`

3. **Database setup**
   \`\`\`bash
   npm run db:setup
   \`\`\`

4. **Start development**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🧪 Verification & Testing

### Complete System Verification
\`\`\`bash
# Test everything - database, APIs, business logic, files
npm run verify:complete
\`\`\`

### Quick Health Check
\`\`\`bash
# Fast system status check
npm run health:check
\`\`\`

### Individual Tests
\`\`\`bash
npm run db:test          # Database only
npm run db:verify        # Database setup verification
\`\`\`

## 🗄️ Database Setup

### Using Supabase (Recommended)

1. Create project at [supabase.com](https://supabase.com)
2. Get your DATABASE_URL from Settings > Database
3. Update `.env` file
4. Run `npm run setup`

### Local PostgreSQL

1. Install PostgreSQL
2. Create database
3. Update DATABASE_URL in `.env`
4. Run `npm run setup`

## 🔧 Available Scripts

\`\`\`bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Setup & Database
npm run setup            # Complete setup (install + db)
npm run db:setup         # Database setup only
npm run db:seed          # Seed sample data
npm run db:studio        # Open database GUI
npm run db:reset         # Reset database

# Verification & Testing
npm run verify:complete  # Complete system verification
npm run health:check     # Quick health check
npm run db:test          # Test database connection

# Code Quality
npm run lint             # Run ESLint
npm run build            # Test production build
\`\`\`

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Random secret for sessions | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `OPENCAGE_API_KEY` | Geocoding API key (2,500 free/day) | No |

## 📱 Usage

### Search for Centers
1. Enter location (address, city, ZIP code)
2. Or use "Use My Location" for GPS search
3. View results on map or in list format

### Filter Results
- **Categories**: Food Banks, Clothing, Shelters, etc.
- **Distance**: 1-50 mile radius
- **Hours**: Show only open centers
- **Sort**: Distance, name, category, hours

### View Details
- Click centers for full information
- Get directions via Google Maps
- Call or visit website directly
- View accepted items and instructions

## 🏗️ Project Structure

\`\`\`
kindkart/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── center/[id]/       # Individual center pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── MapView.tsx       # Map component
├── lib/                  # Utility functions
│   ├── prisma.ts         # Database client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and seeds
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data
├── scripts/              # Setup and verification scripts
└── public/               # Static assets
\`\`\`

## ✅ Verification Results

When you run `npm run verify:complete`, you'll see comprehensive test results:

### ✅ Perfect Score (100%)
\`\`\`
🎉 PERFECT! ALL TESTS PASSED!
✅ Your KindKart application is 100% ready for production!

🚀 NEXT STEPS:
1. Run 'npm run dev' to start your application
2. Open http://localhost:3000 in your browser
3. Test search with 'San Francisco, CA'
4. Deploy to production when ready
\`\`\`

### What Gets Tested
- ✅ **Database**: Connection, schema, data integrity
- ✅ **APIs**: All endpoints, response formats, error handling
- ✅ **Business Logic**: Distance calculations, hours parsing, utilities
- ✅ **File Structure**: All required files present
- ✅ **Environment**: Required variables set
- ✅ **Search**: Location search, filtering, data completeness
- ✅ **Performance**: Query speed, response times

## 🚀 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production
\`\`\`env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
OPENCAGE_API_KEY="your-api-key"
\`\`\`

## 🎨 Customization

### Adding Categories
Update `prisma/seed.ts` and run `npm run db:seed`

### Adding Centers
Update the seed file or add via database directly

### Styling
- Modify `app/globals.css` for global styles
- Update `tailwind.config.js` for theme changes
- Customize `components/ui/` for component styles

## 🧪 Testing Checklist

Manual testing checklist:
- [ ] Search by ZIP code (e.g., "94102")
- [ ] Search by city (e.g., "San Francisco, CA")
- [ ] Use current location
- [ ] Filter by categories
- [ ] Adjust distance slider
- [ ] Toggle "Open Now" filter
- [ ] Switch between map and list views
- [ ] Click center markers on map
- [ ] View center details
- [ ] Test mobile responsiveness

## 🔍 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | Get all donation categories |
| `/api/centers` | GET | Search centers by location |
| `/api/centers/[id]` | GET | Get specific center details |
| `/api/geocode` | POST | Convert address to coordinates |

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed**
\`\`\`bash
# Check environment variables
cat .env

# Test connection
npm run db:test

# Reset if needed
npm run db:reset
\`\`\`

**Build Errors**
\`\`\`bash
# Clean rebuild
rm -rf .next node_modules
npm install
npm run build
\`\`\`

**No Search Results**
\`\`\`bash
# Re-seed database
npm run db:seed

# Verify data
npm run db:studio
\`\`\`

### Getting Help
- Run `npm run verify:complete` for comprehensive diagnostics
- Check browser console for frontend errors
- Review database logs in Supabase dashboard
- Ensure all environment variables are set

## 📊 Sample Data

Includes sample donation centers in SF Bay Area:
- 8 categories (Food Banks, Clothing, Shelters, etc.)
- 8+ donation centers with realistic data
- Complete contact information and hours
- Proper category relationships

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Supabase](https://supabase.com/) - Database hosting

---

**Made with ❤️ for the community**

For questions or support, please open an issue on GitHub.
\`\`\`

Finally, let me add the health check script to package.json:
#   K i n d K a r t  
 #   K i n d K a r t  
 