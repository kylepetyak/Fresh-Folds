-- Fresh Folds Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE plan_type AS ENUM ('small', 'medium', 'large');
CREATE TYPE frequency AS ENUM ('biweekly', 'weekly', 'twice_weekly');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled');
CREATE TYPE pickup_status AS ENUM ('scheduled', 'skipped', 'picked_up', 'washing', 'ready', 'out_for_delivery', 'delivered', 'no_bags');
CREATE TYPE provider_status AS ENUM ('pending', 'approved', 'rejected', 'active', 'deactivated');
CREATE TYPE background_check_status AS ENUM ('pending', 'passed', 'failed');
CREATE TYPE ticket_type AS ENUM ('customer', 'provider');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved');
CREATE TYPE claim_status AS ENUM ('reported', 'reviewing', 'resolved');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'sent', 'failed');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  address_street TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type plan_type NOT NULL,
  frequency frequency NOT NULL,
  pickup_day_1 day_of_week NOT NULL,
  pickup_day_2 day_of_week,
  pickup_window_start TIME NOT NULL,
  pickup_window_end TIME NOT NULL,
  bag_count INTEGER NOT NULL,
  status subscription_status DEFAULT 'active',
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paused_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Providers table
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status provider_status DEFAULT 'pending',
  vehicle_photo_url TEXT,
  washer_photo_url TEXT,
  dryer_photo_url TEXT,
  hours_per_week INTEGER,
  interest_statement TEXT,
  background_check_status background_check_status,
  background_check_id TEXT,
  stripe_connect_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

-- Pickups table
CREATE TABLE pickups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id),
  scheduled_date DATE NOT NULL,
  scheduled_window_start TIME NOT NULL,
  scheduled_window_end TIME NOT NULL,
  status pickup_status DEFAULT 'scheduled',
  pickup_photo_url TEXT,
  delivery_photo_url TEXT,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Provider availability table
CREATE TABLE provider_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

-- Provider zones table
CREATE TABLE provider_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  zip_code TEXT NOT NULL
);

-- Service zones table
CREATE TABLE service_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zip_code TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist table
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type ticket_type NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status ticket_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Damage claims table
CREATE TABLE damage_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pickup_id UUID NOT NULL REFERENCES pickups(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id),
  provider_id UUID NOT NULL REFERENCES users(id),
  description TEXT NOT NULL,
  photo_urls TEXT[],
  status claim_status DEFAULT 'reported',
  resolution TEXT,
  provider_deduction DECIMAL(10, 2),
  customer_credit DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Payouts table
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status payout_status DEFAULT 'pending',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_pickups_subscription_id ON pickups(subscription_id);
CREATE INDEX idx_pickups_provider_id ON pickups(provider_id);
CREATE INDEX idx_pickups_scheduled_date ON pickups(scheduled_date);
CREATE INDEX idx_pickups_status ON pickups(status);
CREATE INDEX idx_providers_user_id ON providers(user_id);
CREATE INDEX idx_providers_status ON providers(status);
CREATE INDEX idx_provider_zones_zip_code ON provider_zones(zip_code);
CREATE INDEX idx_service_zones_zip_code ON service_zones(zip_code);
CREATE INDEX idx_service_zones_active ON service_zones(active);
CREATE INDEX idx_waitlist_zip_code ON waitlist(zip_code);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pickups_updated_at BEFORE UPDATE ON pickups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can manage all users" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Pickups policies
CREATE POLICY "Users can view own pickups" ON pickups FOR SELECT USING (
  subscription_id IN (SELECT id FROM subscriptions WHERE user_id = auth.uid())
  OR provider_id = auth.uid()
);
CREATE POLICY "Service role can manage all pickups" ON pickups FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Providers policies
CREATE POLICY "Providers can view own profile" ON providers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Providers can update own profile" ON providers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Service role can manage all providers" ON providers FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Provider availability policies
CREATE POLICY "Providers can view own availability" ON provider_availability FOR SELECT USING (
  provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
);
CREATE POLICY "Providers can manage own availability" ON provider_availability FOR ALL USING (
  provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
);
CREATE POLICY "Service role can manage all availability" ON provider_availability FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Provider zones policies
CREATE POLICY "Providers can view own zones" ON provider_zones FOR SELECT USING (
  provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
);
CREATE POLICY "Providers can manage own zones" ON provider_zones FOR ALL USING (
  provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
);
CREATE POLICY "Service role can manage all zones" ON provider_zones FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Service zones policies (public read)
CREATE POLICY "Anyone can view active service zones" ON service_zones FOR SELECT USING (active = true);
CREATE POLICY "Service role can manage service zones" ON service_zones FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Waitlist policies (public insert)
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can manage waitlist" ON waitlist FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create tickets" ON support_tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Service role can manage all tickets" ON support_tickets FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Damage claims policies
CREATE POLICY "Users can view own claims" ON damage_claims FOR SELECT USING (customer_id = auth.uid() OR provider_id = auth.uid());
CREATE POLICY "Service role can manage all claims" ON damage_claims FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Payouts policies
CREATE POLICY "Providers can view own payouts" ON payouts FOR SELECT USING (
  provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
);
CREATE POLICY "Service role can manage all payouts" ON payouts FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Seed initial service zones (Phoenix metro area)
INSERT INTO service_zones (zip_code, city) VALUES
-- Tempe
('85281', 'Tempe'), ('85282', 'Tempe'), ('85283', 'Tempe'), ('85284', 'Tempe'), ('85285', 'Tempe'), ('85287', 'Tempe'),
-- Scottsdale
('85250', 'Scottsdale'), ('85251', 'Scottsdale'), ('85252', 'Scottsdale'), ('85253', 'Scottsdale'), ('85254', 'Scottsdale'),
('85255', 'Scottsdale'), ('85256', 'Scottsdale'), ('85257', 'Scottsdale'), ('85258', 'Scottsdale'), ('85259', 'Scottsdale'),
('85260', 'Scottsdale'), ('85261', 'Scottsdale'), ('85262', 'Scottsdale'), ('85266', 'Scottsdale'), ('85267', 'Scottsdale'), ('85271', 'Scottsdale'),
-- Gilbert
('85233', 'Gilbert'), ('85234', 'Gilbert'), ('85295', 'Gilbert'), ('85296', 'Gilbert'), ('85297', 'Gilbert'), ('85298', 'Gilbert'), ('85299', 'Gilbert'),
-- Mesa
('85201', 'Mesa'), ('85202', 'Mesa'), ('85203', 'Mesa'), ('85204', 'Mesa'), ('85205', 'Mesa'), ('85206', 'Mesa'),
('85207', 'Mesa'), ('85208', 'Mesa'), ('85209', 'Mesa'), ('85210', 'Mesa'), ('85211', 'Mesa'), ('85212', 'Mesa'),
('85213', 'Mesa'), ('85214', 'Mesa'), ('85215', 'Mesa'), ('85216', 'Mesa'),
-- Chandler
('85224', 'Chandler'), ('85225', 'Chandler'), ('85226', 'Chandler'), ('85244', 'Chandler'), ('85246', 'Chandler'), ('85248', 'Chandler'), ('85249', 'Chandler');
