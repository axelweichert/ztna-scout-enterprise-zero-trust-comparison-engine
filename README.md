# Cloudflare Workers React Boilerplate

[cloudflarebutton]

A production-ready full-stack template for Cloudflare Workers featuring a React frontend with shadcn/ui, Durable Objects for scalable stateful entities (users, chats, messages), Hono for API routing, TanStack Query for data fetching, Tailwind CSS for styling, and Vite for fast development.

## 🚀 Key Features

- **Type-Safe TypeScript**: End-to-end types with shared `@shared/types` and Cloudflare Workers types.
- **Durable Objects Entities**: Multi-tenant storage with indexing for lists (users, chat boards).
- **Modern React Stack**: shadcn/ui components, TanStack Query, React Router, Zustand, Framer Motion.
- **API-First Backend**: Hono routes with CORS, logging, error handling; extend via `worker/user-routes.ts`.
- **Fast Development**: Vite HMR, Bun-powered scripts, Tailwind JIT.
- **Production-Ready**: Error boundaries, client error reporting, theme support, responsive design.
- **Seed Data**: Mock users/chats/messages auto-populate on first request.
- **SPA Assets**: Automatic SPA fallback, Workers serve React build.

## 🛠 Technology Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Durable Objects, Hono |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| **Data** | TanStack Query, Zustand, Immer, Zod |
| **UI/UX** | Lucide Icons, Framer Motion, Sonner Toasts, Headless UI |
| **Dev Tools** | Bun, ESLint, Wrangler, Cloudflare Vite Plugin |

## 📦 Installation

1. **Prerequisites**:
   - [Bun](https://bun.sh/) v1.0+
   - [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/install-update/) CLI
   - Cloudflare account with Workers enabled

2. **Clone & Install**:
   ```bash
   git clone <your-repo>
   cd <project>
   bun install
   ```

3. **Type Generation** (Workers env types):
   ```bash
   bun run cf-typegen
   ```

## 🔧 Development

- **Start Dev Server** (frontend + Workers proxy):
  ```bash
  bun dev
  ```
  Opens at `http://localhost:3000`. API at `/api/*`.

- **Preview Production Build**:
  ```bash
  bun preview
  ```

- **Lint**:
  ```bash
  bun lint
  ```

**Hot Reload**: Frontend changes reflect instantly. Backend changes require Worker restart (Wrangler handles in dev).

### Extending the App

- **Frontend**: Edit `src/pages/HomePage.tsx` or add routes in `src/main.tsx`.
- **Backend Entities**: Extend `worker/entities.ts` using `IndexedEntity` base class.
- **API Routes**: Add to `worker/user-routes.ts`; auto-loaded by `worker/index.ts`.
- **Shared Types**: Update `shared/types.ts` and `shared/mock-data.ts`.

**Example API Usage** (fetch with TanStack Query):
```ts
import { api } from '@/lib/api-client';
const users = await api<User[]>('/api/users');
```

## ☁️ Deployment

1. **Build Frontend**:
   ```bash
   bun build
   ```

2. **Deploy to Cloudflare**:
   ```bash
   bun deploy
   ```
   Deploys Worker + static assets to your default account/project.

3. **Custom Domain/Env**:
   Edit `wrangler.jsonc` for bindings/migrations, then:
   ```bash
   wrangler deploy --env production
   ```

[cloudflarebutton]

**Live Preview**: After deploy, visit `<worker>.<subdomain>.workers.dev`.

## 📚 Project Structure

```
├── src/                 # React app (Vite)
├── worker/              # Cloudflare Worker (Hono + DOs)
├── shared/              # Shared TS types + mocks
├── tailwind.config.js   # shadcn/tailwind config
└── wrangler.jsonc      # Workers config (DO bindings)
```

## 🤝 Contributing

1. Fork & clone.
2. `bun install && bun dev`.
3. Add features/PRs to `user-routes.ts`/`entities.ts`/`HomePage.tsx`.
4. Follow existing patterns (type-safe, IndexedEntity).

## 🔒 License

MIT. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- File issues here for template bugs.