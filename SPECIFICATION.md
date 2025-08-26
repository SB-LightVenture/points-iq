# PointsIQ - Detailed Website Specification

## 1. Project Overview

**Project Name:** PointsIQ  
**Type:** Flight Search & Points Management Platform  
**Technology Stack:** React, TypeScript, Vite, Tailwind CSS, Supabase  
**Purpose:** Intelligent frequent flyer points management and award flight search across multiple airline programs

## 2. Application Architecture

### 2.1 Frontend Architecture
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with shadcn/ui component library
- **State Management:** React Context API (AuthContext) + Custom Hooks
- **Routing:** React Router DOM v6
- **HTTP Client:** Supabase client
- **UI Library:** Radix UI primitives with shadcn/ui components

### 2.2 Backend Architecture
- **Backend-as-a-Service:** Supabase
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **Edge Functions:** Supabase Edge Functions for flight scraping
- **Real-time:** Supabase Realtime (capability)

### 2.3 Key Dependencies
```json
{
  "@supabase/supabase-js": "^2.50.0",
  "@tanstack/react-query": "^5.56.2",
  "react": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "mapbox-gl": "^3.13.0",
  "@radix-ui/*": "Various versions",
  "tailwindcss": "Latest",
  "lucide-react": "^0.462.0"
}
```

## 3. Database Schema

### 3.1 Core Tables

#### Users & Authentication
- **profiles**: User profile information (extends Supabase auth.users)
  - `id` (UUID, PK): Links to auth.users
  - `email` (VARCHAR): User email
  - `full_name` (TEXT): User's full name
  - `created_at` (TIMESTAMP): Account creation time

#### Frequent Flyer Programs
- **frequent_flyer_programs**: Master list of airline loyalty programs
  - `id` (UUID, PK): Program identifier
  - `name` (TEXT): Program name (e.g., "American Airlines AAdvantage")
  - `code` (TEXT): Program code (e.g., "AA", "VA", "QF")
  - `logo_url` (TEXT): Program logo URL
  - `partner_programs` (ARRAY): List of partner program codes
  - `status_levels` (ARRAY): Available status tiers
  - `created_at` (TIMESTAMP): Record creation time

#### Points Wallets
- **points_wallets**: User's frequent flyer account information
  - `id` (UUID, PK): Wallet identifier
  - `user_id` (UUID, FK): References profiles.id
  - `program_id` (UUID, FK): References frequent_flyer_programs.id
  - `points_balance` (INTEGER): Current points balance
  - `status_level` (TEXT): User's status level in program
  - `is_active` (BOOLEAN): Whether wallet is active for searches
  - `created_at` (TIMESTAMP): Wallet creation time
  - `updated_at` (TIMESTAMP): Last update time

#### Flight Search Data
- **flight_searches**: Search history and results
  - `id` (UUID, PK): Search identifier
  - `user_id` (UUID, FK): References profiles.id
  - `origin_airport` (VARCHAR): IATA code of departure airport
  - `destination_airport` (VARCHAR): IATA code of arrival airport
  - `departure_date` (DATE): Departure date
  - `return_date` (DATE, nullable): Return date for round trips
  - `cabin_class` (VARCHAR): Cabin class (Economy, Premium, Business, First)
  - `passengers` (INTEGER): Number of passengers
  - `search_parameters` (JSONB): Complete search parameters
  - `api_response` (JSONB): Raw API response from scrapers
  - `status` (VARCHAR): Search status (pending, completed, error)
  - `created_at` (TIMESTAMP): Search creation time
  - `updated_at` (TIMESTAMP): Last update time

#### Reference Data
- **airports**: Airport information
  - `id` (UUID, PK): Airport identifier
  - `iata_code` (VARCHAR): 3-letter IATA code
  - `icao_code` (VARCHAR): 4-letter ICAO code
  - `name` (TEXT): Airport name
  - `city` (TEXT): City name
  - `country` (TEXT): Country name
  - `latitude` (NUMERIC): Latitude coordinate
  - `longitude` (NUMERIC): Longitude coordinate
  - `is_major` (BOOLEAN): Whether it's a major airport
  - `created_at` (TIMESTAMP): Record creation time

- **airlines**: Airline information
  - `id` (UUID, PK): Airline identifier
  - `iata_code` (VARCHAR): 2-letter IATA code
  - `icao_code` (VARCHAR): 3-letter ICAO code
  - `name` (TEXT): Airline name
  - `frequent_flyer_program_id` (UUID, FK): Associated FF program
  - `alliance` (VARCHAR): Airline alliance (Star Alliance, oneworld, SkyTeam)
  - `created_at` (TIMESTAMP): Record creation time

#### Analytics & Tracking
- **flight_routes**: Popular route tracking
  - `id` (UUID, PK): Route identifier
  - `origin_airport` (VARCHAR): Origin IATA code
  - `destination_airport` (VARCHAR): Destination IATA code
  - `route_name` (TEXT): Human-readable route name
  - `is_popular` (BOOLEAN): Whether route is marked as popular
  - `search_count` (INTEGER): Number of times searched
  - `last_searched_at` (TIMESTAMP): Last search time
  - `created_at` (TIMESTAMP): Route creation time

- **early_access_signups**: Beta user signups
  - `id` (UUID, PK): Signup identifier
  - `email` (TEXT): User email
  - `created_at` (TIMESTAMP): Signup time

- **user_home_airports**: User's preferred home airports
  - `id` (UUID, PK): Record identifier
  - `user_id` (UUID, FK): References profiles.id
  - `airport_id` (UUID, FK): References airports.id
  - `is_primary` (BOOLEAN): Whether this is the primary home airport
  - `created_at` (TIMESTAMP): Record creation time

- **popular_destinations**: Trending destinations
  - `id` (UUID, PK): Destination identifier
  - `airport_id` (UUID, FK): References airports.id
  - `search_count` (INTEGER): Number of searches
  - `is_featured` (BOOLEAN): Whether featured on homepage
  - `created_at` (TIMESTAMP): Record creation time

## 4. User Interface Structure

### 4.1 Page Architecture

#### Landing Page (/)
**Purpose:** Marketing homepage and early access signup
**Components:**
- `ModernHero`: Main hero section with branding and CTA
- `FlightPathDemo`: Interactive flight path demonstration
- `AvailabilityShowcase`: Award availability showcase
- `AirlineSupport`: Supported airlines display
- `ModernFeatures`: Feature highlights
- `HowItWorks`: Process explanation
- `ModernPricing`: Pricing information
- `Footer`: Site footer with links

#### Authentication Page (/auth)
**Purpose:** User login and registration
**Features:**
- Toggle between Sign In and Sign Up modes
- Email/password authentication
- Full name capture for registration
- Form validation and error handling
- Redirect logic for authenticated users

#### Dashboard Page (/dashboard)
**Purpose:** Main application interface for authenticated users
**Components:**
- `DashboardHeader`: User navigation and account controls
- `WalletsSection`: Points wallet management
- `FlightSearchContainer`: Flight search functionality
- `WalletModal`: Add/edit wallet modal
- `ScrapingDebugMonitor`: Development debugging tool

#### 404 Page (/*)
**Purpose:** Handle unknown routes
**Features:**
- User-friendly 404 error page
- Navigation back to main site

### 4.2 Key Component Architecture

#### Authentication & User Management
- **AuthContext**: Global authentication state management
- **ProtectedRoute**: Route protection for authenticated areas
- **useAuth**: Authentication hook with login/logout/signup

#### Points Wallet Management
- **WalletsSection**: Main wallet display and management
- **WalletCard**: Individual wallet display with actions
- **WalletModal**: Add/edit wallet interface
- **usePointsWallets**: Wallet data management hook

#### Flight Search System
- **FlightSearchContainer**: Main search interface
- **FlightSearchSection**: Search form and results container
- **FlightSearchForm**: Search input form
- **FlightSearchResults**: Results display
- **FlightSearchSummary**: Search summary
- **useFlightSearch**: Search logic and state management

#### Interactive Map Features
- **InteractiveGlobeMap**: 3D globe interface
- **MapboxGlobe**: Mapbox GL integration
- **useMapboxGlobe**: Globe initialization and interaction
- **MapControls**: Map interaction controls
- **MapInstructions**: User guidance for map

#### UI Components (shadcn/ui based)
- Complete shadcn/ui component library
- Custom enhanced components (enhanced-toast)
- Consistent design system via Tailwind

## 5. Design System

### 5.1 Color Palette
```css
/* Brand Colors */
--orange-brand: 24 100% 50%    /* Primary orange */
--blue-brand: 212 100% 47%     /* Primary blue */

/* Semantic Colors */
--primary: 212 100% 47%        /* Main actions */
--secondary: 212 6% 97%        /* Secondary actions */
--success: 142 76% 36%         /* Success states */
--warning: 38 92% 50%          /* Warning states */
--info: 199 89% 48%           /* Info states */
--destructive: 0 84% 60%       /* Error states */
```

### 5.2 Typography
- **Font Family:** Inter, system fonts
- **Headings:** Font-semibold by default
- **Body:** Standard weight with good line height

### 5.3 Layout System
- **Responsive:** Mobile-first design approach
- **Grid:** CSS Grid and Flexbox
- **Spacing:** Tailwind spacing scale
- **Container:** Centered with responsive padding

### 5.4 Component Styling
- **Cards:** Rounded corners, subtle shadows, hover effects
- **Buttons:** Gradient backgrounds, hover animations
- **Forms:** Consistent input styling, validation states
- **Navigation:** Clean, intuitive navigation patterns

## 6. Feature Specifications

### 6.1 User Authentication
- **Registration:** Email/password with email confirmation
- **Login:** Email/password authentication
- **Profile Management:** Basic profile information
- **Session Management:** Persistent sessions with auto-refresh
- **Security:** Supabase Auth security features

### 6.2 Points Wallet Management
- **Add Wallets:** Support for multiple frequent flyer programs
- **Edit Wallets:** Update points balance and status level
- **Delete Wallets:** Remove wallets with confirmation
- **Selection:** Multi-select wallets for flight searches
- **Validation:** Input validation for points and status

### 6.3 Flight Search System
- **Search Parameters:**
  - Origin/Destination airports (IATA codes)
  - Departure/Return dates
  - Cabin class (Economy, Premium Economy, Business, First)
  - Number of passengers
  - Selected frequent flyer programs

- **Search Process:**
  - Real-time search across multiple programs
  - Parallel API calls to different airline scrapers
  - Results aggregation and display
  - Search history storage

- **Results Display:**
  - Grouped by frequent flyer program
  - Flight details (times, duration, aircraft)
  - Points cost and cash cost
  - Availability status
  - Stops information

### 6.4 Interactive Map Features
- **3D Globe:** Mapbox GL-powered 3D globe
- **Airport Markers:** Visual airport markers with hover states
- **Flight Routes:** Animated flight path visualization
- **User Interaction:** Click to select destinations
- **Home Airport:** Set and manage home airport preference

### 6.5 Scraping & Data Collection
- **Multi-Airline Support:** Currently supports American Airlines, Virgin Australia
- **Real-time Scraping:** Live data collection via edge functions
- **Fallback Data:** Mock data generation when scraping fails
- **Error Handling:** Comprehensive error handling and user feedback
- **Caching:** Search result caching for performance

## 7. Technical Implementation Details

### 7.1 State Management
- **Global State:** React Context for authentication
- **Local State:** useState for component-specific state
- **Server State:** React Query for API data management
- **Form State:** React Hook Form for complex forms

### 7.2 API Integration
- **Supabase Client:** Centralized API client configuration
- **Edge Functions:** Serverless functions for flight scraping
- **Error Handling:** Centralized error handling with user-friendly messages
- **Type Safety:** Full TypeScript integration with generated types

### 7.3 Performance Optimizations
- **Code Splitting:** Route-based code splitting
- **Lazy Loading:** Component lazy loading where appropriate
- **Memoization:** React.memo and useMemo for expensive operations
- **Efficient Queries:** Optimized database queries

### 7.4 Security Measures
- **Authentication:** Supabase Auth with JWT tokens
- **Row Level Security:** Database-level security policies
- **Input Validation:** Client and server-side validation
- **Error Boundaries:** React error boundaries for graceful failures

## 8. Development & Deployment

### 8.1 Development Environment
- **Local Development:** Vite dev server with hot reload
- **Environment Variables:** Configuration via .env files
- **Type Checking:** TypeScript strict mode
- **Linting:** ESLint configuration
- **Code Formatting:** Prettier integration

### 8.2 Build Process
- **Build Tool:** Vite for production builds
- **Asset Optimization:** Automatic asset optimization
- **Bundle Splitting:** Automatic code splitting
- **TypeScript Compilation:** Full type checking in build

### 8.3 Deployment Architecture
- **Frontend:** Static site deployment (Lovable platform)
- **Backend:** Supabase hosted backend
- **Database:** Supabase PostgreSQL
- **Edge Functions:** Supabase Edge Runtime
- **CDN:** Global content delivery

## 9. Current System Limitations & Future Enhancements

### 9.1 Current Limitations
- Limited airline scraper implementations (AA, VA only)
- Mock data fallbacks for unsupported airlines
- Basic search result caching
- Limited analytics and reporting

### 9.2 Planned Enhancements
- Additional airline scraper support
- Advanced search filters and sorting
- Price tracking and alerts
- Social features (sharing results)
- Mobile application
- Advanced analytics dashboard

## 10. API Specifications

### 10.1 Edge Functions

#### Flight Search API
```typescript
// POST /flight-search
interface FlightSearchRequest {
  origin: string;           // IATA code
  destination: string;      // IATA code
  departureDate: string;    // ISO date
  returnDate?: string;      // ISO date (optional)
  cabinClass: string;       // Economy|Premium|Business|First
  passengers: number;       // Number of passengers
  selectedWallets: PointsWallet[];
}

interface FlightSearchResponse {
  searchId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  results: {
    programId: string;
    programName: string;
    programCode: string;
    availability: FlightResult[];
    scraped: boolean;
    error?: string;
  }[];
}
```

#### Airline-Specific Scrapers
```typescript
// POST /scrape-american-airlines
// POST /scrape-virgin-australia
interface AirlineScraperRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  passengers: number;
}

interface FlightResult {
  airline: string;
  flight: string;
  departure: string;
  arrival: string;
  duration: string;
  aircraft: string;
  pointsCost: number;
  cashCost: number;
  availability: string;
  stops: number;
}
```

### 10.2 Database API (Supabase)
- **Automatic API Generation:** Supabase generates REST API from database schema
- **Real-time Subscriptions:** Available for live data updates
- **Row Level Security:** Applied to all API endpoints
- **Type Generation:** Automatic TypeScript type generation

## 11. Monitoring & Analytics

### 11.1 User Analytics
- Search patterns and popular routes
- User engagement metrics
- Conversion tracking for early access signups
- Performance monitoring

### 11.2 System Monitoring
- Edge function performance and error rates
- Database query performance
- Scraping success/failure rates
- API response times

### 11.3 Error Handling & Logging
- Centralized error logging
- User-friendly error messages
- Retry mechanisms for failed operations
- Debug monitoring for development

---

This specification document provides a comprehensive overview of the PointsIQ platform architecture, features, and implementation details. The system is designed to be scalable, maintainable, and user-friendly while providing powerful flight search capabilities across multiple frequent flyer programs.