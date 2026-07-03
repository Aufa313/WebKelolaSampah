# Quick Start Guide - Layanan Setor Sampah

## Prerequisites

- Node.js & npm installed
- XAMPP installed (Apache + MySQL)
- Database schema imported (✓ done)
- Backend files in XAMPP htdocs (✓ done)

## Running the Application

### 1. Start XAMPP Services

Open XAMPP Control Panel and start:

- **MySQL**: Click "Start" for MySQL module
- **Apache**: Click "Start" for Apache module

Or use command line:

```powershell
# Start MySQL
C:\xampp\mysql_start.bat

# Start Apache
C:\xampp\apache_start.bat
```

### 2. Update User Passwords (First Time Only)

Hash sample user passwords with bcrypt:

```powershell
# Navigate to backend
cd c:\xampp\htdocs\layanan-setor-sampah\backend

# Run PHP password hasher
php hash-passwords.php
```

Sample users after hashing:

- **admin** / password: `123456`
- **kurir01** / password: `554433`
- **warga001** / password: `884812`

### 3. Start Frontend Development Server

```powershell
cd c:\layanan-setor-sampah
npm install  # First time only
npm run dev
```

This starts the app at `http://localhost:5173`

### 4. Test Backend Connection

Open in browser:

```
http://localhost/layanan-setor-sampah/backend/api.php/pricing
```

You should see JSON pricing data. If you see an error:

- Check MySQL is running
- Check Apache is running
- Check `.env` file has correct `VITE_API_URL`

### 5. Try Logging In

In the frontend, click "Login Portal" and try:

- **Username**: `admin`
- **Password**: `123456`

If login fails:

- Check browser console for error messages
- Verify backend is accessible (step 4)
- Check MySQL is running and database exists

## File Structure

```
c:\layanan-setor-sampah\
├── .env                      # Environment config
├── src/
│   ├── components/          # React components
│   ├── services/api.ts      # API service (connects to backend)
│   └── ...
├── backend/                 # PHP backend (copied to XAMPP htdocs)
│   ├── config.php
│   ├── api.php
│   ├── routes/
│   └── README.md
├── xampp-database-schema.sql # Database schema (imported)
└── ...
```

## API Endpoints

All endpoints require XAMPP Apache to be running.

- **Login**: `POST /backend/api.php/auth`
- **Pricing**: `GET /backend/api.php/pricing`
- **Leaderboard**: `GET /backend/api.php/leaderboard`
- **User**: `GET/POST /backend/api.php/user`

Base URL: `http://localhost/layanan-setor-sampah/backend`

## Troubleshooting

### Frontend won't connect to backend

- Verify XAMPP Apache is running
- Check `VITE_API_URL` in `.env` matches your setup
- Open `http://localhost/layanan-setor-sampah/backend/api.php/pricing` in browser

### Login fails with "Network error"

- Check backend URL is accessible
- Verify MySQL is running
- Check database `layanan_setor_sampah` exists: `SHOW DATABASES;` in phpMyAdmin

### Login fails with "Invalid credentials"

- Verify user exists: `SELECT * FROM users;` in phpMyAdmin
- Check password was hashed correctly
- Try running `php hash-passwords.php` again

### Database says "connection failed"

- Start MySQL in XAMPP Control Panel
- Verify credentials in `backend/config.php` (default: root, no password)

## Next Steps

- [ ] Add JWT token authentication for session management
- [ ] Implement real-time courier tracking
- [ ] Add user dashboard statistics
- [ ] Create admin panel
- [ ] Setup production deployment (VPS/Docker)

## Support

Refer to backend/README.md for detailed backend documentation.
