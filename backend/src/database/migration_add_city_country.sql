-- Migration: Add city and country columns to search_history table
-- Run this if you already have the search_history table without city/country columns

-- Add city column if it doesn't exist
ALTER TABLE search_history
ADD COLUMN IF NOT EXISTS city VARCHAR(255);

-- Add country column if it doesn't exist
ALTER TABLE search_history
ADD COLUMN IF NOT EXISTS country VARCHAR(255);

