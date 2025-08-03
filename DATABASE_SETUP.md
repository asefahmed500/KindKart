# Database Setup Guide

## Step 1: Set up Supabase Database

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-setup.sql` into the SQL editor
4. Click "Run" to execute the script

This will create:
- `categories` table with donation center categories
- `donation_centers` table with location and contact information
- `center_categories` junction table linking centers to categories
- Sample data for testing

## Step 2: Verify Database Connection

Your database URL is already configured in `.env.local`:
```
DATABASE_URL=postgresql://postgres:FzYIcEutlCUYnzzg@db.jyhommgcwshroilavdmj.supabase.co:5432/postgres
```

## Step 3: Install Dependencies and Run

Once the database is set up, you can:

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

If you encounter permission issues with npm:
1. Try using `--legacy-peer-deps` flag
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`, then reinstall

## Database Schema

The database includes these main tables:

### Categories
- Food Banks 🍞
- Clothing Donations 👕  
- Homeless Shelters 🏠
- Medical Supplies 🏥
- Electronics Recycling 💻
- Book Donations 📚
- Toy Donations 🧸
- Animal Shelters 🐕

### Sample Donation Centers
- Central Food Bank (San Francisco)
- Goodwill Donation Center (San Francisco)
- St. Mary's Homeless Shelter (San Francisco)
- Bay Area Medical Supply Donations (Oakland)
- Berkeley Electronics Recycling (Berkeley)
- San Jose Book Exchange (San Jose)

Each center includes:
- Contact information (phone, email, website)
- Operating hours
- Accepted items
- Geographic coordinates for mapping
- Category associations