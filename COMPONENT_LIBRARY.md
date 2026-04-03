# M&M Auto Performance - Component Library
## 🎨 Comprehensive UI Component System

---

## Color System

### Brand Colors (from Tailwind Config)
```
performance-grey:     #23272E  (Foundation, Professionalism, Stealth)
performance-turquoise: #00F5FF (Performance, Action, Innovation)
performance-babyblue:  #89CFF0 (Trust, AI Intelligence, Luxury)
```

### Usage Guidelines
- **Gunmetal Grey**: Backgrounds, text, borders, cards
- **Turquoise**: CTAs, highlights, active states, performance indicators
- **Baby Blue**: AI features, trust indicators, secondary actions

---

## Core Components

### 1. Navigation Bar
**Purpose**: Global navigation for all pages
**Props**:
- `isLoggedIn: boolean`
- `userRole: 'guest' | 'user' | 'admin'`
- `currentPage: string`

**Features**:
- Sticky header with glass-gradient background
- Responsive mobile menu
- Logo + brand identity
- Login/profile section
- Navigation links

**Color Scheme**: Gunmetal background with turquoise active states

---

### 2. Hero Section
**Purpose**: Landing page hero with call-to-action
**Props**:
- `title: string`
- `subtitle: string`
- `primaryCTA: { text: string; href: string }`
- `secondaryCTA?: { text: string; href: string }`
- `backgroundImage?: string`

**Features**:
- Full-width with glassmorphic overlay
- Animated gradient background
- Responsive typography
- Dual CTA buttons (turquoise primary, outlined secondary)

---

### 3. Fleet Card
**Purpose**: Display individual vehicle with specs and pricing
**Props**:
- `vehicleId: string`
- `model: string`
- `image: string`
- `specs: { horsepower: number; 0-60: string; topSpeed: number }`
- `price: { daily: number; hourly: number }`
- `availability: boolean`
- `features: string[]`

**Features**:
- Image carousel
- Spec badges with icons
- Dynamic pricing display
- Booking button
- Favorite/wishlist toggle

---

### 4. Booking Widget
**Purpose**: Core booking interface (AI Sky Concierge)
**Props**:
- `vehicles: Vehicle[]`
- `onBooking: (booking: BookingData) => void`
- `mode: 'quick' | 'detailed'`

**Features**:
- Date/time pickers
- Vehicle search/filter
- Document verification UI
- Real-time availability check
- AI-powered suggestions
- Multi-step checkout flow

---

### 5. AI Chat Interface (Concierge)
**Purpose**: 24/7 automated booking and document verification
**Props**:
- `isOpen: boolean`
- `onClose: () => void`
- `context: { userId?: string; previousBookings?: Booking[] }`

**Features**:
- Clean chat interface
- Document upload area
- Real-time typing indicators
- Message history
- Contextual suggestions
- Document status badges

**Color**: Baby blue for AI responses, turquoise for user actions

---

### 6. Fleet Dashboard
**Purpose**: Real-time telemetry and vehicle tracking
**Props**:
- `vehicles: VehicleWithTelemetry[]`
- `filters: DashboardFilters`

**Features**:
- Map view (Google Maps integration)
- Vehicle status indicators
- Live tracking with real-time updates
- Habit Score leaderboard
- Performance metrics

---

### 7. Admin Panel Navigation
**Purpose**: Sidebar for admin dashboard
**Props**:
- `currentSection: AdminSection`
- `onNavigate: (section: AdminSection) => void`

**Sections**:
- Dashboard (analytics, overview)
- Fleet Management (add/edit/delete vehicles)
- Bookings (view, manage, cancel)
- Users (manage accounts, verification)
- Pricing (dynamic rate adjustment)
- Reports (analytics, telemetry)
- GitHub Actions (trigger deployments)

---

### 8. Button Components
**Variants**:
- **Primary**: Turquoise background, white text (CTA actions)
- **Secondary**: Outlined turquoise, transparent background
- **Tertiary**: Ghost button, text only
- **Danger**: Red background (delete, cancel operations)

**Sizes**: `sm`, `md`, `lg`, `xl`

**States**: Default, hover, active, disabled, loading

---

### 9. Status Badges
**Purpose**: Indicator for vehicle, booking, and user status
**Variants**:
- **Available**: Green
- **Booked**: Orange
- **Maintenance**: Grey
- **Processing**: Baby blue (AI verification)
- **Verified**: Turquoise checkmark

---

### 10. Form Components
**Elements**:
- Text inputs (email, password, text)
- Date pickers (booking dates)
- File uploads (document verification)
- Select dropdowns (vehicle selection, filters)
- Checkboxes (terms, preferences)
- Radio buttons (booking options)
- Sliders (price range, performance filters)

**Styling**: Dark backgrounds with turquoise focus states

---

## Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   └── Footer
├── Pages
│   ├── Home
│   │   ├── Hero
│   │   ├── Fleet Showcase (multiple FleetCard)
│   │   ├── Booking Widget
│   │   └── Stats Section
│   ├── Booking
│   │   └── Booking Widget (detailed mode)
│   ├── Fleet
│   │   ├── Fleet Grid (multiple FleetCard)
│   │   └── Filters
│   ├── Dashboard
│   │   ├── Fleet Dashboard
│   │   ├── Habit Score Leaderboard
│   │   └── Telemetry Display
│   ├── Admin
│   │   ├── Admin Navigation
│   │   ├── Dashboard Section
│   │   ├── Fleet Management
│   │   ├── Bookings Management
│   │   ├── Users Management
│   │   └── Pricing Controls
│   └── Profile
│       ├── User Info
│       ├── Booking History
│       └── Preferences
├── AI Concierge
│   └── Chat Interface
└── Common
    ├── Buttons
    ├── Badges
    ├── Forms
    ├── Modals
    └── Loaders
```

---

## Animation & Motion

### Framer Motion Usage
- **Page transitions**: Fade + slide-in from top
- **Component hover**: Subtle scale and shadow
- **Loading states**: Spinner and pulse animations
- **Notifications**: Slide from corner with auto-dismiss
- **Modal overlays**: Fade background, scale content

### Transition Timing
- Quick interactions: 200ms (button hovers)
- Page transitions: 400ms
- Complex animations: 600ms

---

## Accessibility Standards (WCAG 2.1 AA)
- All buttons and interactive elements have focus states
- Color contrast ratio ≥4.5:1 for text
- ARIA labels on all icons and interactive elements
- Keyboard navigation (Tab order, Enter/Space activations)
- Screen reader friendly image alt text
- Form labels properly associated with inputs
- Error messages linked to form fields

---

## Responsive Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl/2xl)

All components must be fully responsive and mobile-first.

---

## Component Status

| Component | Status | Last Updated |
|-----------|--------|--------------|
| Navbar | ✅ Ready | 2026-04-03 |
| Hero Section | ✅ Ready | 2026-04-03 |
| Fleet Card | ✅ Ready | 2026-04-03 |
| Booking Widget | 🔄 In Progress | 2026-04-03 |
| AI Concierge Chat | 🔄 In Progress | 2026-04-03 |
| Fleet Dashboard | ⏳ Planned | - |
| Admin Panel | ⏳ Planned | - |
| Form Components | ✅ Ready | 2026-04-03 |

---

## Next Steps
1. Build React component files with TypeScript
2. Implement Framer Motion animations
3. Add Supabase integration for real-time data
4. Create Storybook documentation
5. Write unit tests for all components
