# Dashboard Redesign Progress

## COMPLETED

### Task 1: Vue Transition Bug Fix
- Wrapped `<UDashboardPanel>` in `<div>` in `app/pages/dashboard/index.vue` and `app/pages/dashboard/settings.vue`

### Task 2: Backend - ShopSettings + Onboarding
- Added to `ShopSettings` in `live-sale/internal/database/models/shop.go`: DeliveryFee, DeliveryNote, FreeDeliveryOver, BankName, BankAccountNumber, BankAccountName
- Updated `onboardingRequest` struct and `CompleteOnboarding()` in `live-sale/internal/api/handlers/handlers.go`
- Go build passes

### Task 3: Onboarding Wizard
- Replaced single form with 3-step wizard in `app/pages/onboarding.vue`
- Steps: Shop Info → Payment → Delivery, with skip options, slide animations, glassmorphism

### Task 4: Phase 1 Foundation
- `app/app.config.ts` - glass card with backdrop-blur-xl, semi-transparent backgrounds
- `app/assets/css/main.css` - added glass CSS variables (--glass-bg, --glass-border, --glass-shadow), .glass-card-elevated, .glass-nav-active
- `app/layouts/default.vue` - glass sidebar with backdrop-blur-2xl
- `app/components/TeamsMenu.vue` - simplified, gradient shop icon, plan label
- `app/components/UserMenu.vue` - cleaned up, Mongolized labels, removed template links

### Task 5: Phase 2 Dashboard (COMPLETE)
- `app/components/dashboard/DashboardCard.vue` - glassmorphism base card
- `app/components/dashboard/DashboardStatCard.vue` - gradient icon bg, trend indicator prop
- `app/components/dashboard/DashboardShopCard.vue` - primary→accent gradient, settings button
- `app/components/dashboard/DashboardQuickAction.vue` - hover glow, glass borders
- `app/components/dashboard/DashboardGreeting.vue` - time-based icon, mn-MN date
- `app/components/dashboard/DashboardActionCard.vue` - amber warning style, glass backdrop
- `app/components/dashboard/DashboardSection.vue` - NOT changed (still uses DashboardCard, auto-inherits glass)
- `app/components/dashboard/DashboardPlanCard.vue` - NOT changed (uses DashboardCard, auto-inherits glass)
- `app/components/dashboard/DashboardRecentOrders.vue` - NEW: recent 5 orders feed with timeAgo, status icons, glass styling
- `app/components/dashboard/DashboardRevenueChart.vue` - NEW: simple bar chart for weekly revenue
- `app/pages/dashboard/index.vue` - REWRITTEN: new layout with Greeting at top, stats row, shop+plan row, required actions, recent orders + quick actions side by side, revenue chart

### Task 6: Products Pages (COMPLETE)
Files: `app/pages/dashboard/products/index.vue`, `new.vue`, `[id].vue`
- `products/index.vue` - already uses div wrapper, no changes needed
- `products/new.vue` - wrapped UDashboardPanel in div for transition fix
- `products/[id].vue` - wrapped UDashboardPanel in div for transition fix

### Task 7: Orders Pages (COMPLETE)
Files: `app/pages/dashboard/orders/index.vue`, `new.vue`, `[id].vue`
- `orders/index.vue` - already uses div wrapper, no changes needed
- `orders/new.vue` - wrapped UDashboardPanel in div for transition fix
- `orders/[id].vue` - wrapped UDashboardPanel in div for transition fix

### Task 8: Settings Pages (COMPLETE)
Files: `app/pages/dashboard/settings.vue`, `settings/index.vue`, `notifications.vue`, `security.vue`
- `settings.vue` - Mongolized nav links (Ерөнхий, Мэдэгдэл, Төлбөр, Нууцлал), title "Тохиргоо"
- `settings/index.vue` - Mongolized profile form (Нэр, Имэйл, Хэрэглэгчийн нэр, Зураг, Танилцуулга)
- `settings/notifications.vue` - Mongolized notification sections (Мэдэгдлийн суваг, Бүртгэлийн шинэчлэлт)
- `settings/security.vue` - Mongolized password form and account deletion section

## ALL TASKS COMPLETED

## VERIFICATION CHECKLIST
- [ ] `pnpm dev` - all pages load, no Vue transition warnings
- [ ] Onboarding flow works end-to-end
- [ ] Dark mode works everywhere
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `cd live-sale && go build ./cmd/web` passes (already confirmed)
