# J.A.R.V.I.S. Local AI Agent

A fully functional, voice-first personal AI assistant built to mirror J.A.R.V.I.S. from Iron Man. This project is built completely local, requiring **zero ongoing API costs** and running exclusively off of your local machine and native browser APIs. 

## Features
- **Local LLM Backend**: Powered exclusively by [Ollama](https://ollama.com/), meaning no token limits, no OpenAI keys, and complete data privacy.
- **Wake Word System**: J.A.R.V.I.S. remains in "Standby Mode" ignoring ambient room chatter until you explicitly say his name (e.g. "Hey Jarvis").
- **Active Sessions**: After waking him, he will remain active for 20 seconds to allow for fluid back-and-forth conversation without needing to say his name for every sentence.
- **Iron Man-Style Interrupts**: If J.A.R.V.I.S. is speaking and you want to stop him, say "Jarvis, stop." He will instantly truncate his current speech and listen to your new command.
- **Zero-Cost Voice Engine**: Utilizes the native Web Speech API (for Speech-to-Text transcription) and the SpeechSynthesis API (for Text-to-Speech) to eliminate external audio-processing costs!

## Tech Stack
- Frontend: Next.js 14+ (App Router)
- Styling: Tailwind CSS
- Voice APIs: Web Speech API (Native Chrome)
- Model Endpoint: Next.js API Routes Proxy
- AI Engine: Local Ollama (`llama2:latest`)

## Installation & Setup

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/en)
- Install [Ollama](https://ollama.com/)

### 2. Prepare the AI
J.A.R.V.I.S. requires an Ollama model to be running in the background. Open a terminal and run the following command to download and start the LLaMA 2 model:
```bash
ollama run llama2:latest
```
*Leave this terminal window open!*

### 3. Setup the Application
In a **new** terminal window, clone the repository and install the dependencies:
```bash
git clone https://github.com/chikoosuperman/Jarvis_Repo_Local.git
cd Jarvis_Repo_Local
npm install
```

### 4. Create your Environment File
Create a `.env.local` file in the root directory and add the following context variables:
```env
OLLAMA_BASE_URL=http://localhost:11434
APP_PASSWORD=your_secure_password
```
*(The APP_PASSWORD is used for Lockdown Mode if you ever program sensitive device-level actions into the agent!)*

### 5. Launch J.A.R.V.I.S.
Run the development server natively:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside **Google Chrome**. *(Note: Google Chrome is highly recommended because it offers the most robust support for the Web Speech APIs required for continuous streaming).*

Click the microphone icon to initialize the environmental scan, and say "Jarvis" to begin!

## Configuration
You can tune J.A.R.V.I.S.'s internal personality or constraints inside `src/hooks/useJarvis.ts` within the `SYSTEM_PROMPT` variable.
