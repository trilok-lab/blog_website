# Blog Website - Django + React Native (Expo)

## Backend (Django)

- Python 3.13, Django 5, DRF, CORS, social-auth, Twilio/Stripe stubs
- Apps: `accounts`, `articles`, `admin_features`, `comments`, `notifications`, `contact`, `payments`, `theming`

### Setup

1. Create venv and install deps
   - Windows PowerShell
     - `cd "2nd Blog Project"`
     - `py -m venv .venv`
     - `.\\.venv\\Scripts\\python -m pip install --upgrade pip`
     - Install packages as done during automation
2. Env
   - Create `backend/.env` with:
```
DEBUG=True
SECRET_KEY=changeme
ALLOWED_HOSTS=["*"]
# DATABASE_URL=postgres://user:pass@localhost:5432/blog
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_PORT=2525
STRIPE_SECRET_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
PAGINATION_PER_PAGE=10
```
3. Run
   - `cd backend`
   - `..\\.venv\\Scripts\\python manage.py migrate`
   - `..\\.venv\\Scripts\\python manage.py runserver`

API roots:
- Articles: `/api/articles/` (CRUD), categories at `/api/articles/categories/`
- Admin: `/api/admin/articles/{id}/approve/`
- Comments: `/api/comments/`
- Contact: `/api/contact/submit/`
- Payments: `/api/payments/checkout-session/`
- Theme: `/api/theming/setting/`

## Frontend (Expo)

1. Install deps
   - `cd frontend`
   - `npm install`
2. Configure API base URL
   - In `frontend/app.json`, set `extra.API_BASE_URL` to your backend URL (e.g., `http://127.0.0.1:8000`)
3. Run
   - `npm run web` or `npm run android`

Screens:
- Articles list → detail
- Submit article (guest allowed, pending approval)
- Comments list + submit (guest pending approval)

## Notes / Next
- Implement Twilio SMS verification endpoints and flows
- Configure Google/Facebook OAuth client keys
- Add auth screens and token-based auth if required
- Add Stripe webhooks and enforce payment before article submit
