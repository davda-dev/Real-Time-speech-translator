# Real-Time Speech Translator - User Guide

## Overview
The Real-Time Speech Translator is a web-based application that provides instant speech recognition and translation between multiple languages. It uses advanced AI technology powered by Deepgram for speech recognition and MyMemory API for translation services.

## Features
- **Real-time speech recognition** with live transcription
- **Instant translation** between 50+ languages
- **Microphone input** for direct speech capture
- **Tab audio capture** for translating system audio/videos
- **Responsive design** that works on desktop, tablet, and mobile devices
- **Translation caching** for improved performance
- **Live status indicators** showing connection and processing status

---

## Initial Setup (For Developers)

### Environment Configuration
1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure API Keys:**
   - Open the `.env` file in a text editor
   - Replace `your_deepgram_api_key_here` with your actual Deepgram API key
   - Get your API key from [Deepgram Console](https://console.deepgram.com/)

3. **Optional Configuration:**
   - Modify default languages by changing `VITE_DEFAULT_SOURCE_LANGUAGE` and `VITE_DEFAULT_TARGET_LANGUAGE`
   - Adjust performance settings like cache size and buffer size if needed

---

## Step-by-Step Usage Guide

### 1. Accessing the Application
1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Navigate to the translator website URL
3. Wait for the application to load completely
4. You should see the main interface with language selectors and control buttons

### 2. Setting Up Languages

#### Selecting Source Language (From Language):
1. Click on the **"From Language"** dropdown menu
2. Choose your source language from the list
3. Make sure to select the language you'll be speaking

#### Selecting Target Language (To Language):
1. Click on the **"To Language"** dropdown menu
2. Select the language you want to translate TO
3. This will be the language your speech is translated into

#### Swapping Languages:
1. Click the **⇄** button between the language selectors to instantly swap source and target languages

### 3. Starting Speech Recognition

#### Option A: Using Microphone
1. Click the **"🎤 Start Microphone"** button
2. Allow microphone access when prompted by your browser
3. The status indicator will show "🟢 Connected to Deepgram - Listening..."
4. Begin speaking clearly into your microphone
5. You'll see interim results appear in the status bar as you speak

#### Option B: Capturing Tab Audio
1. Click the **"🖥️ Capture Tab Audio"** button
2. Select the tab/window you want to capture audio from
3. Make sure to check "Share audio" when prompted
4. The system will capture and translate audio from that source (videos, music, calls, etc.)

### 4. Understanding the Interface

#### Status Indicators:
- **🟡 Requesting access...** - System is requesting permissions
- **🟢 Connected - Listening...** - Ready and actively listening
- **🟡 Interim: "text"** - Showing real-time speech recognition
- **❌ Error messages** - Connection or permission issues
- **🔴 Stopped** - Not currently listening

#### Text Display Areas:
- **Left Panel (Speech Text)**: Shows the original transcribed speech
- **Right Panel (Translation)**: Shows the translated text
- **🔄 Translating...** - Temporary message while translation is processing

### 5. Managing Text Display

#### Hiding/Showing Panels:
1. Click **"👁️ Hide Speech"** to hide the speech transcription panel
2. Click **"👁️ Hide Translation"** to hide the translation panel
3. When hidden, buttons change to **"🙈 Show Speech/Translation"**
4. Hidden panels automatically expand the visible panel to full width

### 6. Stopping the Session
1. Click the **"⏹️ Stop Listening"** button to end the session
2. All audio capture will stop
3. The interface will reset and be ready for a new session

---

## Technical Requirements

### Browser Requirements:
- **Google Chrome** (recommended) - Version 70+
- **Mozilla Firefox** - Version 65+
- **Safari** - Version 12+
- **Microsoft Edge** - Version 79+

### System Requirements:
- **Microphone** (for speech input)
- **Stable internet connection** (for real-time processing)
- **Audio output** (speakers/headphones)

### Permissions Needed:
- **Microphone access** - For speech recognition
- **Screen/tab sharing** - For tab audio capture (optional)

---

## Supported Languages

The translator supports 50+ languages including:

### Major Languages:
- English, Spanish, French, German, Italian
- Portuguese, Russian, Chinese, Japanese, Korean
- Arabic, Hindi, Dutch, Swedish, Polish

### Additional Languages:
- Turkish, Czech, Hungarian, Romanian, Bulgarian
- Croatian, Slovak, Greek, Hebrew, Thai, Vietnamese
- Indonesian, Bengali, Tamil, Persian, Urdu
- And many more regional languages

### Language Codes:
Each language is identified by a standard code (e.g., 'en' for English, 'es' for Spanish)

---

## Tips for Best Results

### Speech Recognition Tips:
1. **Speak clearly** and at a moderate pace
2. **Minimize background noise** when possible
3. **Use a good quality microphone** for better accuracy
4. **Pause between sentences** for better processing
5. **Avoid overlapping speech** from multiple speakers

### Translation Quality Tips:
1. **Use complete sentences** when possible
2. **Avoid technical jargon** that may not translate well
3. **Context matters** - longer phrases translate better than single words
4. **Review translations** for accuracy, especially for important content

### Performance Tips:
1. **Close unnecessary browser tabs** to free up system resources
2. **Use a stable internet connection** for real-time processing
3. **Keep the browser tab active** for optimal performance
4. **Refresh the page** if experiencing connection issues

---

## Troubleshooting Guide

### Common Issues and Solutions:

#### "Microphone access denied"
**Solution:** 
1. Click the microphone icon in your browser's address bar
2. Select "Always allow" for microphone access
3. Refresh the page and try again

#### "No audio track available"
**Solution:**
1. When using tab capture, ensure you check "Share audio"
2. Verify the selected tab actually has audio content
3. Try selecting a different tab or window

#### "Connection error" or frequent disconnections
**Solution:**
1. Check your internet connection stability
2. Refresh the browser page
3. Try using a different browser
4. Check if firewall/antivirus is blocking WebSocket connections

#### Translation not appearing
**Solution:**
1. Ensure you've selected different source and target languages
2. Wait for complete sentences (translations trigger on punctuation)
3. Check if the target language is properly selected
4. Verify internet connection for API access

#### Poor speech recognition accuracy
**Solution:**
1. Check microphone positioning and quality
2. Reduce background noise
3. Speak more clearly and slowly
4. Try switching to a different source language if results are poor

---

## Privacy and Security

### Data Handling:
- **Speech data** is processed by Deepgram's secure servers
- **Translation data** is processed by MyMemory API
- **No permanent storage** of your speech or translations
- **Real-time processing** means data is not retained after sessions

### Best Practices:
- **Avoid sensitive information** in public or shared environments
- **Be aware** that audio is processed by third-party services
- **Use responsibly** and respect privacy of others when capturing audio

---

## Technical Specifications

### Performance Metrics:
- **Audio processing latency**: ~64ms
- **Translation response time**: 1-3 seconds
- **Speech recognition accuracy**: 90%+ (varies by language and audio quality)
- **Supported audio formats**: Linear16, 16kHz, mono channel

### API Integration:
- **Speech Recognition**: Deepgram Nova-2 model
- **Translation Service**: MyMemory API
- **Real-time WebSocket** communication for low latency

### Browser Compatibility:
- **WebRTC support** required for audio capture
- **WebSocket support** required for real-time communication
- **Modern JavaScript features** (ES6+)

---

## Frequently Asked Questions (FAQ)

**Q: Can I use this offline?**
A: No, the application requires an internet connection for speech recognition and translation services.

**Q: How many languages can I translate between in one session?**
A: You can translate between any two supported languages. To change languages, simply select new options from the dropdowns.

**Q: Is there a time limit for sessions?**
A: No explicit time limit, but longer sessions may require occasional reconnection for optimal performance.

**Q: Can I save or export the translations?**
A: The current version displays translations in real-time. You can manually copy text from the display areas.

**Q: Can multiple people speak simultaneously?**
A: The system works best with one speaker at a time. Overlapping speech may reduce accuracy.

---

## Support and Feedback

For technical issues, improvements, or feedback:
- Check the troubleshooting guide above
- Ensure your browser and system meet the requirements
- Try refreshing the application or using a different browser
- Report persistent issues with specific details about your setup

---

## Version Information
- **Application Version**: 2.0
- **Last Updated**: September 2025
- **Compatible Browsers**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **API Versions**: Deepgram v1, MyMemory v1

---

*This guide covers the complete functionality of the Real-Time Speech Translator. For the best experience, ensure you have a stable internet connection and follow the recommended usage tips.*