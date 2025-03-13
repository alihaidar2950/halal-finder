# Managing Database Migrations in Supabase for Halal Finder

This guide provides instructions for managing database schema changes in your Supabase project for Halal Finder.

## Current Schema

The current schema includes the following tables:

1. `profiles` - User profile information
2. `favorites` - User's favorite restaurants
3. `reviews` - User reviews for restaurants

## Making Database Changes

### Using the Supabase Web Interface

The simplest way to make database changes is through the Supabase web interface:

1. Go to your Supabase project dashboard
2. Click on "Table Editor" in the left sidebar
3. To create a new table, click "Create a new table"
4. To modify an existing table, select the table and click "Edit"
5. Make your changes in the UI
6. Click "Save" to apply the changes

### Using SQL Editor (Recommended for Complex Changes)

For more complex changes, use the SQL Editor:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Write your SQL commands
5. Click "Run" to execute the SQL

Example SQL for adding a new column:

```sql
ALTER TABLE profiles 
ADD COLUMN phone_number TEXT;
```

## Backing Up Your Schema

It's important to keep your local `schema.sql` file updated with any changes:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Run this SQL to generate the current schema:

```sql
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public'
ORDER BY 
  table_name, 
  ordinal_position;
```

5. Copy the important parts to your local `schema.sql` file
6. Commit the updated `schema.sql` to your repository

## Migrating Data Between Environments

When moving changes between development and production:

1. Develop and test changes in a development environment first
2. Backup your production data before applying changes
3. Apply schema changes to production using the SQL Editor
4. Verify that all data and functionality work correctly

## Adding New Tables

If you need to add new tables to the schema:

1. Create the table using SQL:

```sql
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, restaurant_id, visited_at)
);
```

2. Add appropriate RLS policies:

```sql
-- Enable RLS
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own visits" 
  ON public.visits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own visits" 
  ON public.visits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" 
  ON public.visits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visits" 
  ON public.visits FOR DELETE USING (auth.uid() = user_id);
```

## Managing Row Level Security (RLS)

Always maintain proper RLS policies for security:

1. Make sure every table has RLS enabled:

```sql
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;
```

2. Add appropriate policies for each operation:

```sql
-- SELECT policy
CREATE POLICY "Policy name" 
  ON public.table_name FOR SELECT USING (condition);

-- INSERT policy
CREATE POLICY "Policy name" 
  ON public.table_name FOR INSERT WITH CHECK (condition);

-- UPDATE policy
CREATE POLICY "Policy name" 
  ON public.table_name FOR UPDATE USING (condition);

-- DELETE policy
CREATE POLICY "Policy name" 
  ON public.table_name FOR DELETE USING (condition);
```

## Best Practices

1. **Document changes**: Keep a record of all schema changes
2. **Version control**: Store schema files in your GitHub repository
3. **Test changes**: Test all changes in development before applying to production
4. **Backup data**: Always backup your data before making schema changes
5. **Incremental changes**: Make small, incremental changes rather than large, sweeping ones

---

For more information, refer to the [Supabase documentation](https://supabase.com/docs/guides/database). 