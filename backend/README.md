# Backend Setup & Integration Guide

## Overview

The backend is a simple PHP API connected to MySQL (via XAMPP) that handles:

- User authentication with bcrypt password hashing
- Pricing data retrieval
- Leaderboard data
- User management (profile, registration)

## Directory Structure

```
backend/
├── config.php           # Database connection & CORS headers
├── api.php             # Main API router
├── routes/
│   ├── auth.php        # Login endpoint
│   ├── pricing.php     # Pricing data endpoint
│   ├── leaderboard.php # Leaderboard endpoint
│   └── user.php        # User profile & registration
└── README.md           # This file
```

## Setup Instructions

### 1. Prerequisites

- XAMPP installed and running (MySQL + Apache)
- PHP 7.4+ with MySQLi extension (comes with XAMPP)
- Frontend dev server running: `npm run dev`

### 2. Database Setup

The database schema was auto-imported to `layanan_setor_sampah`. Verify:

```sql
-- In phpMyAdmin or MySQL CLI:
USE layanan_setor_sampah;
SHOW TABLES;
```

### 3. Update Sample User Passwords (IMPORTANT!)

The database contains sample users with placeholder password hashes. For security, update them:

```sql
-- Use bcrypt-hashed passwords (hash your plaintext password at https://www.bcryptgen.com/)
-- Example: plaintext "123456" → bcrypt hash

UPDATE users SET password_hash = '$2y$10$YourBcryptHashHere' WHERE username = 'admin';
UPDATE users SET password_hash = '$2y$10$YourBcryptHashHere' WHERE username = 'kurir01';
UPDATE users SET password_hash = '$2y$10$YourBcryptHashHere' WHERE username = 'warga001';
```

Or use this quick PHP script to hash passwords:

```php
<?php
$password = 'your_plaintext_password';
$hash = password_hash($password, PASSWORD_BCRYPT);
echo $hash;
?>
```

### 4. Configure XAMPP

1. **Move backend to htdocs** (or symlink):

   ```powershell
   # Option A: Copy backend to XAMPP web root
   Copy-Item -Path "c:\layanan-setor-sampah\backend" -Destination "C:\xampp\htdocs\layanan-setor-sampah\backend" -Recurse -Force

   # Option B: (Recommended) Create a symbolic link
   # Run PowerShell as Administrator:
   New-Item -ItemType SymbolicLink -Path "C:\xampp\htdocs\layanan-setor-sampah" -Target "c:\layanan-setor-sampah" -Force
   ```

2. **Verify Apache is running**: Check XAMPP Control Panel or start with:

   ```powershell
   # If using XAMPP CLI
   C:\xampp\apache_start.bat
   ```

3. **Check backend accessibility**:
   - Visit: `http://localhost/layanan-setor-sampah/backend/api.php/pricing`
   - You should see JSON response with pricing data

### 5. Configure Frontend

Update `.env` file in project root:

```env
VITE_API_URL=http://localhost/layanan-setor-sampah/backend
VITE_APP_ENV=development
```

Restart frontend dev server:

```powershell
npm run dev
```

### 6. Test Login

1. Start XAMPP MySQL and Apache (or use `php -S localhost:8000 -t .`)
2. Open frontend at `http://localhost:5173`
3. Try login with sample user:
   - **Username**: `admin`
   - **Password**: `123456` (or your hashed password)

## API Endpoints

### Authentication

**POST** `/backend/api.php/auth`

```json
{
  "username": "admin",
  "password": "123456"
}
```

### Pricing

**GET** `/backend/api.php/pricing`

- No parameters needed
- Returns all pricing categories

### Leaderboard

**GET** `/backend/api.php/leaderboard`

- Returns weekly & monthly leaderboards

### User Profile

**GET** `/backend/api.php/user/{id}`

- Fetch user by ID

**POST** `/backend/api.php/user`

```json
{
  "username": "newuser",
  "password": "password123",
  "role": "warga"
}
```

## Troubleshooting

### "Network error or backend unavailable"

1. Verify XAMPP Apache is running
2. Check `VITE_API_URL` in `.env`
3. Test direct URL: `http://localhost/layanan-setor-sampah/backend/api.php/pricing`
4. Check browser console for CORS errors

### "Database connection failed"

1. Start XAMPP MySQL service
2. Verify credentials in `backend/config.php` (default: user=`root`, password=`""`)
3. Check database `layanan_setor_sampah` exists

### "Invalid username or password"

1. Check sample user exists: `SELECT * FROM users;`
2. Verify password hash is correct (use bcrypt validator)
3. Try hashing a new test password

## Next Steps

1. Implement JWT token authentication for stateless sessions
2. Add rate limiting & security headers
3. Create dashboard endpoints for user statistics
4. Add role-based access control (RBAC)
5. Implement real-time courier tracking
