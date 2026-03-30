# ZoneWise.AI — assistant-ui Fork

**Enterprise frontend for AI chat, split-screen artifacts, and tool rendering.**

Fork of [assistant-ui/assistant-ui](https://github.com/assistant-ui/assistant-ui) (v0.12.21) customized for ZoneWise.AI / Everest Capital USA.

## House Brand
- Navy: #1E3A5F | Orange: #F59E0B | BG: #020617
- Font: Inter
- Built on: shadcn/ui + Radix + Tailwind (same stack as zonewise-web)

## Architecture
```
zonewise.ai (Next.js)
  └── assistant-ui components (this fork)
        ├── Split-screen: chat left, map/artifacts right
        ├── Tool renderers: zoning cards, parcel info, reports
        ├── Streaming: real-time LLM responses
        └── Backend: calls Dify Service API via adapter
```

## Key Components Used
- `Thread` — Main chat interface
- `ArtifactsView` — Split-screen artifact panel (from with-artifacts example)
- `makeAssistantTool()` — Custom tool rendering (zoning lookup, map, reports)
- `useChatRuntime()` — Connects to Dify Service API

## Sprint Integration
- Sprint 3 (Apr 23 - May 7): Split-screen UI + Dify agent wiring
- Installed via `npm install @assistant-ui/react @assistant-ui/react-ai-sdk`
- No fork deployment needed — use as npm package + copy components into zonewise-web

## Upstream Sync
```bash
git remote add upstream https://github.com/assistant-ui/assistant-ui.git
git fetch upstream
git merge upstream/main
```
