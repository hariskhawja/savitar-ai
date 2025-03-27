# Cotax AI Bot

Welcome to the **Cotax AI Bot** project! This is a chat-based AI tax assistant built using Next.js, OpenAI, and TypeScript. It helps users with tax-related queries and provides useful tools, such as tax breakdowns, graphic analysis, and data tabulation.

## Vercel Website
Link: https://cotax-ai-bot.vercel.app/

## Features

- **Chat interface:** Users can ask tax-related questions and get responses powered by OpenAI.
- **Tax breakdowns:** Generate tax breakdowns using a markdown table or HTML.
- **Real-time streaming:** Provide images, text, of pdf files for the AI to analysis and offer analysis.
- **Real-time streaming:** Chat responses are streamed in real-time, offering a smooth user experience.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn** (package managers)

## Getting Started

Follow these steps to get your development environment set up:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cotax-ai-bot.git
cd cotax-ai-bot
```

### 2. Install dependencies

```bash
npm i --force
```
or
```bash
yarn install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory, then insert:
```bash
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Run the Development Server
```bash
npm run dev
```
or
```bash
yarn dev
```
