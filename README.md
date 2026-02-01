# cf_ai_homelab_helper 🛠️

An AI-powered infrastructure assistant built on the Cloudflare Developer Platform. This tool helps home-lab enthusiasts debug connectivity issues (SSH, DNS) and automatically generates cloudflared configuration files using local LLM inference. I'm honest, and as such, you should know that this project is build heavily by AI.

## 🚀 Features

**Error Log Analysis**: Paste an SSH verbose log (ssh -vvv), and the AI identifies the exact failure point (e.g., "Public Key Rejected" or "Connection Refused").

**Config Generator**: describing your setup (e.g., "I have a Minecraft server on port 25565"), and it generates the correct cloudflared tunnel config and DNS records.

**Stateful Context**: Remembers your server details across the conversation using Durable Objects.

## 🏗️ Architecture

**Frontend**: React (deployed via Cloudflare Pages)

**Backend**: Cloudflare Workers (Hono framework)

**AI Model**: @cf/meta/llama-3.3-70b-instruct-awq running on Workers AI

**State Management**: Durable Objects (for chat history storage)

**Orchestration**: Cloudflare Workflows (to chain reasoning steps)

## 🛠️ Setup & Running Instructions

**Prerequisites**:

- Node.js & npm
- Wrangler CLI (npm install -g wrangler)
- Cloudflare Account

### 1. Clone & Install

```bash
git clone https://github.com/Ta11-Man/cf_ai_homelab_helper.git
cd cf_ai_homelab_helper
npm install
```

### 2. Local Development

**Simultaneous Launch (Recommended)**:
Includes both Backend (Worker) and Frontend (Vite)

```bash
make dev
```

**Manual Start**:

```bash
# Terminal 1: Backend
npx wrangler dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 3. Deploy

```bash
make deploy-backend
make deploy-frontend
```

## 🤖 AI Model Usage

This project uses **Llama 3 8B Instruct** (`@cf/meta/llama-3-8b-instruct`) via Cloudflare Workers AI.

- **Privacy**: No external API keys (OpenAI/Anthropic) are required; it runs entirely on Cloudflare's edge network.
- **Cost**: Uses Cloudflare's free tier for Workers AI.
