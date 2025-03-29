-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create patient_profiles table
CREATE TABLE patient_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  emergency_contact JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create doctor_profiles table
CREATE TABLE doctor_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  specialization TEXT NOT NULL,
  bio TEXT,
  education JSONB,
  experience JSONB,
  languages TEXT[],
  consultation_fee DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create time_slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES users(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id),
  doctor_id UUID NOT NULL REFERENCES users(id),
  time_slot_id UUID NOT NULL REFERENCES time_slots(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  type TEXT NOT NULL CHECK (type IN ('immediate', 'scheduled')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create doctor_status table
CREATE TABLE doctor_status (
  doctor_id UUID PRIMARY KEY REFERENCES users(id),
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  available_for_immediate_sessions BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_status ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Patient profiles policies
CREATE POLICY "Patients can view their own profile" ON patient_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Patients can update their own profile" ON patient_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Doctor profiles policies
CREATE POLICY "Anyone can view doctor profiles" ON doctor_profiles
  FOR SELECT USING (true);

CREATE POLICY "Doctors can update their own profile" ON doctor_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Time slots policies
CREATE POLICY "Anyone can view available time slots" ON time_slots
  FOR SELECT USING (true);

CREATE POLICY "Doctors can manage their time slots" ON time_slots
  FOR ALL USING (auth.uid() = doctor_id);

-- Appointments policies
CREATE POLICY "Patients can view their own appointments" ON appointments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their appointments" ON appointments
  FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can update appointments" ON appointments
  FOR UPDATE USING (auth.uid() = doctor_id);

-- Doctor status policies
CREATE POLICY "Anyone can view doctor status" ON doctor_status
  FOR SELECT USING (true);

CREATE POLICY "Doctors can update their own status" ON doctor_status
  FOR UPDATE USING (auth.uid() = doctor_id); 