# Brick Engine Menu

The official menu for the **Brick Engine**, a retro-style game simulator. This project handles game discovery and navigation, allowing users to switch between different brick-style games.

## 🚀 Features

- **Dynamic Game Listing**: Fetches available games from a remote repository (Supabase).
- **Retro UI**: Built with `p5.js` and `brick-engine-js` for a consistent brick-game aesthetic.
- **Game Switching**: Seamlessly loads and launches external games.
- **Dual Build Modes**: Supports both standalone execution and integration as a bundle.

## 🛠️ Tech Stack

- **[Brick Engine JS](https://github.com/lucas-mendes-fernandes/brick-engine-js)**: Core framework.
- **[p5.js](https://p5js.org/)**: Rendering engine.
- **TypeScript**: Type-safe development.
- **Webpack**: Module bundling and development server.

## 📥 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
git clone https://github.com/your-repo/brick-engine-menu.git
cd brick-engine-menu
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ⌨️ Development

To start the development server with the standalone menu:

```bash
npm start
```

## 🏗️ Building for Production

The project supports two build targets:

### 1. Standalone Application

Creates a self-contained web app in the `dist/` folder.

```bash
npm run build:standalone
```

### 2. Library Bundle

Creates a bundle intended to be loaded by another application.

```bash
npm run build:bundle
```

### Previewing the Build

To serve the `dist` folder locally:

```bash
npm run serve
```

## 🧪 Quality Control

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`

## 📄 License

This project is licensed under the ISC License.
