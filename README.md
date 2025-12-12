# Football Teams Manager

A Laravel 12 + React application for managing football teams, stadiums, leagues, and viewing next match schedules.

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- SQLite/MySQL

## Quick Installation

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd <project-folder>
composer install
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

### 3. Configure `.env`
```env
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
FOOTBALL_DATA_KEY=your_api_key_here
```
**Get API Key**: https://www.football-data.org/

**Generate Encryption Key**
```bash
php artisan key:generate
```


### 4. Setup Database
```bash
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
```

**Sync Football-Data IDs**
```bash
php artisan teams:sync-football-data-ids
```

### 5. Build and Run
```bash
npm run build
php artisan serve
```
or

```bash
composer run dev
```

Visit: http://localhost:8000

## Development Mode
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

## Default Login

**Admin:**
- Email: `admin@example.com`
- Password: `password`

**User:**
- Email: `user@example.com`
- Password: `password`


## Admin Panel

Access: `/admin/dashboard` (admin login required)

## Troubleshooting

**No encryption key:**
```bash
php artisan key:generate
```

**Images not showing:**
```bash
php artisan storage:link
```

**Matches not loading:**
- Check `FOOTBALL_DATA_KEY` in `.env`

## Production Deploy
```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Set in `.env`:
```env
APP_ENV=production
APP_DEBUG=false
```

