# Real-time Speech Translator

A React application that provides real-time speech transcription and translation using the Deepgram API.

## Features

- Real-time speech transcription using Deepgram
- Real-time translation using MyMemory API
- Support for multiple languages
- Microphone and tab audio capture
- Toggle visibility of speech and translation panels
- Responsive design with fixed-height scrollable text areas

## Demo
- **YouTube Demo**: [vdo](https://youtu.be/gh04Ih8CNmk)
- **Live Website**: [web](https://real-time-speech-translator.netlify.app/ )

## Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Open `.env` and add your Deepgram API key:
   ```
   VITE_DEEPGRAM_API_KEY=your_actual_deepgram_api_key_here
   ```
   - Get your API key from [Deepgram Console](https://console.deepgram.com/)

3. **Start the development server:**
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select source and target languages
2. Click "Start Microphone" to capture from your microphone or "Capture Tab Audio" to capture from browser tab
3. Speak into your microphone or play audio in the selected tab
4. View real-time transcription and translation in the side-by-side panels
5. Use toggle buttons to show/hide speech or translation panels
6. Click "Stop Listening" to end the session

## Technologies Used

- React 18
- Vite
- Deepgram WebSocket API
- MyMemory Translation API
- Web Audio API
- MediaDevices API

## Note

Make sure to update the Deepgram API key in the App.jsx file with your own API key.
