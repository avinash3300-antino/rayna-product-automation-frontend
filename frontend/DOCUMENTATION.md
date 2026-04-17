# Rayna Tours — Automated Product Creation System: Operations UI Documentation

> **Version:** 1.0.0
> **Generated:** 2026-03-31
> **Status:** UI uses static/mock data — backend API integration in progress
> **Codebase:** Next.js 16 + React 19 + TypeScript 5.8

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Complete Screen-by-Screen Documentation](#2-complete-screen-by-screen-documentation)
   - [Login](#21-login-page)
   - [Landing Page](#22-landing-page)
   - [Dashboard](#23-dashboard)
   - [Destinations](#24-destinations)
   - [Ingestion Monitor](#25-ingestion-monitor)
   - [Review Queue A — Classification](#26-review-queue-a--classification)
   - [Review Queue B — Content](#27-review-queue-b--content)
   - [Product Browser](#28-product-browser)
   - [Product Detail](#29-product-detail)
   - [Attribute Editor](#210-attribute-editor)
   - [Booking Source Mapper](#211-booking-source-mapper)
   - [Tag Manager](#212-tag-manager)
   - [Package Builder](#213-package-builder)
   - [Staging Approval](#214-staging-approval)
   - [Push History](#215-push-history)
   - [Push History — Batch Detail](#216-push-history--batch-detail)
   - [Monitoring & Alerts](#217-monitoring--alerts)
   - [User Management](#218-user-management)
   - [System Settings](#219-system-settings)
   - [Profile](#220-profile)
3. [Component Library Documentation](#3-component-library-documentation)
4. [Static Data Documentation](#4-static-data-documentation)
5. [State Management Documentation](#5-state-management-documentation)
6. [Navigation & Routing](#6-navigation--routing)
7. [PRD Traceability Table](#7-prd-traceability-table)
8. [Known Gaps & Placeholders](#8-known-gaps--placeholders)

---

# 1. PROJECT OVERVIEW

## What This Application Does

The Rayna Tours Operations UI is the frontend interface for an Automated Product Creation System that manages a destination product catalogue spanning hotels, attractions, transfers, and restaurants. The system automates data ingestion from multiple booking sources (Viator, GetYourGuide, Booking.com, Hotelbeds, etc.), runs AI-powered classification on ingested records, generates SEO-optimized content, and pushes curated products through a staging-to-production pipeline.

The UI provides operations teams with tools to monitor the entire pipeline end-to-end: triggering ingestion runs, reviewing AI classification decisions on low-confidence records, approving AI-generated content, managing product attributes, mapping booking sources, applying taxonomy tags, building travel packages, and approving production pushes. Every stage includes human-in-the-loop review mechanisms to ensure quality before data reaches the live website.

Currently, the entire UI operates on **static/mock data** stored in TypeScript files within the `src/lib/` directory. The architectural patterns (React Query hooks, API service layer, type transformers) are in place for real API integration. When connected to the live backend, mock data imports will be replaced with API calls through the existing hook infrastructure.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Language | TypeScript | 5.8 |
| Styling | Tailwind CSS | 4.x |
| UI Components | Radix UI (shadcn/ui "new-york" style) | Various |
| Icons | Lucide React | 1.7.x |
| State Management | Zustand | 5.x |
| Server State | TanStack React Query | 5.x |
| Authentication | NextAuth.js (Credentials provider, JWT) | 4.24.x |
| Charts | Recharts | 3.8.x |
| Animations | Framer Motion | 12.x |
| Toasts | Sonner | 2.x |
| Class Merging | clsx + tailwind-merge (via `cn()` utility) | — |
| Build Tool | Turbopack (via `next dev --turbopack`) | — |
| Fonts | Geist Sans, Geist Mono (local), Playfair Display, DM Sans (Google) | — |

## Static Data Structure

All mock data files live in `src/lib/mock-*.ts`. Each file exports typed arrays or objects that mirror the expected API response shapes. The corresponding TypeScript interfaces live in `src/types/*.ts`. Components import mock data directly from these files. In production, the `src/hooks/api/` hooks will fetch from the backend REST API (base URL from `NEXT_PUBLIC_API_URL` env var, defaulting to `http://localhost:8000`).

## Overall Navigation Structure

The sidebar organizes screens into 6 sections:

| Section | Screens |
|---------|---------|
| **OVERVIEW** | Dashboard |
| **PIPELINE** | Destinations, Ingestion Monitor, Review Queue A – Classification (badge: 12), Review Queue B – Content (badge: 8) |
| **CATALOG** | Product Browser, Attribute Editor, Booking Source Mapper, Tag Manager |
| **PACKAGES** | Package Builder |
| **PUBLISHING** | Staging Approval, Push History |
| **SYSTEM** | Monitoring & Alerts, User Management (admin only), Settings (admin only) |

Additionally: Profile (accessible via header avatar dropdown), Login (public), Landing Page (public root `/`).

---

# 2. COMPLETE SCREEN-BY-SCREEN DOCUMENTATION

---

## 2.1 Login Page

**Route:** `/login`
**Component:** `LoginForm` (`src/components/login-form.tsx`)
**Auth Required:** No (public, redirects to `/dashboard` if already authenticated)

### Purpose
Authenticates operations staff via email/password credentials through NextAuth.js. Maps to the system's role-based access control — users are assigned roles (admin, product_manager, content_reviewer, classification_reviewer, read_only) that gate access to specific screens.

### Layout
Split-screen design:
- **Left panel (hidden on mobile):** Rayna Tours branding with an animated SVG pipeline graphic showing 4 pipeline stages (Ingest → Enrich → Review → Publish) connected by dashed animated lines with a travelling dot.
- **Right panel:** Centered login form card.

### Form Fields

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Email address | `email` input | Required, `autocomplete="email"` | Placeholder: "you@raynatours.com" |
| Password | `password` input | Required, `autocomplete="current-password"` | Toggle show/hide via eye icon button |
| Remember me | Checkbox | None | Currently stored in local state only |

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| Eye/EyeOff icon (password field) | Toggles password visibility (`showPassword` state) | Functional |
| Forgot password? | No-op (placeholder) | **Placeholder — not implemented** |
| Sign in with SSO | Calls `signIn("credentials", { email, password, redirect: false })`. On success → redirects to `/dashboard`. On error → shows toast with error message. | Functional (calls NextAuth API) |

### Data Source
Authentication calls `POST /api/v1/auth/login` on the backend via NextAuth's Credentials provider configured in `src/lib/auth.ts`. JWT tokens are refreshed automatically when within 5 minutes of expiry.

---

## 2.2 Landing Page

**Route:** `/` (root)
**Component:** Inline `Home` component (`src/app/page.tsx`)
**Auth Required:** No (public)

### Purpose
A marketing/documentation page introducing the Rayna Tours Product Automation system. Not part of the operations dashboard — this is the public-facing overview of the platform.

### Layout (Sections)
1. **Fixed navbar** — "Sign In" link (`/login`), "Get Access" link (`/login`)
2. **Hero section** — Animated counters (4 destinations, 9 pipeline stages, 11 UI modules), pipeline stage icons
3. **Before vs After** — 7-item comparison (manual vs. automated approach)
4. **9-Stage Pipeline** — Cards for each pipeline stage
5. **4 Feature Pillars** — Destination Intelligence, Legal-First, AI Content, Package Builder
6. **Product Categories** — Hotels, Attractions, Transfers, Restaurants cards
7. **Tag Taxonomy** — 5 dimensions displayed
8. **Operations UI Modules** — 11 module descriptions
9. **Tech Stack** — AI & Data, Official APIs, Infrastructure rows
10. **Risk Mitigation** — 5 risk items
11. **CTA + Footer**

All data is hardcoded inline in the component (not from mock files). Uses Framer Motion for scroll animations.

### Buttons

| Button | Action |
|--------|--------|
| Sign In (navbar) | Links to `/login` |
| Get Access (navbar) | Links to `/login` |
| Request Early Access (CTA) | Links to `/login` |

---

## 2.3 Dashboard

**Route:** `/dashboard`
**Component:** `DashboardPage` (`src/app/(dashboard)/dashboard/page.tsx`)
**Auth Required:** Yes

### Purpose
The central operations overview providing at-a-glance KPIs, pipeline health, data freshness status, booking source health, and product distribution charts. This is the first screen operators see after login. Maps to PRD: **Destination Dashboard — monitoring destinations and pipeline health**.

### Layout (4 Rows)
- **Row 1:** `StatCards` — 4 KPI cards spanning full width
- **Row 2:** `PipelineHealth` (left) + `RecentJobsTable` (right) — 2 columns on xl
- **Row 3:** `DataFreshnessHeatmap` (2/3 width) + `BookingSourceHealth` (1/3 width)
- **Row 4:** `ProductsByDestinationChart` + `ProductsByCategoryChart` — 2 columns

### StatCards Component

**Data source:** `MOCK_KPI_STATS` from `src/lib/mock-dashboard-data.ts`.
Currently uses static data. In production, this will be populated from a dashboard summary API endpoint.

| Card | Value | Description | Icon | Trend |
|------|-------|-------------|------|-------|
| Total Products | 2,847 | Sum of all products across all statuses | Package | Shows breakdown: 2,390 published / 312 draft / 145 staged |
| Active Ingestion Jobs | 3 | Running ingestion jobs | Activity | Green pulse dot when `isIngestionRunning` is true |
| Queue A – Classification | 12 | Low-confidence records awaiting human review | Filter | Links conceptually to `/review-classification` |
| Queue B – Content | 8 | AI content awaiting review | Pencil | Links conceptually to `/review-content` |

### PipelineHealth Component

**Data source:** `MOCK_PIPELINE_STAGES` from `src/lib/mock-dashboard-data.ts`.

Renders a horizontal funnel chart (Recharts `BarChart`) showing record counts at each pipeline stage. 7 stages: Ingest (24), Classify (18), Map (12), Content (31), Review (20), Stage (8), Publish (5). Each bar is colored differently. Custom tooltip shows stage name and count on hover.

### RecentJobsTable Component

**Data source:** `MOCK_RECENT_JOBS` from `src/lib/mock-dashboard-data.ts`.

| Column | Description |
|--------|-------------|
| Destination | City name with globe icon |
| Run Type | Badge: "Full" or "Incremental" |
| Status | Badge: running (blue pulse), completed (green), failed (red), queued (gray) |
| Records | Number processed |
| Started | Relative time (e.g., "5m ago") |
| Duration | Formatted as "Xm Ys" or "—" for running jobs |

**Buttons:** "View All" link in header (navigates to `/ingestion`).

### DataFreshnessHeatmap Component

**Data source:** `MOCK_FRESHNESS_DATA` from `src/lib/mock-dashboard-data.ts`.

A color-coded grid where rows are destinations (7) and columns are data types (Hotel Pricing, Attraction Prices, Operating Hours, Descriptions, Images). Each cell is colored:
- **Green (fresh):** Data is within threshold
- **Amber (warning):** Approaching staleness
- **Red (stale):** Data exceeds freshness threshold

Hover tooltip shows: destination, data type, freshness level, last updated time.

### BookingSourceHealth Component

**Data source:** `MOCK_BOOKING_SOURCES` from `src/lib/mock-dashboard-data.ts` (dashboard variant, 4 sources).

A vertical list showing source name, health status dot (green/amber/red), response time in ms, and last ping time. Degraded sources get an amber background tint; down sources get a red tint.

### ProductsByDestinationChart Component

**Data source:** `MOCK_PRODUCTS_BY_DESTINATION` from `src/lib/mock-dashboard-data.ts`.

Horizontal bar chart (Recharts) showing product counts per destination. 8 destinations, sorted by count. Top: Dubai (892), Abu Dhabi (534).

### ProductsByCategoryChart Component

**Data source:** `MOCK_PRODUCTS_BY_CATEGORY` from `src/lib/mock-dashboard-data.ts`.

Donut/pie chart (Recharts) with 4 slices: Attractions (1,240), Hotels (890), Transfers (412), Restaurants (305). Center shows total. Custom legend below.

---

## 2.4 Destinations

**Route:** `/destinations`
**Component:** `DestinationsGrid` (`src/components/destinations/destinations-grid.tsx`)
**Auth Required:** Yes

### Purpose
Manage destination cities where products are catalogued. Operators can view product counts per destination, trigger ingestion runs, review intelligence summaries (keywords + approved sources), and add new destinations. Maps to PRD: **Destination Dashboard — trigger ingestion runs, monitor destinations**.

### Layout
- Header with "Add Destination" button
- Search input for filtering
- Responsive grid of `DestinationCard` components (1-3 columns)

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| + Add Destination | Opens `AddDestinationDialog` modal | Functional (adds to local state) |
| Search input | Filters destination cards by name or country | Functional (client-side filter) |

### DestinationCard Component

Each card displays:
- Country flag + destination name + country
- Status badge: "Active" (green) or "Inactive" (gray)
- Product count breakdown: Hotels / Attractions / Transfers / Restaurants with category icons
- Last Ingestion Run: status badge (completed/failed/running), date, records processed, duration
- Intelligence Filter: last run date, keywords found, sources approved
- 3 action buttons

| Button | Action | Status |
|--------|--------|--------|
| Run Ingestion (Play icon) | `console.log("Trigger ingestion for", id)` | **Placeholder** — will trigger `POST /api/ingestion/trigger` |
| Intelligence Summary (Brain icon) | Opens `IntelligenceSummarySheet` side drawer | Functional (shows mock data) |
| Settings (Settings icon) | `console.log("Open settings for", id)` | **Placeholder** — will open destination config |

### IntelligenceSummarySheet Component

A side drawer (`Sheet`) showing 2 tables:

**Top Keywords Table:**
| Column | Description |
|--------|-------------|
| Keyword | SEO keyword text |
| Category | Product category badge |
| Volume | Monthly search volume |
| Difficulty | 0-100 score with color coding (green ≤ 30, amber ≤ 60, red > 60) |
| Intent | Informational / Commercial / Transactional / Navigational badge |

**Approved Sources Table:**
| Column | Description |
|--------|-------------|
| Source Name | Name text |
| Type | Badge (OTA / Direct Supplier / Aggregator) |
| Categories | Multiple category badges |
| Relevance | Percentage with color bar |
| ToS Status | Approved/Pending/Rejected badge |
| Ingestion Method | API/Scraping/Manual badge |
| Priority | Rank number |

**Data source:** `MOCK_INTELLIGENCE_SUMMARIES` from `src/lib/mock-destinations-data.ts`. Currently uses static data. In production, will be populated from the Destination Intelligence API.

### AddDestinationDialog Component

A modal form for creating a new destination.

| Field | Type | Validation |
|-------|------|------------|
| Destination Name | Text input | Required |
| Country | Select (12 options with flags) | Required |
| City | Text input | Required |
| Region | Text input | Optional |
| Timezone | Select | Optional |
| Latitude | Number input | Optional |
| Longitude | Number input | Optional |

**Buttons:** Cancel, Add Destination (disabled until name + country + city filled).

---

## 2.5 Ingestion Monitor

**Route:** `/ingestion`
**Component:** `IngestionMonitor` (`src/components/ingestion/ingestion-monitor.tsx`)
**Auth Required:** Yes

### Purpose
Real-time monitoring of data ingestion jobs. Shows currently running jobs with per-source progress, and a complete history of all past jobs. Maps to PRD: **Ingestion Monitor — real-time job progress**.

### Layout
- Header with title + "Start New Job" button
- `ActiveJobsSection` (collapsible section showing running jobs)
- `JobHistoryTable` (paginated table of all jobs)

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| Start New Job | `console.log("Open new job dialog")` | **Placeholder** — will open a job configuration dialog |

### ActiveJobsSection Component

Renders when `MOCK_ACTIVE_JOBS` contains jobs. Each active job renders as an `ActiveJobCard`.

**ActiveJobCard displays:**
- Job ID (truncated UUID), destination, run type badge (full/incremental/manual)
- Overall progress bar (recordsFetched / estimatedTotal)
- Started time (elapsed format), records fetched count
- Per-source breakdown table: Source name, Category badge, Records Fetched, Errors count, Status (running with spinner / completed with check / failed with X)
- Error log section (if errors exist): timestamp, source, message, severity badge (error red / warning amber)

| Button | Action | Status |
|--------|--------|--------|
| View Details | Opens `JobDetailSheet` side drawer | Functional |
| Cancel Job (X icon) | `console.log("Cancel job", id)` | **Placeholder** |

### JobDetailSheet Component

A side drawer showing complete job details:
- All fields from `ActiveJobCard`
- Full source breakdown table
- Complete error log with severity filtering
- If completed: end time, total duration, related push batch IDs

### JobHistoryTable Component

**Data source:** `MOCK_JOB_HISTORY` from `src/lib/mock-ingestion-data.ts` (14 jobs).

| Column | Description |
|--------|-------------|
| Job ID | Truncated UUID, monospace |
| Destination | City name |
| Run Type | Badge: full (blue) / incremental (green) / manual (amber) |
| Status | Badge: completed (green) / failed (red) / running (blue) / queued (gray) |
| Records | Number fetched |
| Started | Formatted datetime |
| Duration | Formatted "Xm Ys" |
| Actions | "Details" button → opens `JobDetailSheet` |

**Pagination:** Client-side, 10 rows per page with Prev/Next buttons.

---

## 2.6 Review Queue A — Classification

**Route:** `/review-classification`
**Component:** `ClassificationQueue` (`src/components/classification/classification-queue.tsx`)
**Auth Required:** Yes

### Purpose
Human review queue for records where the AI classifier's confidence score falls below the auto-approve threshold (configurable in Settings, default 0.9). Reviewers examine the raw ingested data, the AI's predicted category, and the confidence rationale — then either approve, override the category, or escalate. Maps to PRD: **Review Queue A — Classification (low-confidence records)**.

### Layout
- `ClassificationStats` — 4 KPI stat cards
- `ClassificationFilters` — filter bar
- `ClassificationTable` — data table with row click → opens `RecordReviewModal`

### ClassificationStats Component

**Data source:** `MOCK_CLASSIFICATION_STATS` from `src/lib/mock-classification-data.ts`.

| Card | Value | Color |
|------|-------|-------|
| Pending | 12 | Amber |
| Assigned to Me | 4 | Blue |
| In Review | 3 | Purple |
| Completed Today | 27 | Green |

### ClassificationFilters Component

| Filter | Type | Options |
|--------|------|---------|
| Destination | Select | All Destinations + unique destinations from data |
| Category | Select | All Categories / Hotels / Attractions / Transfers / Restaurants |
| Date From | Date input | ISO date string |
| Date To | Date input | ISO date string |
| Confidence Min | Number (0-1) | Slider or input |
| Confidence Max | Number (0-1) | Slider or input |

**Button:** Reset (RotateCcw icon) — resets all filters to defaults.

### ClassificationTable Component

**Data source:** `MOCK_CLASSIFICATION_RECORDS` from `src/lib/mock-classification-data.ts` (18 records).

| Column | Description |
|--------|-------------|
| Source Name | Product/record name from `normalizedPayload.name` |
| Source | Origin system (e.g., "viator", "booking.com") |
| Destination | City name |
| Predicted Category | Badge: Hotels (blue) / Attractions (purple) / Transfers (amber) / Restaurants (rose) |
| Confidence | Percentage with color coding: green ≥ 70%, amber ≥ 50%, red < 50%. Includes a `ConfidenceGauge` mini SVG arc |
| Status | Badge: pending / in_review / approved / escalated |
| Assigned To | Name or "—" |
| Created | Relative time |
| Actions | Review button → opens `RecordReviewModal` |

**Row selection:** Checkbox per row + "select all" header checkbox. Bulk actions appear when items are selected.

**Bulk action buttons:**
| Button | Action | Status |
|--------|--------|--------|
| Approve Selected | Marks all selected as "approved" | Functional (local state) |
| Escalate Selected | Marks all selected as "escalated" | Functional (local state) |

### RecordReviewModal Component

A full-screen dialog for reviewing a single classification record.

**Left panel — Raw Data Viewer:**
- `JsonViewer` component renders `normalizedPayload` as formatted, syntax-highlighted JSON
- Shows source URL, location data, pricing, images, raw metadata

**Right panel — Review Form:**
- Predicted Category badge + Confidence score with `ConfidenceGauge`
- Classifier Rationale text
- Override Category select (Hotels/Attractions/Transfers/Restaurants)
- Review Notes textarea
- Status display

**Buttons:**

| Button | Action | Status |
|--------|--------|--------|
| Approve (CheckCircle icon) | Sets `status: "approved"`, saves `finalCategory` + `reviewNotes` | Functional (local state) |
| Escalate (AlertTriangle icon) | Sets `status: "escalated"` | Functional (local state) |
| Skip (ChevronRight icon) | Navigates to next record | Functional |
| Previous (ChevronLeft icon) | Navigates to previous record | Functional |

### ConfidenceGauge Component
A small SVG arc indicator that visually represents the 0-1 confidence score. Color transitions: red < 0.5, amber 0.5-0.7, green > 0.7.

---

## 2.7 Review Queue B — Content

**Route:** `/review-content`
**Component:** `ContentQueue` (`src/components/content-review/content-queue.tsx`)
**Auth Required:** Yes

### Purpose
Human review queue for AI-generated product content (descriptions, meta titles, FAQ, schema markup). Reviewers compare generated content against quality standards and can approve, reject (triggering regeneration), or edit inline. Maps to PRD: **Review Queue B — Content (AI-generated content review)**.

### Layout
- `ContentStats` — 4 KPI cards
- `ContentFilters` — filter bar
- `ContentTable` — data table with row click → opens `ContentReviewModal`

### ContentStats Component

**Data source:** `MOCK_CONTENT_STATS` from `src/lib/mock-content-data.ts`.

| Card | Value |
|------|-------|
| Pending | 8 |
| Assigned to Me | 3 |
| In Review | 2 |
| Completed Today | 15 |

### ContentFilters Component

| Filter | Type | Options |
|--------|------|---------|
| Destination | Select | All + unique destinations |
| Category | Select | All / Hotels / Attractions / Transfers / Restaurants |
| Status | Select | All / Pending / In Review / Approved / Rejected |
| Search | Text input | Filters by product name |

**Button:** Reset — clears all filters.

### ContentTable Component

**Data source:** `MOCK_CONTENT_RECORDS` from `src/lib/mock-content-data.ts` (15 records).

| Column | Description |
|--------|-------------|
| Product Name | Name text |
| Destination | City name |
| Category | Colored badge |
| Attempt | "X/Y" showing generation attempt vs. max attempts |
| Primary Keyword | The target SEO keyword |
| Status | Badge: pending / in_review / approved / rejected |
| Publish Flag | Check (green) or X (red) icon |
| Updated | Relative time |
| Actions | Review button |

### ContentReviewModal Component

A side drawer (`Sheet`) with tabbed content review.

**`ContentTabPanel` renders 6 tabs:**

| Tab | Content |
|-----|---------|
| Short Description | Generated short description text |
| Long Description | Generated long description (whitespace-preserved) |
| Meta Title | SEO title with character count |
| Meta Description | SEO description with character count |
| FAQ | List of Q&A pairs |
| Schema Markup | JSON-LD code block |

Each tab shows the generated content with inline editing capability when in review mode.

**Review panel (bottom):**
- Generation attempt info ("Attempt X of Y")
- Primary keyword badge
- Publish Flag toggle (switch)
- Review Notes textarea

**Buttons:**

| Button | Action | Status |
|--------|--------|--------|
| Approve (CheckCircle) | Sets `status: "approved"` | Functional (local state) |
| Reject (XCircle) | Sets `status: "rejected"`, triggers regeneration if attempts remain | Functional (local state) |
| Skip → | Navigates to next record | Functional |

---

## 2.8 Product Browser

**Route:** `/products`
**Component:** `ProductBrowser` (`src/components/products/product-browser.tsx`)
**Auth Required:** Yes

### Purpose
Central catalog browser for all products across all destinations and categories. Supports search, multi-faceted filtering, grid/table view toggle, and navigation to product detail pages. Maps to PRD: **Product Browser — browse all products**.

### Layout
- Header bar: search input, filter toggle button, grid/table view toggle
- Optional filter sidebar (left panel, desktop) or filter sheet (mobile)
- Main content: `ProductGrid` or `ProductTable` depending on `viewMode`

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| Search input (with X clear) | Filters by product name or destination | Functional (client-side) |
| Filters toggle | Shows/hides `ProductFilters` sidebar (desktop) or opens Sheet (mobile) | Functional |
| Grid view button (LayoutGrid icon) | Sets `viewMode: "grid"` | Functional |
| Table view button (List icon) | Sets `viewMode: "table"` | Functional |

### ProductFilters Component (Sidebar)

| Filter Section | Type | Options |
|----------------|------|---------|
| Destination | Checkboxes | Derived from product data (Dubai, Abu Dhabi, Oman, etc.) |
| Category | Checkboxes | Hotels, Attractions, Transfers, Restaurants |
| Status | Checkboxes | Draft, Staged, Published, Archived |
| Completeness | Dual-thumb Slider | Range 0-100%, step 5 |
| Tags (per dimension) | Clickable badges | budget_tier, travel_theme, audience, season, accessibility |
| Booking Source Assigned | Switch | Yes/No |
| Publish Flag | Switch | Yes/No |

**Button:** Reset — clears all filters. Active filter count badge shown.

Each section is collapsible via an accordion.

### ProductGrid Component

Responsive grid (1-4 columns based on screen size) of `ProductCard` components.

**ProductCard displays:**
- Hero image or category icon placeholder
- Category badge (Hotels blue, Attractions purple, Transfers amber, Restaurants rose)
- Product name, destination
- Status badge (draft gray, staged amber, published green, archived red)
- Completeness progress bar (green ≥ 80%, amber ≥ 50%, red < 50%)
- Up to 3 tag badges + "+N more" overflow

**ProductCard buttons (icon buttons with tooltips):**

| Button | Action |
|--------|--------|
| Edit (Pencil) | Navigates to `/products/{id}` |
| Content (Eye) | Navigates to `/products/{id}` |
| Tags (Tag) | Navigates to `/products/{id}` |
| Source (Link2) | Navigates to `/products/{id}` |

### ProductTable Component

**Data source:** `MOCK_PRODUCTS` from `src/lib/mock-products.ts` (20 products).

| Column | Description |
|--------|-------------|
| Name | Product name (clickable → edit) |
| Category | Colored badge |
| Destination | City text |
| Status | Colored badge |
| Completeness | Progress bar with percentage |
| Tags | First 2 badges + tooltip for overflow |
| Booking Source | Source name or "—" |
| Publish Flag | Check or X icon |
| Last Updated | Relative time |
| Actions | 4 icon buttons (Edit, Content, Tags, Source) |

**Pagination:** Client-side, 12 items per page, Prev/Next buttons, "Showing X-Y of Z" text.
**Row click:** Calls `onEdit` → navigates to `/products/{id}`.

---

## 2.9 Product Detail

**Route:** `/products/[id]`
**Component:** `ProductDetail` (`src/components/products/product-detail.tsx`)
**Auth Required:** Yes

### Purpose
Full detail view for a single product with 8 tabbed sections covering all product data: overview, attributes, content, media, tags, booking sources, quality checks, and history. Supports inline editing for most fields. Maps to PRD: **Product Browser detail view + Attribute Editor per-product view**.

### Layout
- Header: back button, product name, status/category badges, completeness percentage, Edit/View toggle
- 8-tab interface below header

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| ← Back | Navigates to `/products` | Functional |
| Edit Mode / View Mode toggle | Toggles `editing` state; tabs switch between display and edit forms | Functional (local state only) |

### Tabs

#### Tab 1: Overview (`ProductOverviewTab`)
**View mode:** Hero image, status/category badges, completeness bar, publish flag, short description, location (city/country), destination, price, duration, star rating, booking source.
**Edit mode:** Editable inputs for name, destination, category (select), short description (textarea).

#### Tab 2: Attributes (`ProductAttributesTab`)
**3 cards:** Location (address, city, country, lat, lng), Pricing (currency, amount, per), Other Details (star rating, duration, hours, website, phone, email).
**Edit mode:** All fields become editable `Input` components.

#### Tab 3: Content (`ProductContentTab`)
**5 cards:** Short Description, Long Description, SEO Meta (title + description), FAQ (Q&A list), Schema Markup (JSON-LD).
**Edit mode:** All text fields become editable textareas/inputs. FAQ entries editable inline.

#### Tab 4: Media (`ProductMediaTab`)
**2 cards:** Images (grid of thumbnails, first marked "Hero") and Videos (URL list).
**Edit mode:** "Add Images" and "Add Video URL" buttons appear.
**Status:** Add functionality is a **placeholder** — buttons exist but no upload workflow is implemented.

#### Tab 5: Tags (`ProductTagsTab`)
Tags grouped by dimension (budget_tier, travel_theme, audience, season, accessibility).
**Edit mode:** "Add" button per dimension, X remove button per tag.
**Status:** Add/remove is **placeholder** — modifies no persisted state.

#### Tab 6: Booking Sources (`ProductBookingTab`)
Shows source name, ID, and URL if assigned; empty state if not.
**Edit mode:** Editable inputs for source ID/name/URL, or "Assign Booking Source" button if none.
**Status:** **Placeholder** — no actual source assignment workflow.

#### Tab 7: Quality Checks (`ProductQualityTab`)
Read-only display of quality check results. Summary badges (X passed, Y warnings, Z failed). Per-check cards with status icon, name, description, details, timestamp.
**Status types:** pass (green check), fail (red X), warning (amber triangle), skipped (gray minus).

#### Tab 8: History (`ProductHistoryTab`)
Read-only timeline of product events. Each entry has: colored icon, action label (Created, Updated, Status Changed, Content Generated, Tags Updated, Booking Source Assigned, Published, Archived), user attribution, relative timestamp, description.

---

## 2.10 Attribute Editor

**Route:** `/attributes`
**Component:** `AttributeEditor` (`src/components/attributes/attribute-editor.tsx`)
**Auth Required:** Yes

### Purpose
Dedicated editor for product-specific attributes organized by category (Hotels, Attractions, Transfers, Restaurants). Each category has its own specialized form with fields appropriate to that product type. Includes bulk edit capabilities and an enrichment queue for tracking products with missing fields. Maps to PRD: **Attribute Editor — edit product fields**.

### Layout
- Header with category tabs, "Bulk Edit Mode" toggle, and "Export Schema" button
- Two-panel layout: left = `ProductSelector` list, right = category-specific form
- Bottom: `EnrichmentQueue` drawer

### Tabs

| Tab | Description | Product Count (mock) |
|-----|-------------|---------------------|
| Hotels | Hotel-specific attributes (star rating, room types, amenities, etc.) | 6 |
| Attractions | Attraction attributes (duration, tickets, operating hours, etc.) | 4 |
| Transfers | Transfer attributes (route, vehicle, capacity, etc.) | 5 |
| Restaurants | Restaurant attributes (cuisine, price range, hours, etc.) | 2 |

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| Bulk Edit Mode toggle | Toggles between single-select and multi-select product mode | Functional |
| Export Schema (Download icon) | Downloads a JSON blob of all attributes for the active category | Functional (generates JSON from local state) |
| Edit Mode / View Mode toggle | Toggles form editability for the selected product | Functional |
| Save Changes | `console.log("Save changes")` | **Placeholder** — will call API |
| Mark for Enrichment | `console.log("Mark for enrichment")` | **Placeholder** |

### ProductSelector Component (Left Panel)
Searchable, filterable, sortable list of products within the active category.

| Filter | Type |
|--------|------|
| Search | Text (filters by name) |
| Destinations | Pill buttons (multi-select) |
| Statuses | Pill buttons (draft/staged/published/archived) |
| Completeness min | Slider threshold |
| Sort by | Select: Name / Completeness / Last Updated |

In bulk mode: checkboxes replace single-select behavior.

### Hotel Form (`HotelForm` — 9 Sections)

| Section | Fields | Required |
|---------|--------|----------|
| Basic Info | Hotel Name, Star Rating (1-5 clickable stars), Property Type (select), Status | 3 |
| Location | Address, Latitude, Longitude, Destination (select) | 4 |
| Operations | Check-in Time, Check-out Time, Cancellation Policy (select) | 3 |
| Room & Board | Room Types (toggle: Standard/Deluxe/Suite/Family), Board Types (toggle: RO/BB/HB/FB/AI) | 2 |
| Amenities | Searchable amenity toggles grouped by: Facilities, Dining, Connectivity, Wellness (min 5 required) | 1 |
| Pricing | Net Rate From (number), Currency Code (select), Booking Sources (badges) | 2 |
| Media | Image list with thumbnail + URL input (min 5 required) | 1 |
| SEO Content | Short Description (read-only), Meta Title (60 char limit), Meta Description (160 char limit), Content Status badge | 2 |
| Tags | Tags grouped by dimension with colored badges, "Manage Tags" link | 0 |

### Attraction Form (`AttractionForm` — 8 Sections)

| Section | Key Fields |
|---------|-----------|
| Basic Info | Attraction Name, Category select (Theme Park/Cultural/Adventure/Water/Nature/Entertainment) |
| Location | Address, Latitude, Longitude, Destination |
| Visit Info | Typical Duration, Minimum Age, Includes/Excludes text |
| Operating Hours | 7-day schedule with open/close times and "Closed" toggles; staleness warning if > 7 days |
| Ticket Types | Table: Type (Adult/Child/Family/Senior), Price From, Price To, Currency. Add/Remove rows |
| Media | Image list with thumbnails (target: 5 minimum) |
| SEO Content | Short Description, Meta Title (60 char), Meta Description (160 char), Content Status |
| Tags | Dimension-grouped tag badges |

### Transfer Form (`TransferForm` — 7 Sections)

| Section | Key Fields |
|---------|-----------|
| Basic Info | Transfer Name, Transfer Type (Airport/City/Intercity/Port/Custom) |
| Route | Origin Location, Destination Location, Typical Duration |
| Vehicle & Capacity | Vehicle Type (Sedan/Van/Minibus/Coach/Luxury), Min Pax, Max Pax, Pricing Model (Per Vehicle/Per Person) |
| Pricing | Net Rate, Currency Code |
| Features | Meet & Greet (switch), 24/7 Availability (switch), Flight Monitoring (switch, airport only) |
| SEO Content | Short Description |
| Tags | Dimension-grouped tag badges |

### Restaurant Form (`RestaurantForm` — 4 Sections)

| Section | Key Fields |
|---------|-----------|
| Basic Info | Restaurant Name, Cuisine Type, Price Range ($/$$/$$$/$$$$) |
| Location | Address, Latitude, Longitude, Destination |
| Operating Hours | 7-day schedule with open/close times and "Closed" toggles |
| Tags | Dimension-grouped tag badges |

### BulkEditPanel Component
Appears when bulk mode is active and products are selected. Allows applying changes to multiple products at once.

**Editable fields (each toggled on via checkbox):**

| Field | Type | Options |
|-------|------|---------|
| Cancellation Policy | Select | Free / Non-Refundable / Partial |
| Board Types | Toggle buttons | RO / BB / HB / FB / AI |
| Status | Select | draft / staged / published / archived |
| Tags | — | **Placeholder** (future Tag Manager integration) |

**Buttons:** Cancel, "Apply to N Products" (disabled when no changes selected).

### EnrichmentQueue Component (Bottom Drawer)
A collapsible drawer pinned to the bottom of the screen.

**Collapsed:** Shows "Enrichment Queue: N products awaiting field completion" with priority count badges.
**Expanded:** Scrollable table.

**Data source:** `MOCK_ENRICHMENT_QUEUE` from `src/lib/mock-attributes.ts` (12 entries).

| Column | Description |
|--------|-------------|
| Product | Name text |
| Category | Icon + category name |
| Missing Fields | First 3 as red badges + "+N more" overflow |
| Priority | Colored badge (high=red, medium=amber, low=gray) |
| Assigned To | Name with user icon |
| Actions | "Edit" button → selects the product in the main editor |

---

## 2.11 Booking Source Mapper

**Route:** `/booking-sources`
**Component:** `BookingSourceMapper` (`src/components/booking-sources/booking-source-mapper.tsx`)
**Auth Required:** Yes

### Purpose
Manage booking source integrations, map products to their primary/fallback/manual booking sources, and monitor source health. Maps to PRD: **Booking Source Mapper — assign Source 1/2/3 per product**.

### Tabs

| Tab | Component | Purpose |
|-----|-----------|---------|
| Source Directory | `SourceDirectory` | CRUD management of booking source records |
| Product Mappings | `ProductMappings` | Map products to sources (Source 1/2/3) |
| Health Monitor | `HealthMonitor` | Real-time health status of all sources |

### Tab 1: Source Directory

**Data source:** `MOCK_BOOKING_SOURCES` from `src/lib/mock-booking-sources.ts` (10 sources).

**Table columns:**

| Column | Description |
|--------|-------------|
| Source Name | Name + mode badge (API/Manual/Email) |
| Category | Hotels / Attractions / Transfers / Restaurants |
| Endpoint/Contact | URL for API mode, email/phone for others |
| Margin Priority | Star visualization (out of 10) |
| Status | Active/Inactive switch (inline toggle) |
| Health | Colored dot + relative time since last ping |
| Actions | Edit (pencil), Test Connection (wifi, API only), Map (link icon) |

**Buttons:**

| Button | Action | Status |
|--------|--------|--------|
| Add New Source | Opens CRUD dialog | Functional (adds to local state) |
| Edit (per row) | Opens CRUD dialog with pre-filled data | Functional (local state) |
| Test Connection (per API row) | Updates `lastPingTime` to now | Functional (local state simulation) |
| Active toggle (per row) | Toggles `isActive` | Functional (local state) |

**CRUD Dialog fields:**

| Field | Type | Notes |
|-------|------|-------|
| Source Name | Text | Auto-generates code slug on create |
| Code | Text (monospace) | URL-safe slug |
| Category | Select | Hotels/Attractions/Transfers/Restaurants |
| Booking Mode | Select | API/Manual/Email |
| Endpoint URL | Text | Shown only for API mode |
| Contact Email | Email | Shown for Manual/Email modes |
| Contact Phone | Tel | Always shown |
| Margin Priority Score | Slider (1-10) | — |
| Is Active | Switch | — |
| Link to Ingestion Source | Select | Optional, from `MOCK_INGESTION_SOURCES` (6 items) |

### Tab 2: Product Mappings

**Data source:** `MOCK_PRODUCT_MAPPINGS` from `src/lib/mock-booking-sources.ts` (15 mappings).

**Status summary:** Badges showing Complete / Partial / Unmapped counts.

**Filters:** Destination select, Category select, Source select, "Unmapped Only" switch.

**Table columns:**

| Column | Description |
|--------|-------------|
| Product | Icon + name |
| Destination | City text |
| Source 1 (Primary) | Dropdown select from all sources |
| Source 2 (Fallback) | Dropdown select |
| Source 3 (Manual) | Dropdown select |
| Status | Badge: complete (green) / partial (amber) / unmapped (red) |
| Last Updated | Date |

Unmapped rows are highlighted with a red-tinted background.

**Buttons:**

| Button | Action | Status |
|--------|--------|--------|
| Bulk Assign | Opens a 5-step wizard Sheet | Functional (local state) |

**Bulk Assign Wizard (5 steps):**
1. **Filter Products** — Destination + Category selects, shows match count
2. **Select Products** — Checkbox list of filtered products
3. **Choose Sources** — 3 source selects (Primary/Fallback/Manual) with "Keep existing" option
4. **Preview Assignments** — Summary of pending changes
5. **Apply** — Confirmation + apply button (updates local state)

### Tab 3: Health Monitor

**Data source:** `MOCK_SOURCE_HEALTH_CARDS` from `src/lib/mock-booking-sources.ts` (7 cards), `MOCK_HEALTH_LOGS` (20 logs).

**Auto-refresh:** Every 15 seconds via `setInterval`.

**KPI Cards (4):** Sources Online (N/total), Degraded count, Offline count, Avg Response Time (ms).

**Offline alert banner:** Shown when any source is offline. Mentions auto-routing to Source 2 fallback. Shows affected product count.

**Per-source health cards:** Source name, category badge, status indicator (online with green pulse / degraded amber / offline red with error message), response time, sparkline chart (Recharts `LineChart` showing 10 response time data points), last checked time, "Check Now" button.

**Health Check Log table:**

| Column | Description |
|--------|-------------|
| Source | Source name |
| Status | Colored dot + label |
| Response Time | Milliseconds |
| Error Message | Text or "—" |
| Checked At | Formatted datetime |

Filterable by source and status via select dropdowns.

---

## 2.12 Tag Manager

**Route:** `/tags`
**Component:** `TagManager` (`src/components/tags/tag-manager.tsx`)
**Auth Required:** Yes

### Purpose
Manage the product taxonomy tag system across 5 dimensions. Create/edit/delete tags in a hierarchical tree, bulk-apply tags to products, and review AI-suggested tags. Maps to PRD: **Tag Manager — apply taxonomy tags**.

### Layout
- Two-column: left sidebar = `TagDimensionsPanel` (tag tree), right = `BulkTagProducts` + `AiSuggestionsQueue`
- Mobile: left panel in a Sheet drawer

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| Add Tag | Opens `TagCrudDialog` for creating a new tag | Functional (local state) |
| Mobile panel trigger (PanelLeft icon) | Opens tag tree sheet on mobile | Functional |

### TagDimensionsPanel Component (Left Sidebar)

**Data source:** `MOCK_TAGS` from `src/lib/mock-tags-data.ts` (33 tags, 5 dimensions).

5 collapsible dimension sections:

| Dimension | Icon | Initial State | Tags (root count) |
|-----------|------|---------------|-------------------|
| Budget Tier | DollarSign | Expanded | Budget, Mid-Range, Luxury (each with children) |
| Travel Theme | Compass | Expanded | Beach & Resort, Adventure, Cultural, Culinary, Wellness & Spa |
| Audience | Users | Expanded | Families, Couples, Solo Travelers, Groups, Business |
| Season | CalendarDays | Collapsed | Year-round, Summer, Winter, Shoulder Season |
| Accessibility | Accessibility | Collapsed | Wheelchair, Hearing, Visual, Limited Mobility |

Each tag node (`TagTreeNode`) shows: name, product count badge, expand/collapse chevron (if children), hover dropdown menu (Edit Tag, Add Child, Delete).

### TagCrudDialog Component (Modal Form)

| Field | Type | Notes |
|-------|------|-------|
| Name | Text input | Required; auto-generates code |
| Code | Text input (monospace) | Auto-generated from name via slugify, editable |
| Dimension | Select | budget_tier / travel_theme / audience / season / accessibility |
| Parent Tag | Select | Filtered to same dimension, root-level only |
| Description | Text input | Optional |

**Buttons:** Cancel, "Create Tag" / "Save Changes" (disabled if name or code empty).

### BulkTagProducts Component

Allows selecting multiple products and applying tags to all of them at once.

**Filters:** Destination select (All + specific), Category select (All + 4 categories).

**Product selection:** Via `ProductSelectionTable` — scrollable table with checkboxes, product name, destination, category badge, current tag count.

**Tag selection:** Via `TagSelector` — collapsible dimension groups, clickable tag badges (selected = navy, unselected = dimension-colored outline).

**Button:** "Apply Tags" — disabled until both products and tags are selected. Shows summary "X products × Y tags".
**Status:** **Placeholder** — logs to console; will call API.

### AiSuggestionsQueue Component

**Data source:** `MOCK_AI_SUGGESTIONS` from `src/lib/mock-tags-data.ts` (8 suggestions).

| Column | Description |
|--------|-------------|
| Checkbox | Bulk selection |
| Product | Product name |
| Suggested Tag | Badge with dimension color + tooltip showing dimension + reason |
| Confidence | Percentage, color-coded (green ≥ 70%, amber ≥ 50%, red < 50%) |
| Source | Algorithm/source name |
| Actions | Accept (green check) / Reject (red X) icon buttons |

**Bulk buttons:** Accept All Selected, Reject All Selected.
**Status:** Functional (local state updates).

---

## 2.13 Package Builder

**Route:** `/packages`
**Component:** `PackageBuilder` (`src/components/packages/package-builder.tsx`)
**Auth Required:** Yes

### Purpose
Create and configure multi-product travel packages by selecting a package type, adding component products (hotels, attractions, transfers), configuring pricing with margins, generating AI content, and submitting for approval. Maps to PRD: **Package Builder UI — create and configure packages**.

### Layout
- Default view: `PackagesTable` listing all packages + "New Package" button
- Builder view: 5-step wizard with `PackageStepper` progress bar, `PackageTypeSelector` sidebar (desktop), and step-specific content

### PackagesTable Component

**Data source:** `MOCK_PACKAGES` from `src/lib/mock-packages.ts` (4 packages).

| Column | Description |
|--------|-------------|
| Name | Package name |
| Type | Resolved from `PACKAGE_TYPE_DEFINITIONS` |
| Destination | City name |
| Status | Badge (draft/pending_approval/published) |
| From Price | Currency + display price |
| Components | Count of component products |
| Pricing | Badge: Complete (green) / Incomplete (amber) |
| Actions | "..." dropdown: Edit, Duplicate, Delete |

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| New Package | Opens 5-step builder wizard | Functional |
| Cancel | Closes builder, resets state | Functional |
| Back / Next | Step navigation with validation | Functional |
| Edit (table row) | Opens builder pre-filled with package data | Functional |
| Duplicate (table row) | Creates a copy with "(Copy)" suffix | Functional |
| Delete (table row) | Removes from local state | Functional |

### 5-Step Builder Wizard

#### Step 1: Configure (`StepConfigure`)

| Field | Type | Validation |
|-------|------|------------|
| Package Type | Selected from `PackageTypeSelector` sidebar (7 types) | Required |
| Package Name | Text input | Required, non-empty |
| Destination | Select (8 destinations) | Required |
| Duration (Nights) | Number input | Must be within type's min/max range |

**Package types:** City Explorer, Beach & Resort, Adventure, Cultural & Heritage, Family Fun, Luxury Escape, Custom.

Each type defines: component rules (min/max per category), duration constraints, suggested margin %.

#### Step 2: Components (`StepComponents`)

3 selector cards (Hotels, Attractions, Transfers) with required count indicators.

- **Hotel Selector:** Searchable list, clickable buttons, shows star rating + pricing + booking source badge. Max count from type rules.
- **Attraction Selector:** Checkbox list with count progress (e.g., "2/3-8 selected"), shows duration + pricing.
- **Transfer Selector:** Checkbox list similar to attractions.

#### Step 3: Pricing (`StepPricing`)

**4 metric cards:** Base Cost, Margin %, Floor Price, Display Price.

| Control | Type | Notes |
|---------|------|-------|
| Margin % | Number input + Slider (0-50) | Adjusts display price |
| Override Display Price | Switch toggle | When on, shows override price input |
| Override Price | Number input | Shown conditionally |

**`PricingBreakdownTable`:** Shows per-component line items (product, category, net rate, qty, subtotal) with base cost footer.

#### Step 4: Content (`StepContent`)

| Button | Action | Status |
|--------|--------|--------|
| Generate Package Content | Simulates AI content generation (2s `setTimeout`) | **Simulated** — uses random delay, no real AI call |

**After generation:** Editable fields for package name, description (textarea), day-by-day itinerary cards (day badge, title, description, activity badges), suggested tags.

#### Step 5: Review (`StepReview`)

`PackageSummaryCard` showing complete package summary: type, destination, nights/days, components by category, pricing breakdown, generated content.

| Button | Action | Status |
|--------|--------|--------|
| Save as Draft | Adds package to list with `status: "draft"` | Functional (local state) |
| Submit for Approval | Adds with `status: "pending_approval"` | Functional (local state) |

---

## 2.14 Staging Approval

**Route:** `/staging`
**Component:** `StagingApproval` (`src/components/staging/staging-approval.tsx`)
**Auth Required:** Yes

### Purpose
Review and approve batches of product changes before they are pushed to the production system. Includes diff review, spot-checking, and rollback capabilities. Maps to PRD: **Staging Approval — review before production push**.

### Tabs

| Tab | Component | Purpose |
|-----|-----------|---------|
| Pending Approval | `PendingBatches` | List of batches awaiting review |
| Push History | `PushHistoryTable` | Log of past pushes with rollback option |

### Pending Batches Tab

**Data source:** `MOCK_STAGING_BATCHES` from `src/lib/mock-staging-data.ts` (filters to `pending_approval` status).

Each batch renders as a card showing: Job ID, status badge, destination, created date, record counts (created/updated/failed), and a "Review Batch" button.

### Batch Review View (`BatchReview` Component)

Shown when a batch is selected for review.

**Header:** Batch ID, destination (MapPin), created date (Clock), job ID.

**3 diff summary cards:** New Products (green), Updated Products (blue), Failed Records (red).

**Products table (first 20 records):**

| Column | Description |
|--------|-------------|
| Product | Name + ID |
| Category | Badge |
| Change | Badge: New/Updated/Failed |
| Completeness | Progress bar + % |
| Quality | Color-coded score |
| Actions | Preview button |

**Preview panel:** Shows product details + field-by-field diffs (old value strikethrough in red → new value in green).

**Spot-check panel:** 5 randomly sampled non-failed products with inline changes.

**Approval form:**
- Review Notes textarea
- "Approve → Push to Production" button (green)
- "Reject Batch" button (red outline)

### Push History Tab

**Data source:** `MOCK_PUSH_HISTORY` from `src/lib/mock-staging-data.ts` (10 entries).

| Column | Description |
|--------|-------------|
| Batch ID | Monospace, gold |
| Destination | City |
| Environment | Badge: production (purple) / staging (cyan) |
| Status | Badge: success / failed / rolled_back |
| Records | Created/Updated/Failed counts |
| Triggered By | Name |
| Date | Formatted |
| Actions | Rollback button (for successful non-rolled-back entries) |

### Rollback Modal (`RollbackModal`)

| Field | Type | Validation |
|-------|------|------------|
| Reason | Textarea | Required |

**Buttons:** Cancel, "Confirm Rollback" (orange, disabled until reason provided).

---

## 2.15 Push History

**Route:** `/push-history`
**Component:** `PushHistoryPage` (`src/components/push-history/push-history-page.tsx`)
**Auth Required:** Yes

### Purpose
Comprehensive view of all production and staging pushes with filtering, expandable row details, CSV export, and rollback capabilities. More detailed than the staging approval push history tab. Maps to PRD: **Staging Approval / Publishing workflow history**.

### Layout
- Filters bar (date range, environment)
- Summary stats cards (4)
- Batches table with expandable rows
- Rollback history table

### Filters

| Filter | Type | Default |
|--------|------|---------|
| Date From | Date input | 30 days ago |
| Date To | Date input | Today |
| Environment | Select | All / Staging / Production |

### Summary Stats (4 Cards)

**Data source:** Computed via `computePushHistorySummary()` from `MOCK_PUSH_BATCHES`.

| Card | Description |
|------|-------------|
| Total Pushes | Count of filtered batches |
| Records Created | Sum of all `records.created` |
| Records Updated | Sum of all `records.updated` |
| Records Failed | Sum of all `records.failed` |

### Batches Table

**Data source:** `MOCK_PUSH_BATCHES` from `src/lib/mock-push-history-data.ts` (12 batches).

| Column | Description |
|--------|-------------|
| Expand chevron | Toggles inline item breakdown |
| Batch ID | Monospace gold, copy button |
| Destination | City |
| Environment | Badge: production/staging |
| Status | Badge: completed/pending_approval/failed/rolled_back/approved/in_progress/pending |
| Records | Colored inline counts |
| Triggered By | Name |
| Approved By | Name or "—" |
| Triggered At | Datetime |
| Duration | Formatted |
| Actions | "Details" link + "Rollback" button (for completed production batches) |

**Expanded row:** Sub-table showing first 10 batch items (Entity Type, Entity ID, Operation, Status, External Record ID, Error Message). "View all N items" link navigates to detail page.

**Pagination:** 10 per page, Prev/Next.

### Buttons

| Button | Action | Status |
|--------|--------|--------|
| Export CSV | Generates and downloads a CSV file | Functional (client-side CSV generation) |
| Copy Batch ID | Copies to clipboard with tooltip feedback | Functional |
| Details | Navigates to `/push-history/{batchId}` | Functional |
| Rollback | Opens `RollbackConfirmationModal` | Functional (local state) |

### Rollback History Table

**Data source:** `MOCK_ROLLBACK_HISTORY` from `src/lib/mock-push-history-data.ts` (3 rollbacks).

| Column | Description |
|--------|-------------|
| Original Batch ID | ID of the rolled-back batch |
| Destination | City |
| Initiated By | Name |
| Reason | Rollback reason text |
| Status | completed/failed badge |
| Records Affected | Count |
| Initiated At | Datetime |
| Completed At | Datetime |

---

## 2.16 Push History — Batch Detail

**Route:** `/push-history/[batchId]`
**Component:** `BatchDetailPage` (`src/components/push-history/batch-detail-page.tsx`)
**Auth Required:** Yes

### Purpose
Deep-dive into a specific push batch with full item listing, diff summaries, approval workflow, and rollback initiation.

### Layout
- Breadcrumb: Push History → Batch ID
- Header with metadata and status
- 4 stats cards
- Collapsible diff summary panel
- Items table with pagination
- Approval section (for pending batches)
- Rollback section (for completed production batches)

### Header
Batch ID (monospace gold with copy button), status badge, environment badge, destination, triggered by, triggered at, duration, approved by.

### Stats Cards (4)
Created, Updated, Failed, Skipped counts.

### Diff Summary Panel (Collapsible)
- **New Products:** List of product name badges
- **Updated Products:** Per-product cards with field-level diffs (field name, old value strikethrough → new value)
- **Failed Records:** Per-record cards with error messages

### Items Table

| Column | Description |
|--------|-------------|
| Entity Type | Product/Package/etc. |
| Product Name | Name text |
| Operation | create/update badge |
| Status | success/failed/skipped badge |
| External Record ID | Monospace or "—" |
| Error Message | Text or "—" |
| Action | Retry button for failed items |

**Pagination:** 50 per page.

### Conditional Sections

**If `pending_approval`:**
- Approval Notes textarea
- "Approve & Push to Production" button (emerald)
- "Reject Batch" button (outline destructive)

**If `completed` and `production`:**
- "Initiate Rollback" button → opens `RollbackConfirmationModal`

### RollbackConfirmationModal

| Field | Validation |
|-------|------------|
| Reason textarea | Minimum 20 characters, shows countdown |
| "I understand..." checkbox | Must be checked |

**Buttons:** Cancel, "Confirm Rollback" (red, disabled until reason ≥ 20 chars + checkbox checked).

---

## 2.17 Monitoring & Alerts

**Route:** `/monitoring`
**Component:** `MonitoringDashboard` (`src/components/monitoring/monitoring-dashboard.tsx`)
**Auth Required:** Yes

### Purpose
System health monitoring covering booking source availability, queue depths, error tracking, data freshness, and job throughput metrics. Maps to PRD: **Monitoring & Alerts — health, freshness, errors**.

### Layout (4 Rows)
1. `SourceHealthCards` — responsive grid of health status cards
2. `QueueLengthsChart` — bar chart of queue depths over time
3. `ErrorQueueTable` — actionable error table
4. `FreshnessHeatmap` + `JobMetricsChart` — two-column grid

### SourceHealthCards Component

**Data source:** `MOCK_SOURCE_HEALTH` from `src/lib/mock-monitoring-data.ts` (6 sources).

Per card: status dot (green/amber/red), source name, 4 metrics (Status label, Last Check relative time, Response time ms, Uptime %).

| Button | Action | Status |
|--------|--------|--------|
| Check Now | Simulates health check (updates response time + timestamp) | Functional (local state simulation) |

### QueueLengthsChart Component

**Data source:** `MOCK_QUEUE_LENGTHS` from `src/lib/mock-monitoring-data.ts` (12 points, auto-updated every 10 seconds).

Stacked bar chart (Recharts) with 4 queues: Queue A, Queue B, Enrichment, Error. Custom tooltip. Data auto-updates via `setInterval` with random walk simulation.

### ErrorQueueTable Component

**Data source:** `MOCK_ERROR_QUEUE` from `src/lib/mock-monitoring-data.ts` (8 errors).

| Column | Description |
|--------|-------------|
| Stage | Badge: ingestion/classification/enrichment/content_generation/staging |
| Entity | Type + ID (monospace) |
| Error Code | Monospace code badge |
| Message | Error text (2-line clamp) |
| Retries | Count |
| Status | Badge: open/retrying/resolved/dismissed |
| Assigned To | Name or "—" |
| Actions | Resolve/Dismiss buttons (for active errors) |

| Button | Action | Status |
|--------|--------|--------|
| Resolve (green check) | Marks error as "resolved" | Functional (local state) |
| Dismiss (X) | Marks error as "dismissed" | Functional (local state) |

### FreshnessHeatmap Component

Same component as the dashboard's `DataFreshnessHeatmap` but rendered within the monitoring page. 7 destinations × 5 data types color-coded grid.

### JobMetricsChart Component

**Data source:** `MOCK_JOB_METRICS` from `src/lib/mock-monitoring-data.ts` (30 days).

Area chart (Recharts) showing "Records Processed per Day (Last 30 Days)" with gradient fill. Custom tooltip on hover.

---

## 2.18 User Management

**Route:** `/users`
**Component:** `UserManagement` (`src/components/users/user-management.tsx`)
**Auth Required:** Yes, **Admin only** (non-admins see "Access Denied" card)

### Purpose
Manage system users: invite new users, assign/modify roles, suspend/deactivate accounts, reset passwords, and view activity. Maps to PRD: system administration.

### Layout
- Header with search + "Invite User" button
- 4 stat cards
- Users table
- Collapsible roles reference section
- Invite dialog + Edit drawer

### Stats Cards (4)

| Card | Description |
|------|-------------|
| Total Users | Count from API |
| Active Users | Users with `status: "active"` |
| Pending Invitations | Users with `status: "invited"` |
| Roles in Use | Distinct roles across all users |

### Users Table

**Data source:** `useUsers()` API hook (falls back to `MOCK_USERS` with 10 users during development).

| Column | Description |
|--------|-------------|
| User | Avatar + full name + email |
| Roles | Badge(s): admin (red), product_manager (blue), content_reviewer (green), classification_reviewer (purple), read_only (gray) |
| Status | Badge: active (green), inactive (gray), suspended (red) |
| Last Login | Relative time or "Never" |
| Created At | Formatted date |
| Actions | Edit, Suspend, Deactivate, Reset Password (dropdown) |

**Per-row actions:**

| Action | Icon | Condition | Effect |
|--------|------|-----------|--------|
| Edit | Pencil | Always | Opens edit drawer |
| Suspend | Ban | Active users only | Sets status to "suspended" |
| Deactivate | UserX | Non-inactive users | Sets status to "inactive" |
| Reset Password | Key | Always | Triggers password reset API |

### Roles Reference (Collapsible)

| Role | Access Level | Screens Accessible | Write Permissions |
|------|-------------|-------------------|-------------------|
| admin | Full System Access | All screens | All write operations |
| product_manager | Product Operations | Dashboard, Destinations, Ingestion, Products, Attributes, Booking Sources, Tags, Packages, Staging | Create/edit products, trigger jobs, approve batches |
| content_reviewer | Content Review | Dashboard, Review Queue B, Products (read) | Approve/reject content |
| classification_reviewer | Classification Review | Dashboard, Review Queue A, Products (read) | Approve/escalate classifications |
| read_only | Read-Only Access | Dashboard, Products (read), Monitoring | No write permissions |

### Invite User Dialog

| Field | Type | Notes |
|-------|------|-------|
| Full Name | Text | Required |
| Email Address | Email | Required |
| Assign Role(s) | Checkboxes | 5 roles with descriptions |

**Note:** "An email will be sent with a secure login link valid for 48 hours."
**Buttons:** Cancel, "Send Invitation".

### Edit User Drawer (Sheet)

| Field | Type | Notes |
|-------|------|-------|
| Full Name | Text | Editable |
| Email | Text | Disabled |
| Status | Select | Active/Inactive/Suspended |
| Roles | Badge list with X remove + "Add role..." select | Multi-role support |

**Buttons:** Save Changes, Reset Password, Deactivate (destructive).

---

## 2.19 System Settings

**Route:** `/settings`
**Component:** `SystemSettings` (`src/components/settings/system-settings.tsx`)
**Auth Required:** Yes, **Admin only**

### Purpose
Configure system-wide settings including pipeline thresholds, data freshness rules, package type rules, API integrations, notification routing, and API audit logs.

### Tabs (6)

#### Tab 1: General (`GeneralSettingsTab`)

**Data source:** `MOCK_GENERAL_SETTINGS` from `src/lib/mock-settings-data.ts`.

**System Identity Card:**

| Field | Type | Default |
|-------|------|---------|
| System Name | Text | "Rayna Tours Product Automation" |
| Default Currency | Select (10 options) | AED |
| Default Timezone | Select (9 options) | Asia/Dubai |
| Default Language | Select (7 options) | English |

**Pipeline Defaults Card:**

| Field | Type | Default |
|-------|------|---------|
| Auto-classify confidence threshold | Slider (0-1) | 0.9 |
| Human review confidence threshold | Slider (0-1) | 0.7 |
| Scraping confidence minimum | Slider (0-1) | 0.7 |
| Content review sampling rate % | Number | 25 |
| Max content regeneration attempts | Number | 3 |

**Ingestion Defaults Card:**

| Field | Type | Default |
|-------|------|---------|
| Intelligence filter auto-proceed timeout (hours) | Number | 24 |
| Max records per ingestion job/min | Number | 100 |
| Max retry attempts for failed records | Number | 3 |

**Button:** "Save General Settings" — **Placeholder**, logs to console.

#### Tab 2: Data Freshness (`DataFreshnessTab`)

**Data source:** `MOCK_FRESHNESS_RULES` from `src/lib/mock-settings-data.ts` (6 rules).

| Data Type | Threshold (hours) | Stale Action |
|-----------|-------------------|--------------|
| hotel_pricing | 48h | Flag for review |
| attraction_prices | 72h | Flag for review |
| operating_hours | 168h (7 days) | Schedule re-scrape |
| descriptions | 720h (30 days) | Log warning |
| images | 2,160h (90 days) | Log warning |
| geolocation | 4,320h (180 days) | No action |

Inline editing per row (pencil icon → threshold number input + stale action select).

**Button:** "Save Freshness Rules" — **Placeholder**.

#### Tab 3: Package Rules (`PackageRulesTab`)

**Data source:** `MOCK_PACKAGE_TYPES` from `src/lib/mock-settings-data.ts` (7 types).

**Package Types Table:**

| Column | Description |
|--------|-------------|
| Type Name | Package type label |
| Code | Slug identifier |
| Default Margin % | Number |
| Min Nights | Number |
| Max Nights | Number |
| Active | Switch toggle |
| Rules | "Edit Rules" button |

**Rule Editor Dialog:** Visual editor (number inputs + switches for min/max per category, requires_booking_source, requires_tag_match) or Raw JSON editor (textarea). Version history select to load previous versions. "Save as New Version" button.

**Package Pricing Defaults:** Default Margin %, Floor Margin %, Currency Code.

#### Tab 4: API Integrations (`ApiIntegrationsTab`)

**Data source:** `MOCK_API_INTEGRATIONS` from `src/lib/mock-settings-data.ts` (8 integrations).

Per integration card: name, status badge (Connected/Not Configured/Error), last successful call, expand/collapse chevron, "Test" button.

**Integrations:** Booking.com, Viator, GetYourGuide, Google Places, Ahrefs, Anthropic (Claude), Apify, Bright Data.

Expanded config shows dynamic fields driven by `configFields` array (text, password, number, select, toggle types).

**Buttons:** "Test" (simulates 1.5s connection test), "Save Configuration" — both **placeholder**.

#### Tab 5: Notifications (`NotificationsTab`)

**Data source:** `MOCK_NOTIFICATION_RULES` from `src/lib/mock-settings-data.ts` (9 rules).

**Rules Table:**

| Column | Description |
|--------|-------------|
| Event Type | Descriptive name |
| Notify Role(s) | Role name(s) |
| Channel | In-App / Email badges |
| Active | Switch toggle |

**Email Sender Configuration:** From Name, From Email inputs. "Send Test Email" button.

#### Tab 6: API Audit Log (`ApiAuditLogTab`)

**Data source:** `MOCK_AUDIT_RECORDS` from `src/lib/mock-settings-data.ts` (5 records).

Status banner: green if all passed, amber if any pending/failed.

**Audit Records Table:**

| Column | Description |
|--------|-------------|
| System Name | Integration name |
| Env | Production/Staging/Development |
| Bulk Upsert | Status icon |
| Idempotency | Status icon |
| Rollback | Status icon |
| Staging | Status icon |
| Status | Colored badge |
| Reviewed By | Name |
| Date | Formatted |
| Notes | Text |

**Button:** "Add Audit Record" — opens form dialog.

---

## 2.20 Profile

**Route:** `/profile`
**Component:** `MyProfile` (`src/components/profile/my-profile.tsx`)
**Auth Required:** Yes

### Purpose
View and edit personal information, manage security (password, sessions, 2FA), configure UI and notification preferences, and review personal activity log.

### Layout
- Header with "Save Changes" button
- Two-column: `ProfileCard` (left) + tabbed content (right)

### ProfileCard Component
Avatar (with upload/delete hover overlay), name, email, role badges, status badge, member-since date, last login, quick stats (Queue A Reviewed: 142, Queue B Reviewed: 87, Products Approved: 312, Jobs Triggered: 56).

**Avatar interactions:** Click to upload (max 5MB, JPEG/PNG/WebP/GIF accepted), hover delete button when image exists. Uses `useUploadProfilePicture()` and `useDeleteProfilePicture()` hooks.

### Tabs (4)

#### Tab 1: Personal Info (`PersonalInfoTab`)

| Field | Type | Notes |
|-------|------|-------|
| Full Name | Text | Required |
| Email | Text | Disabled — "Contact an Admin to change" |
| Job Title | Text | — |
| Department | Select | 7 options |
| Phone Number | Tel | — |
| Timezone | Select | Uses `TIMEZONE_OPTIONS` |
| Language | Select | Uses `LANGUAGE_OPTIONS` |

#### Tab 2: Security (`SecurityTab`)

**Change Password form:**

| Field | Type |
|-------|------|
| Current Password | Password (with show/hide) |
| New Password | Password (with show/hide) |
| Confirm New Password | Password (with show/hide) |

**Password strength meter:** Progress bar + label (Weak/Fair/Strong/Very Strong). 5 validation rules: 8+ chars, uppercase, lowercase, number, special char.

**Active Sessions Table:**

| Column | Description |
|--------|-------------|
| Device | Icon (Smartphone/Laptop/Monitor) + device name |
| Browser | Browser name |
| IP Address | IP text |
| Location | City, Country |
| Last Active | Relative time |
| Action | "This device" badge or "Revoke" button |

**Buttons:** "Update Password", "Revoke" per session, "Sign out all other devices".

**2FA Section:** "Enable Two-Factor Authentication" button — disabled with "Coming Soon" badge. **Not implemented.**

#### Tab 3: Preferences (`PreferencesTab`)

**Notification Preferences Table:** 8 notification events with In-App and Email switch toggles.

**UI Preferences:**
- Sidebar default collapsed (switch)
- Default product view (Grid/Table select)
- Date format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD select)
- Items per page (25/50/100 select)
- Theme (Light/Dark/System clickable cards)

#### Tab 4: Activity Log (`ActivityTab`)

Filterable, paginated timeline of the user's recent actions.

**Filters:** Action type select (10 types), Date From/To inputs.
**Pagination:** 5 items per page.

Each entry: colored icon, action badge, relative timestamp with tooltip, action description, entity text.

**Data source:** `useMyActivity()` API hook. Currently uses static data. In production, will be populated from the audit log API.

---

# 3. COMPONENT LIBRARY DOCUMENTATION

## UI Primitives (`src/components/ui/`)

These are Radix UI components wrapped with Tailwind CSS styling following the shadcn/ui "new-york" style convention.

| Component | File | Props | Used By |
|-----------|------|-------|---------|
| `Avatar` | `ui/avatar.tsx` | `AvatarImage`, `AvatarFallback` wrappers | ProfileCard, Header, Sidebar, UserManagement |
| `Badge` | `ui/badge.tsx` | `variant` (default/secondary/destructive/outline) via CVA | Everywhere (status indicators, category labels, tags) |
| `Button` | `ui/button.tsx` | `variant` (default/destructive/outline/secondary/ghost/link), `size` (default/sm/lg/icon) | All interactive screens |
| `Card` | `ui/card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | All dashboard cards, forms |
| `Checkbox` | `ui/checkbox.tsx` | Standard Radix checkbox | Tables (row selection), forms |
| `Dialog` | `ui/dialog.tsx` | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` | CRUD modals, confirmation dialogs |
| `DropdownMenu` | `ui/dropdown-menu.tsx` | Full Radix dropdown menu suite | Table row actions, header avatar menu |
| `Input` | `ui/input.tsx` | Standard HTML input wrapper | All forms |
| `Label` | `ui/label.tsx` | Radix label | All forms |
| `Progress` | `ui/progress.tsx` | `value` (0-100) | Completeness bars, password strength |
| `ScrollArea` | `ui/scroll-area.tsx` | Radix scroll area | Sidebar, long lists |
| `Select` | `ui/select.tsx` | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` | All dropdowns |
| `Separator` | `ui/separator.tsx` | Standard divider | Lists, sections |
| `Sheet` | `ui/sheet.tsx` | `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetClose` | Mobile sidebar, review modals, drawers |
| `Slider` | `ui/slider.tsx` | `min`, `max`, `step`, `value`, `onValueChange` | Filters, pricing, settings thresholds |
| `Sonner` | `ui/sonner.tsx` | Sonner toaster wrapper | Root layout (global) |
| `Switch` | `ui/switch.tsx` | Standard toggle switch | Settings, filters, preferences |
| `Table` | `ui/table.tsx` | `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`, `TableFooter` | All data tables |
| `Tabs` | `ui/tabs.tsx` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Multi-tab screens |
| `Textarea` | `ui/textarea.tsx` | Standard textarea wrapper | Content editing, review notes |
| `Tooltip` | `ui/tooltip.tsx` | `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | Collapsed sidebar, table actions |

## Layout Components (`src/components/layout/`)

| Component | File | Props | Description |
|-----------|------|-------|-------------|
| `Header` | `layout/header.tsx` | None | Top bar with mobile menu, search, notifications, user dropdown |
| `Sidebar` | `layout/sidebar.tsx` | None | Desktop sidebar with navigation, collapse toggle, user info |
| `MobileSidebar` | `layout/mobile-sidebar.tsx` | None | Mobile variant (always expanded, links close Sheet) |
| `LogoutConfirmDialog` | `layout/logout-confirm-dialog.tsx` | `open: boolean`, `onOpenChange: (open: boolean) => void` | Logout confirmation dialog |

## Feature Components (Summary)

| Module | Component Count | Key Components |
|--------|----------------|----------------|
| Dashboard | 7 | `StatCards`, `PipelineHealth`, `RecentJobsTable`, `DataFreshnessHeatmap`, `BookingSourceHealth`, `ProductsByDestinationChart`, `ProductsByCategoryChart` |
| Destinations | 4 | `DestinationsGrid`, `DestinationCard`, `AddDestinationDialog`, `IntelligenceSummarySheet` |
| Ingestion | 5 | `IngestionMonitor`, `ActiveJobsSection`, `ActiveJobCard`, `JobDetailSheet`, `JobHistoryTable` |
| Classification | 7 | `ClassificationQueue`, `ClassificationStats`, `ClassificationFilters`, `ClassificationTable`, `RecordReviewModal`, `ConfidenceGauge`, `JsonViewer` |
| Content Review | 6 | `ContentQueue`, `ContentStats`, `ContentFilters`, `ContentTable`, `ContentReviewModal`, `ContentTabPanel` |
| Products | 14 | `ProductBrowser`, `ProductCard`, `ProductDetail`, `ProductFilters`, `ProductGrid`, `ProductTable`, plus 8 tab components |
| Attributes | 8 | `AttributeEditor`, `ProductSelector`, `HotelForm`, `AttractionForm`, `TransferForm`, `RestaurantForm`, `BulkEditPanel`, `EnrichmentQueue` |
| Booking Sources | 4 | `BookingSourceMapper`, `SourceDirectory`, `ProductMappings`, `HealthMonitor` |
| Tags | 8 | `TagManager`, `TagDimensionsPanel`, `TagTreeNode`, `TagCrudDialog`, `TagSelector`, `BulkTagProducts`, `ProductSelectionTable`, `AiSuggestionsQueue` |
| Packages | 15 | `PackageBuilder`, `PackageStepper`, `PackagesTable`, `PackageTypeSelector`, `PackageTypeCard`, `PackageSummaryCard`, `PricingBreakdownTable`, 3 selectors, 5 step components |
| Staging | 5 | `StagingApproval`, `PendingBatches`, `BatchReview`, `PushHistoryTable`, `RollbackModal` |
| Push History | 3 | `PushHistoryPage`, `BatchDetailPage`, `RollbackConfirmationModal` |
| Monitoring | 7 | `MonitoringDashboard`, `SourceHealthCards`, `QueueLengthsChart`, `ErrorQueueTable`, `FreshnessHeatmap`, `JobMetricsChart`, `NotificationsDrawer` |
| Settings | 7 | `SystemSettings`, `GeneralSettingsTab`, `DataFreshnessTab`, `PackageRulesTab`, `ApiIntegrationsTab`, `NotificationsTab`, `ApiAuditLogTab` |
| Profile | 6 | `MyProfile`, `ProfileCard`, `PersonalInfoTab`, `SecurityTab`, `PreferencesTab`, `ActivityTab` |
| Users | 1 | `UserManagement` |
| Login | 1 | `LoginForm` |

---

# 4. STATIC DATA DOCUMENTATION

| Mock Data File | Exported Constants | Record Count | Real API Equivalent | Consumed By |
|---------------|-------------------|-------------|---------------------|-------------|
| `mock-dashboard-data.ts` | `MOCK_KPI_STATS`, `MOCK_PIPELINE_STAGES`, `MOCK_RECENT_JOBS`, `MOCK_FRESHNESS_DATA`, `MOCK_BOOKING_SOURCES`, `MOCK_PRODUCTS_BY_DESTINATION`, `MOCK_PRODUCTS_BY_CATEGORY` | 7 exports | `GET /api/v1/dashboard/summary` | Dashboard page (7 widgets) |
| `mock-destinations-data.ts` | `MOCK_DESTINATIONS`, `MOCK_INTELLIGENCE_SUMMARIES`, `COUNTRY_OPTIONS` | 8 destinations, 4 summaries | `GET /api/v1/destinations`, `GET /api/v1/destinations/{id}/intelligence` | Destinations page |
| `mock-ingestion-data.ts` | `MOCK_ACTIVE_JOBS`, `MOCK_JOB_HISTORY` | 2 active + 14 history | `GET /api/v1/ingestion/jobs`, `GET /api/v1/ingestion/jobs/active` | Ingestion Monitor |
| `mock-classification-data.ts` | `MOCK_CLASSIFICATION_STATS`, `MOCK_CLASSIFICATION_RECORDS` | 18 records | `GET /api/v1/classification/queue`, `GET /api/v1/classification/stats` | Review Queue A |
| `mock-content-data.ts` | `MOCK_CONTENT_STATS`, `MOCK_CONTENT_RECORDS` | 15 records | `GET /api/v1/content/queue`, `GET /api/v1/content/stats` | Review Queue B |
| `mock-products.ts` | `MOCK_PRODUCTS` | 20 products | `GET /api/v1/products`, `GET /api/v1/products/{id}` | Product Browser, Product Detail |
| `mock-attributes.ts` | `MOCK_ATTRIBUTE_PRODUCTS`, `MOCK_ENRICHMENT_QUEUE` | 17 products, 12 queue entries | `GET /api/v1/attributes/{category}`, `GET /api/v1/enrichment/queue` | Attribute Editor |
| `mock-booking-sources.ts` | `MOCK_BOOKING_SOURCES`, `MOCK_PRODUCT_MAPPINGS`, `MOCK_HEALTH_LOGS`, `MOCK_SOURCE_HEALTH_CARDS`, `MOCK_INGESTION_SOURCES`, `MOCK_DESTINATIONS` | 10 sources, 15 mappings, 20 logs, 7 health cards | `GET /api/v1/booking-sources`, `GET /api/v1/booking-sources/mappings`, `GET /api/v1/booking-sources/health` | Booking Source Mapper (3 tabs) |
| `mock-tags-data.ts` | `MOCK_TAGS`, `MOCK_AI_SUGGESTIONS`, `buildTagTree()` | 33 tags, 8 suggestions | `GET /api/v1/tags`, `GET /api/v1/tags/suggestions` | Tag Manager |
| `mock-packages.ts` | `PACKAGE_TYPE_DEFINITIONS`, `MOCK_PACKAGES`, `STEP_DEFINITIONS`, `DESTINATIONS`, `INITIAL_BUILDER_STATE`, status maps | 7 types, 4 packages | `GET /api/v1/packages`, `GET /api/v1/package-types` | Package Builder |
| `mock-staging-data.ts` | `MOCK_STAGING_BATCHES`, `MOCK_PUSH_HISTORY` | 6 batches, 10 history entries | `GET /api/v1/staging/batches`, `GET /api/v1/staging/push-history` | Staging Approval |
| `mock-push-history-data.ts` | `MOCK_PUSH_BATCHES`, `MOCK_ROLLBACK_HISTORY`, `computePushHistorySummary()` | 12 batches, 3 rollbacks | `GET /api/v1/push-history`, `GET /api/v1/push-history/{batchId}` | Push History |
| `mock-monitoring-data.ts` | `MOCK_SOURCE_HEALTH`, `MOCK_QUEUE_LENGTHS`, `MOCK_ERROR_QUEUE`, `MOCK_JOB_METRICS`, `MOCK_NOTIFICATIONS` | 6 sources, 12 queue points, 8 errors, 30 metric days, 8 notifications | `GET /api/v1/monitoring/*` | Monitoring & Alerts |
| `mock-settings-data.ts` | `MOCK_GENERAL_SETTINGS`, `MOCK_FRESHNESS_RULES`, `MOCK_PACKAGE_TYPES`, `MOCK_PACKAGE_PRICING`, `MOCK_API_INTEGRATIONS`, `MOCK_NOTIFICATION_RULES`, `MOCK_EMAIL_CONFIG`, `MOCK_AUDIT_RECORDS` + dropdown options | 8 exports | `GET /api/v1/settings/*` | System Settings (6 tabs) |
| `mock-profile-data.ts` | `MOCK_PERSONAL_INFO`, `MOCK_PROFILE_STATS`, `MOCK_NOTIFICATION_PREFERENCES`, `MOCK_UI_PREFERENCES`, `MOCK_PROFILE_ACTIVITY` + dropdown options | 18 activity entries | `GET /api/v1/profile`, `GET /api/v1/profile/activity` | Profile page |
| `mock-users.ts` | `MOCK_USERS`, `MOCK_ROLE_HISTORY`, `MOCK_USER_ACTIVITY` | 10 users, 7 role history, 14 activity | `GET /api/v1/users`, `GET /api/v1/users/{id}` | User Management |

---

# 5. STATE MANAGEMENT DOCUMENTATION

## Global State (Zustand)

### `useSidebarStore` (`src/store/sidebar-store.ts`)

| State | Type | Default | Trigger |
|-------|------|---------|---------|
| `collapsed` | boolean | `false` | `toggle()` called from sidebar collapse button |

Used by: `Sidebar`, `MobileSidebar` components.

### `exampleStore` (`src/store/example-store.ts`)
Scaffold/template file — not used in production.

## Server State (TanStack React Query)

### Query Keys (`src/hooks/api/query-keys.ts`)
Centralized key factory for cache management:
- `queryKeys.auth.session` — current session
- `queryKeys.users.list(params)` — paginated user list
- `queryKeys.users.detail(id)` — single user
- `queryKeys.profile.me` — current user profile
- `queryKeys.profile.activity(params)` — activity log
- `queryKeys.sessions.list` — active sessions

### API Hooks (`src/hooks/api/`)

| Hook | File | Purpose |
|------|------|---------|
| `useApiClient` | `use-api-client.ts` | Creates an Axios-like fetch wrapper with auth token injection from NextAuth session |
| `useLogin` | `use-auth.ts` | `signIn("credentials", ...)` mutation |
| `useLogout` | `use-auth.ts` | `signOut({ callbackUrl: "/login" })` mutation, clears React Query cache |
| `useCurrentUser` | `use-profile.ts` | Fetches `GET /api/v1/users/me`, transforms via `transformUserResponse` |
| `useUpdateProfile` | `use-profile.ts` | `PATCH /api/v1/users/me` mutation, invalidates profile cache |
| `useUploadProfilePicture` | `use-profile.ts` | `POST /api/v1/users/me/profile-picture` (multipart), updates session |
| `useDeleteProfilePicture` | `use-profile.ts` | `DELETE /api/v1/users/me/profile-picture`, updates session |
| `useChangePassword` | `use-profile.ts` | `POST /api/v1/auth/change-password` mutation |
| `useMyActivity` | `use-profile.ts` | `GET /api/v1/users/me/audit-logs` with pagination, transforms via `transformAuditLogToActivity` |
| `useUsers` | `use-users.ts` | `GET /api/v1/users` with search + pagination, transforms via `transformPaginatedResponse` |
| `useInviteUser` | `use-users.ts` | `POST /api/v1/users/invite` mutation |
| `useUpdateUser` | `use-users.ts` | `PATCH /api/v1/users/{id}` mutation |
| `useResetUserPassword` | `use-users.ts` | `POST /api/v1/users/{id}/reset-password` mutation |
| `useSessions` | `use-sessions.ts` | `GET /api/v1/sessions` query |
| `useRevokeSession` | `use-sessions.ts` | `DELETE /api/v1/sessions/{id}` mutation |
| `useRevokeAllSessions` | `use-sessions.ts` | `POST /api/v1/sessions/revoke-all` mutation |

## Component-Level State

Most screens manage state locally via `useState` within their top-level component. State patterns:

| Pattern | Examples |
|---------|---------|
| List + filters + pagination | ProductBrowser, ClassificationQueue, ContentQueue, UserManagement, PushHistoryPage |
| CRUD with dialog/drawer | SourceDirectory, TagManager, UserManagement |
| Multi-step wizard | PackageBuilder (5 steps), ProductMappings bulk assign (5 steps) |
| Expand/collapse | AttributeEditor forms, TagDimensionsPanel, Settings sections |
| View/edit mode toggle | ProductDetail, AttributeEditor |
| Selection state (single/multi) | ProductSelector, ClassificationTable, AiSuggestionsQueue |

## Authentication State

Managed by NextAuth.js via `SessionProvider`. Accessed via `useSession()` hook. Session contains:
- `user.id`, `user.email`, `user.fullName`, `user.name`
- `user.roles` (string array)
- `user.status` (active/inactive/suspended)
- `user.profilePictureUrl` (nullable)

JWT tokens auto-refresh when within 5 minutes of expiry. Session max age: 24 hours.

---

# 6. NAVIGATION & ROUTING

## Complete Route Table

| Route | Page Component | Primary Component | Auth | Admin |
|-------|---------------|-------------------|------|-------|
| `/` | `app/page.tsx` | Inline `Home` (landing page) | No | No |
| `/login` | `app/login/page.tsx` | `LoginForm` | No | No |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | 7 dashboard widgets | Yes | No |
| `/destinations` | `app/(dashboard)/destinations/page.tsx` | `DestinationsGrid` | Yes | No |
| `/ingestion` | `app/(dashboard)/ingestion/page.tsx` | `IngestionMonitor` | Yes | No |
| `/review-classification` | `app/(dashboard)/review-classification/page.tsx` | `ClassificationQueue` | Yes | No |
| `/review-content` | `app/(dashboard)/review-content/page.tsx` | `ContentQueue` | Yes | No |
| `/products` | `app/(dashboard)/products/page.tsx` | `ProductBrowser` | Yes | No |
| `/products/[id]` | `app/(dashboard)/products/[id]/page.tsx` | `ProductDetail` | Yes | No |
| `/attributes` | `app/(dashboard)/attributes/page.tsx` | `AttributeEditor` | Yes | No |
| `/booking-sources` | `app/(dashboard)/booking-sources/page.tsx` | `BookingSourceMapper` | Yes | No |
| `/tags` | `app/(dashboard)/tags/page.tsx` | `TagManager` | Yes | No |
| `/packages` | `app/(dashboard)/packages/page.tsx` | `PackageBuilder` | Yes | No |
| `/staging` | `app/(dashboard)/staging/page.tsx` | `StagingApproval` | Yes | No |
| `/push-history` | `app/(dashboard)/push-history/page.tsx` | `PushHistoryPage` | Yes | No |
| `/push-history/[batchId]` | `app/(dashboard)/push-history/[batchId]/page.tsx` | `BatchDetailPage` | Yes | No |
| `/monitoring` | `app/(dashboard)/monitoring/page.tsx` | `MonitoringDashboard` | Yes | No |
| `/users` | `app/(dashboard)/users/page.tsx` | `UserManagement` | Yes | **Yes** |
| `/settings` | `app/(dashboard)/settings/page.tsx` | `SystemSettings` | Yes | **Yes** |
| `/profile` | `app/(dashboard)/profile/page.tsx` | `MyProfile` | Yes | No |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | NextAuth handler | — | — |

## Route Protection

**Middleware** (`src/middleware.ts`): Uses `withAuth` from `next-auth/middleware`. All dashboard routes are protected — unauthenticated users are redirected to `/login`.

**Admin gating**: `/users` and `/settings` pages include client-side `useIsAdmin()` checks that inspect `session.user.roles` for `"admin"`. Non-admins see an "Access Denied" card.

## Sidebar Active State

Active link determined by comparing `pathname` against `item.href` — exact match or `pathname.startsWith(item.href + "/")`. Active items get: `bg-navy-light text-white border-l-2 border-gold`.

## Layout Structure

```
RootLayout (fonts, Providers, Toaster)
├── / (landing page - no sidebar/header)
├── /login (no sidebar/header)
└── (dashboard)/layout.tsx
    ├── Sidebar (desktop, hidden on mobile)
    ├── Header (with mobile menu trigger)
    └── <main>{children}</main>
```

---

# 7. PRD TRACEABILITY TABLE

| UI Element | Screen | PRD Module | Business Purpose |
|-----------|--------|------------|-----------------|
| StatCards (4 KPIs) | Dashboard | Destination Dashboard | At-a-glance pipeline health: total products, active jobs, review queue depths |
| PipelineHealth chart | Dashboard | Destination Dashboard | Visualize record flow through 7 pipeline stages |
| RecentJobsTable | Dashboard | Ingestion Monitor | Quick view of latest ingestion runs without leaving dashboard |
| DataFreshnessHeatmap | Dashboard | Monitoring & Alerts | Identify stale data across destinations and data types |
| BookingSourceHealth list | Dashboard | Monitoring & Alerts | Monitor source API availability |
| Products by Destination/Category charts | Dashboard | Destination Dashboard | Product distribution insights |
| DestinationsGrid + Cards | Destinations | Destination Dashboard | Manage destinations, trigger ingestion, view intelligence |
| AddDestinationDialog | Destinations | Destination Dashboard | Onboard new destination cities |
| IntelligenceSummarySheet | Destinations | Destination Dashboard | Review SEO keywords and approved data sources per destination |
| ActiveJobsSection + Cards | Ingestion Monitor | Ingestion Monitor | Real-time progress of running ingestion jobs |
| JobHistoryTable | Ingestion Monitor | Ingestion Monitor | Historical log of all ingestion runs |
| ClassificationStats + Table | Review Queue A | Review Queue A — Classification | Human review of low-confidence AI classifications |
| RecordReviewModal | Review Queue A | Review Queue A — Classification | Detailed record inspection with approve/escalate workflow |
| ConfidenceGauge | Review Queue A | Review Queue A — Classification | Visual confidence score indicator |
| ContentStats + Table | Review Queue B | Review Queue B — Content | Human review of AI-generated product content |
| ContentReviewModal + Tabs | Review Queue B | Review Queue B — Content | Side-by-side content review with approve/reject workflow |
| ProductBrowser (search, filters, grid/table) | Product Browser | Product Browser | Browse and filter entire product catalogue |
| ProductDetail (8 tabs) | Product Detail | Product Browser + Attribute Editor | Complete product view and inline editing |
| AttributeEditor (4 category forms) | Attribute Editor | Attribute Editor | Category-specific attribute management |
| ProductSelector + Filters | Attribute Editor | Attribute Editor | Find and select products for editing |
| HotelForm (9 sections) | Attribute Editor | Attribute Editor | Hotel-specific fields: star rating, rooms, amenities, etc. |
| AttractionForm (8 sections) | Attribute Editor | Attribute Editor | Attraction fields: duration, tickets, operating hours |
| TransferForm (7 sections) | Attribute Editor | Attribute Editor | Transfer fields: route, vehicle, capacity, features |
| RestaurantForm (4 sections) | Attribute Editor | Attribute Editor | Restaurant fields: cuisine, price range, hours |
| BulkEditPanel | Attribute Editor | Attribute Editor | Apply changes to multiple products simultaneously |
| EnrichmentQueue drawer | Attribute Editor | Attribute Editor | Track products with missing required fields |
| SourceDirectory (CRUD table) | Booking Source Mapper | Booking Source Mapper | Manage booking source records and configurations |
| ProductMappings table | Booking Source Mapper | Booking Source Mapper | Assign Source 1/2/3 per product |
| Bulk Assign wizard (5 steps) | Booking Source Mapper | Booking Source Mapper | Mass-assign sources to products |
| HealthMonitor (cards + sparklines + logs) | Booking Source Mapper | Booking Source Mapper + Monitoring | Real-time source API health monitoring |
| TagDimensionsPanel (tree) | Tag Manager | Tag Manager | Hierarchical tag taxonomy management |
| TagCrudDialog | Tag Manager | Tag Manager | Create/edit tags with parent-child relationships |
| BulkTagProducts | Tag Manager | Tag Manager | Apply tags to multiple products at once |
| AiSuggestionsQueue | Tag Manager | Tag Manager | Review and accept/reject AI-suggested tags |
| PackagesTable | Package Builder | Package Builder UI | List all created packages |
| 5-step builder wizard | Package Builder | Package Builder UI | Create packages: configure → components → pricing → content → review |
| PackageTypeSelector | Package Builder | Package Builder UI | Choose from 7 predefined package types |
| Component selectors (Hotel/Attraction/Transfer) | Package Builder | Package Builder UI | Add products to a package |
| Pricing controls (margin, override) | Package Builder | Package Builder UI | Configure package pricing with margins |
| AI content generation | Package Builder | Package Builder UI | Generate package descriptions and itineraries |
| PendingBatches + BatchReview | Staging Approval | Staging Approval | Review and approve product changes before production push |
| Diff summary + Spot-check | Staging Approval | Staging Approval | Inspect field-level changes and random-sample quality |
| PushHistoryTable + Rollback | Staging Approval | Staging Approval | Track pushes and reverse if needed |
| PushHistoryPage (filters, expandable rows, CSV export) | Push History | Staging Approval | Detailed push audit trail |
| BatchDetailPage (diffs, items, approval/rollback) | Push History Detail | Staging Approval | Deep-dive into individual push batches |
| SourceHealthCards | Monitoring | Monitoring & Alerts | Per-source health status cards |
| QueueLengthsChart | Monitoring | Monitoring & Alerts | Queue depth trends over time |
| ErrorQueueTable | Monitoring | Monitoring & Alerts | Actionable error tracking with resolve/dismiss |
| FreshnessHeatmap | Monitoring | Monitoring & Alerts | Data freshness across destinations |
| JobMetricsChart | Monitoring | Monitoring & Alerts | 30-day job throughput trends |
| NotificationsDrawer | Header | Monitoring & Alerts | Real-time notification feed |
| UserManagement (table, invite, edit) | User Management | System Administration | User CRUD, role assignment, account actions |
| SystemSettings (6 tabs) | Settings | System Administration | Pipeline thresholds, freshness rules, package rules, API config, notifications, audit |
| MyProfile (4 tabs) | Profile | System Administration | Personal info, security, preferences, activity |

---

# 8. KNOWN GAPS & PLACEHOLDERS

## Buttons & Actions That Are Placeholders

| Screen | Element | Current Behavior | Expected Real Behavior |
|--------|---------|-----------------|----------------------|
| Destinations | "Run Ingestion" button | `console.log()` | `POST /api/v1/ingestion/trigger` with destination ID, opens progress dialog |
| Destinations | Settings (gear) button | `console.log()` | Opens destination configuration dialog (data sources, thresholds, schedule) |
| Ingestion | "Start New Job" button | `console.log()` | Opens job configuration dialog (destination, run type, source selection) |
| Ingestion | "Cancel Job" button | `console.log()` | `POST /api/v1/ingestion/jobs/{id}/cancel` |
| Attribute Editor | "Save Changes" button | `console.log()` | `PATCH /api/v1/attributes/{category}/{productId}` |
| Attribute Editor | "Mark for Enrichment" button | `console.log()` | `POST /api/v1/enrichment/queue` |
| Product Detail | Edit mode save | No save action | `PATCH /api/v1/products/{id}` |
| Product Detail | Media "Add Images" / "Add Video URL" | Buttons render but no upload flow | File upload to CDN + `POST /api/v1/products/{id}/media` |
| Product Detail | Tags "Add" button | No actual tag assignment UI | Opens tag selector modal → `POST /api/v1/products/{id}/tags` |
| Product Detail | Booking Source "Assign" button | No assignment flow | Opens source selector → `PATCH /api/v1/products/{id}/booking-source` |
| Tag Manager | "Apply Tags" (bulk) | `console.log()` | `POST /api/v1/tags/bulk-apply` |
| Settings | All "Save" buttons | `console.log()` / local state | `PUT /api/v1/settings/{section}` |
| Settings | API Integration "Test" | Simulated 1.5s delay | Real HTTP health check to integration endpoint |
| Settings | API Integration "Save Configuration" | No persistence | `PUT /api/v1/settings/integrations/{id}` |
| Package Builder | AI content generation | `setTimeout` (2s fake delay) | `POST /api/v1/packages/generate-content` (calls Anthropic API) |
| Login | "Forgot password?" link | No-op | Navigate to password reset flow |
| Profile | 2FA "Enable" button | Disabled, "Coming Soon" | TOTP/WebAuthn enrollment flow |

## Features Not Yet Implemented

| PRD Requirement | Status | Notes |
|----------------|--------|-------|
| Real-time ingestion progress (WebSocket/SSE) | Not implemented | Active job cards use static mock data; no live streaming |
| Drag-and-drop reordering | Not implemented | Package itinerary days, tag hierarchy — no DnD library integrated |
| File upload workflow | Not implemented | Product media (images/videos) buttons exist but no upload infrastructure |
| Map integration | Not implemented | Hotel/Attraction forms have "Pick on Map" button but no map component |
| Data export (beyond CSV) | Partial | Push history has CSV export; no export on other screens |
| Real-time notifications (WebSocket) | Not implemented | NotificationsDrawer uses static data; no live push |
| Audit trail per-field | Partial | Product history shows events but not field-level diffs |
| Batch size limits / rate limiting UI | Not implemented | No UI for configuring per-source rate limits |
| Multi-language content generation | Not implemented | Content is English-only; no locale selector |
| Content A/B testing | Not implemented | No variant management for generated content |
| Scheduled ingestion runs | Not implemented | No cron/schedule configuration UI |
| Webhook configuration | Not implemented | Settings has notifications but no outbound webhook config |

## Data That Will Change with API Integration

| Current State | Production State |
|--------------|-----------------|
| All lists are client-side filtered/paginated | Server-side filtering, sorting, and pagination via query params |
| Product counts are hardcoded | Aggregated from database in real-time |
| Queue counts are static numbers | Live counts from queue service |
| Charts show fixed data points | Time-series data from monitoring service |
| Auto-refresh intervals simulate data changes | WebSocket/SSE for real-time updates |
| User management uses mock users | CRUD against `auth_users` database table |
| Session list is mock data | Active JWT sessions from auth service |
| Profile activity uses mock entries | `audit_logs` table queried by user ID |

---

*End of documentation.*
