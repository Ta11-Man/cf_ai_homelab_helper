# AI Prompts & Usage Log

As per the assignment guidelines, this document tracks the AI prompts used to assist in the development of cf_ai_homelab_helper.

## 1. Project Initialization & Scaffolding

**Prompt Used**:
"See instructions below for Cloudflare AI app assignment. SUBMIT GitHub repo URL for the AI project here. [...] The Concept 'HomeLab Helper': An AI-powered assistant specifically trained to help students and hobbyists debug networking issues... Save this as README.md... Save this as PROMPTS.md..."

**Reasoning**: This comprehensive prompt provided the full project requirements, tech stack (Workers AI, Durable Objects, React), and necessary file contents, which the AI used to scaffold the initial project structure, `wrangler.toml`, and core files.

## 2. Implementation & Refinement

**Prompt Used**:
"You do not need to copy markdown text exactly, make it correct. Go ahead with implementation."

**Reasoning**: This prompt authorized the AI to proceed with writing the actual code for the `src/index.js` Worker and setting up the Frontend-Backend connection, ensuring the code was functional rather than just copying strings.

## 3. Development Automation (Makefile)

**Prompt Used**:
"Please make a makefile that launches everything."

**Reasoning**: Used to generate a `Makefile` that runs both the Cloudflare Worker and the Vite frontend server concurrently, simplifying the local development workflow.

## 4. Debugging AI Responses

**Prompt Used**:
"It just always says: AI: Hello! It's nice to meet you. Is there something I can help you with, or would you like to chat?"

**Reasoning**: This issue report triggered the AI to investigate the codebase. The AI identified that a hardcoded "smoke test" block was overriding user input. The fix involved removing the debug code and switching to the `@cf/meta/llama-3-8b-instruct` model for more reliable local testing.

## 5. Documentation & Privacy

**Prompt Used**:
"Will I get charged for any of this setup? Is there anything private that this repo will expose? ... Can you update prompt.md and readme.md to reflect how the project works and what we talked about please?"

**Reasoning**: This prompt led to clarifying the cost/privacy implications (updating the README to note the Free Tier usage) and updating this `PROMPTS.md` file to accurately reflect the development history.
