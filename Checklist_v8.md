# Blog Platform – Master Task Checklist (v8)
# Checklist-3

Legend:
🟢 Completed
🟠 Partially implemented / acceptable with explanation
🔴 Not implemented

---

## 🟢 Completed / Fully Implemented

🟢 Custom login system
🟢 Custom registration system
🟢 `mobile_no` field in user model
🟢 `is_admin` boolean flag
🟢 JWT authentication (access + refresh)
🟢 Authenticated & unauthenticated route separation

🟢 Logged-in user article submission
🟢 Guest article submission (OTP + payment enforced)
🟢 Guest submissions default to unapproved
🟢 Admin article approval & rejection

🟢 Article listing (title, excerpt, read-more, comment count)
🟢 Article detail page via slug
🟢 Unique slug generation (articles + categories)
🟢 Permalink system (`/article/<slug>`)

🟢 Category CRUD (admin)
🟢 Multiple categories per article
🟢 Category deletion blocked when articles exist

🟢 Article image upload with size validation
🟢 Article popularity increment on view
🟢 Homepage slider flag (backend + frontend)
🟢 Media & popularity refinement (basic, PDF-aligned)

🟢 Pagination (backend + frontend, env-controlled)

🟢 Authenticated user comments
🟢 Guest comments (OTP required, admin approval enforced)
🟢 Admin comment moderation
🟢 Comment count per article

🟢 Notifications system (model + API)
🟢 Email notifications via Mailtrap (non-blocking):
- 🟢 Admin notified on article submission
- 🟢 Admin notified on comment pending approval
- 🟢 Article author notified on new comment submission

🟢 Contact Us form (public)
🟢 Contact form validation
🟢 Contact rate limiting
🟢 Contact messages stored in DB
🟢 Admin contact management + email notification

🟢 Stripe Checkout integration
🟢 Stripe webhook verification
🟢 Secure payment status handling
🟢 Single-use payment enforcement
🟢 Race-condition safe payment consumption

🟢 Light / Dark theme system
🟢 Backend-controlled active theme
🟢 Frontend ThemeContext

🟢 Admin workflows (articles, comments, contacts, payments)

🟢 Markdown email templates (basic formatting)
🟢
🟢
🟢

---

## 🟠 Partially Implemented / Acceptable with Explanation

🟠 Twilio integration (present but unused; replaced with WhatsApp Cloud API in debug mode)
🟠 Mobile verification (WhatsApp Cloud API, debug OTP mode)
🟠 Social login (backend ready, frontend minimal)


---

## 🔴 Not Implemented / Untouched

🔴 Fully polished guest comment UX
🔴 Production-grade social login UI
🔴 Advanced popularity decay / weighted scoring
🔴 Multi-template frontend switching

---

Last updated: Checklist-3 (post v8)
