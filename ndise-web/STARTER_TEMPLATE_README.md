# Dashboard Starter Template

A production-ready, theme-aware dashboard starter template built with React, TypeScript, and Tailwind CSS.

## Features

### 🎨 **Theme System**
- Multiple pre-built themes (NDISE, Default, Green)
- Dark mode support
- CSS variable-based theming
- Easy to customize and extend
- Theme persistence in localStorage

### 🔐 **Authentication & Authorization**
- Complete auth system with login/logout
- Permission-based access control (`resource:action` format)
- Multi-role support
- Protected routes
- Session management
- User profile management

### 📊 **Data Management**
- Advanced DataTable component
  - Sortable columns
  - Global search
  - Column visibility toggle
  - Pagination
  - Export to CSV/Excel/PDF
- Export utilities

### 🧩 **UI Components**
All components are theme-aware and support dark mode:

- **Button** - Multiple variants (primary, secondary, outline, ghost, danger)
- **Card** - With header, title, and content sub-components
- **Badge** - Status indicators
- **Alert** - Contextual alerts (success, warning, error, info)
- **StatCard** - Dashboard metrics with trends
- **DataTable** - Advanced data tables
- **Toast** - Notification system
- **PermissionGate** - Conditional rendering based on permissions

### 🎯 **Core Features**
- TypeScript for type safety
- Responsive design (mobile-first)
- Accessibility (WCAG 2.1 AA compliant)
- Performance optimized
- Clean, maintainable code structure

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Alert.tsx
│   │   ├── StatCard.tsx
│   │   └── index.ts
│   ├── DataTable.tsx          # Advanced data table
│   ├── Layout.tsx             # Main layout wrapper
│   ├── ProtectedRoute.tsx     # Route protection
│   ├── PermissionGate.tsx     # Permission-based rendering
│   └── Toast.tsx              # Toast notifications
├── context/
│   ├── AuthContext.tsx        # Authentication state
│   ├── ThemeContext.tsx       # Theme state
│   └── ToastContext.tsx       # Toast notifications
├── lib/
│   ├── permissions.ts         # Permission utilities
│   ├── theme.ts               # Theme configuration
│   └── export.ts              # Export utilities
├── data/
│   ├── users.ts               # Mock user data
│   └── stats.ts               # Mock statistics
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── ...
└── App.tsx
```

## Customization

### Adding a New Theme

1. Edit `src/lib/theme.ts`:

```typescript
export const myTheme: Theme = {
  name: 'MyTheme',
  colors: {
    light: {
      primary: '#your-color',
      // ... other colors
    },
    dark: {
      primary: '#your-color',
      // ... other colors
    },
  },
};

export const themes = {
  // ... existing themes
  myTheme,
};
```

2. The theme will automatically be available via `useTheme()` hook.

### Adding New Permissions

Edit `src/lib/permissions.ts`:

```typescript
export type Resource = 
  | 'dashboard'
  | 'your-resource' // Add your resource
  | ...;

export type Action = 
  | 'read'
  | 'your-action' // Add your action
  | ...;
```

### Creating New UI Components

Follow the pattern in `src/components/ui/`:

```typescript
import clsx from 'clsx';

interface MyComponentProps {
  // props
}

export default function MyComponent({ ...props }: MyComponentProps) {
  return (
    <div className="bg-[var(--color-surface)] text-[var(--color-text)]">
      {/* Use CSS variables for theme support */}
    </div>
  );
}
```

## Theme Variables

All theme colors are available as CSS variables:

```css
var(--color-primary)
var(--color-primary-hover)
var(--color-secondary)
var(--color-accent)
var(--color-success)
var(--color-warning)
var(--color-error)
var(--color-info)
var(--color-background)
var(--color-surface)
var(--color-text)
var(--color-text-secondary)
var(--color-border)
```

## Using the Theme

```typescript
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, mode, setTheme, setMode, toggleMode } = useTheme();

  return (
    <div>
      <button onClick={toggleMode}>
        Toggle {mode === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <button onClick={() => setTheme('green')}>
        Switch to Green Theme
      </button>
    </div>
  );
}
```

## Using Permissions

```typescript
import { useAuth } from './context/AuthContext';
import PermissionGate from './components/PermissionGate';

function MyComponent() {
  const { hasPermission } = useAuth();

  return (
    <div>
      {/* Conditional rendering */}
      <PermissionGate permissions={['users:write']}>
        <button>Create User</button>
      </PermissionGate>

      {/* Or use the hook directly */}
      {hasPermission('users', 'delete') && (
        <button>Delete User</button>
      )}
    </div>
  );
}
```

## Using the DataTable

```typescript
import DataTable from './components/DataTable';
import { exportToCSV } from './lib/export';

const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];

function MyComponent() {
  const data = [...]; // your data

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(data, 'export');
    }
    // ... handle other formats
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable
      exportable
      onExport={handleExport}
    />
  );
}
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **TanStack Table** - Data tables
- **Lucide React** - Icons
- **date-fns** - Date utilities

## License

MIT

## Contributing

This is a starter template. Feel free to customize it for your needs!

---

**Built with ❤️ for rapid dashboard development**
