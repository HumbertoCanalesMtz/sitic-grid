# Sitic Grid

A React component library built with TypeScript, Rspack, and Turborepo, delivering UMD bundles that work with external React/ReactDOM via CDN.

## Structure

```
sitic-grid/
├── packages/
│   ├── button/         # Button component (→ window.SiticGridButton)  
│   ├── card/           # Card component (→ window.SiticGridCard)
│   └── demo/           # HTML demos to validate UMD bundles
├── rspack.base.js      # Shared Rspack configuration
├── turbo.json          # Turborepo build pipeline
├── package.json        # npm workspaces configuration
└── tsconfig.base.json  # Base TypeScript configuration
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build All Packages

```bash
npm run build
```

This creates UMD bundles:
- `packages/button/dist/button.js` → `window.SiticGridButton`
- `packages/card/dist/card.js` → `window.SiticGridCard`

### 3. View Demos

Open HTML files in `packages/demo/` to see components working with CDN React:
- `index.html` - All components together
- `button-demo.html` - Button component demo  
- `card-demo.html` - Card component demo

## Usage via CDN

```html
<!-- Load Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Load React from CDN -->
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

<!-- Load Sitic Grid UMD bundles -->
<script src="https://unpkg.com/@sitic-grid/button/dist/button.js"></script>
<script src="https://unpkg.com/@sitic-grid/card/dist/card.js"></script>

<script>
  const { createElement: h } = React;
  const { createRoot } = ReactDOM;

  const App = () => {
    return h(SiticGridCard, { header: 'Hello World' },
      h('p', null, 'Welcome to Sitic Grid!'),
      h(SiticGridButton, {
        variant: 'primary',
        onClick: () => alert('Clicked!')
      }, 'Click me')
    );
  };  const root = createRoot(document.getElementById('root'));
  root.render(h(App));
</script>
```

## Development

### Watch mode
```bash
npm run dev
```

### Clean builds
```bash
npm run clean
```

### Individual package builds
```bash
cd packages/button && npm run build  
cd packages/card && npm run build
```

## Key Features

- **UMD bundles**: Work directly in browsers via CDN
- **External React**: React/ReactDOM not bundled (provided by consumer)
- **Tailwind CSS**: Modern utility-first CSS framework for styling
- **TypeScript**: Full type safety with SWC compilation
- **Rspack**: Fast builds with shared configuration
- **Turborepo**: Optimized monorepo build pipeline
- **npm workspaces**: Simplified dependency management

## Package Dependencies

- **Button**: Self-contained component with built-in utilities
- **Card**: Self-contained component with built-in utilities  
- **Demo**: Static HTML files (no dependencies)

Each component is completely independent with no internal dependencies.

## Styling

Components are styled using **Tailwind CSS** utility classes:

- **Button**: Supports `primary`, `secondary`, and `outline` variants with `small`, `medium`, and `large` sizes
- **Card**: Supports configurable shadows (`none`, `small`, `medium`, `large`) and padding options

**Important**: Make sure to include Tailwind CSS CDN in your HTML:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

## Build Configuration

Each package uses the shared `rspack.base.js` configuration with:
- **Externals**: React and ReactDOM not bundled
- **SWC Loader**: TypeScript compilation with JSX transform
- **UMD Output**: Browser-compatible module format
- **Source Maps**: Included for debugging