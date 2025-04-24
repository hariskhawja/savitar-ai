# Savitar AI

Welcome to the **Savitar AI** project! This is a chat-based AI tax assistant built using Next.js, OpenAI, Vercel AI SDK, and TypeScript. It helps users with tax-related queries and provides useful tools, such as tax breakdowns, graphic analysis, and data tabulation.

## Vercel Website
Link: https://savitar-ai.vercel.app/

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
git clone https://github.com/hariskhawja/savitar-ai.git
cd savitar-ai
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

# Savitar AI Assignment Review

## Project Description
This project is a frontend web application built using the **Next.js** framework and **TypeScript** for programming. It leverages **Next.js** to set up a route to interact with the **OpenAI GPT-4o** model **API**, allowing users to engage with advanced language processing capabilities. To streamline communication between the frontend and OpenAI, the **Vercel AI SDK** is used as middleware, providing a seamless integration of the language model into the application.

## Functionalities Implemented
- **Real-time conversations** enabled between users and OpenAI's GPT-4o using the **Vercel AI SDK** `useChat` hook, ensuring seamless interactions.
- **Messages are formatted in markdown**, allowing advanced text formatting and the ability to display graphs, HTML, and tables in responses.
- **File attachments** support up to 5 files per input, including images, text, and PDF files, enabling AI to analyze visual content or scan important documents.
- **Quick reply feature** powered by the **Fisher-Yates algorithm** to randomly generate relevant questions, offering users a dynamic, guided interaction with the AI.
- **UI/UX prioritized**, using **TailwindCSS** alongside UI libraries like **ShadCN** and **Lucide-React** to create an attractive, responsive design.
- **Multimedia outputs** include markdown-formatted text, graphs from scripts, and tables, enriching the user experience with diverse content types.

## Next Steps
- **Utilize OpenAI's image generation models**, such as **DALL·E**, or convert Python scripts into real-time graphs using libraries like **PyDiode** (or a similar solution) to enhance multi-modal outputs and improve the overall user experience.
- **Integrate TanStack Query** along with **Google OAuth** to track user chat history, enabling the AI to offer a more personalized and tailored interaction for each user.
