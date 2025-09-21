import { useState, useEffect, useRef } from 'react';

const App = () => {
  // Environment Configuration
  const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || '6edebee874225ed8679554b9f4899c2972aa83b1';
  const DEEPGRAM_URL = 'wss://api.deepgram.com/v1/listen';
  const MYMEMORY_API_ENDPOINT = import.meta.env.VITE_MYMEMORY_API_ENDPOINT || 'https://api.mymemory.translated.net/get';
  const DEFAULT_SOURCE_LANGUAGE = import.meta.env.VITE_DEFAULT_SOURCE_LANGUAGE || 'en';
  const DEFAULT_TARGET_LANGUAGE = import.meta.env.VITE_DEFAULT_TARGET_LANGUAGE || 'es';

  // State variables
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState({ message: 'Ready to start', connected: false });
  const [sourceLanguage, setSourceLanguage] = useState(DEFAULT_SOURCE_LANGUAGE);
  const [targetLanguage, setTargetLanguage] = useState(DEFAULT_TARGET_LANGUAGE);
  const [speechLines, setSpeechLines] = useState([]);
  const [translationLines, setTranslationLines] = useState([]);
  const [speechVisible, setSpeechVisible] = useState(true);
  const [translationVisible, setTranslationVisible] = useState(true);

  // Refs
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const deepgramSocketRef = useRef(null);
  const pendingTextRef = useRef('');
  const finalTranscriptsRef = useRef([]);
  const originalTextRef = useRef(null);
  const translatedTextRef = useRef(null);

  // Language mapping
  const languageNames = {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'it': 'Italian',
    'de': 'German', 'pt': 'Portuguese', 'ru': 'Russian', 'zh': 'Chinese',
    'ja': 'Japanese', 'ko': 'Korean', 'ar': 'Arabic', 'hi': 'Hindi',
    'nl': 'Dutch', 'sv': 'Swedish', 'da': 'Danish', 'no': 'Norwegian',
    'fi': 'Finnish', 'pl': 'Polish', 'tr': 'Turkish', 'cs': 'Czech',
    'hu': 'Hungarian', 'ro': 'Romanian', 'bg': 'Bulgarian', 'hr': 'Croatian',
    'sk': 'Slovak', 'sl': 'Slovenian', 'et': 'Estonian', 'lv': 'Latvian',
    'lt': 'Lithuanian', 'uk': 'Ukrainian', 'el': 'Greek', 'he': 'Hebrew',
    'th': 'Thai', 'vi': 'Vietnamese', 'id': 'Indonesian', 'ms': 'Malay',
    'tl': 'Filipino', 'ca': 'Catalan', 'eu': 'Basque', 'gl': 'Galician',
    'is': 'Icelandic', 'mt': 'Maltese', 'cy': 'Welsh', 'ga': 'Irish',
    'mk': 'Macedonian', 'sq': 'Albanian', 'be': 'Belarusian', 'fa': 'Persian',
    'ur': 'Urdu', 'bn': 'Bengali', 'ta': 'Tamil', 'te': 'Telugu',
    'ml': 'Malayalam', 'kn': 'Kannada', 'gu': 'Gujarati', 'pa': 'Punjabi',
    'mr': 'Marathi', 'ne': 'Nepali', 'si': 'Sinhala', 'my': 'Myanmar',
    'km': 'Khmer', 'lo': 'Lao', 'ka': 'Georgian', 'hy': 'Armenian',
    'az': 'Azerbaijani', 'kk': 'Kazakh', 'ky': 'Kyrgyz', 'uz': 'Uzbek',
    'tg': 'Tajik', 'mn': 'Mongolian', 'af': 'Afrikaans', 'sw': 'Swahili',
    'am': 'Amharic', 'zu': 'Zulu', 'xh': 'Xhosa', 'yo': 'Yoruba',
    'ig': 'Igbo', 'ha': 'Hausa', 'so': 'Somali'
  };

  // Language options (sorted alphabetically)
  const languageOptions = [
    { value: 'af', label: 'Afrikaans (af)' },
    { value: 'sq', label: 'Albanian (sq)' },
    { value: 'am', label: 'Amharic (am)' },
    { value: 'ar', label: 'Arabic (ar)' },
    { value: 'hy', label: 'Armenian (hy)' },
    { value: 'az', label: 'Azerbaijani (az)' },
    { value: 'eu', label: 'Basque (eu)' },
    { value: 'be', label: 'Belarusian (be)' },
    { value: 'bn', label: 'Bengali (bn)' },
    { value: 'bg', label: 'Bulgarian (bg)' },
    { value: 'ca', label: 'Catalan (ca)' },
    { value: 'zh', label: 'Chinese (zh)' },
    { value: 'hr', label: 'Croatian (hr)' },
    { value: 'cs', label: 'Czech (cs)' },
    { value: 'da', label: 'Danish (da)' },
    { value: 'nl', label: 'Dutch (nl)' },
    { value: 'en', label: 'English (en)' },
    { value: 'et', label: 'Estonian (et)' },
    { value: 'tl', label: 'Filipino (tl)' },
    { value: 'fi', label: 'Finnish (fi)' },
    { value: 'fr', label: 'French (fr)' },
    { value: 'gl', label: 'Galician (gl)' },
    { value: 'ka', label: 'Georgian (ka)' },
    { value: 'de', label: 'German (de)' },
    { value: 'el', label: 'Greek (el)' },
    { value: 'gu', label: 'Gujarati (gu)' },
    { value: 'ha', label: 'Hausa (ha)' },
    { value: 'he', label: 'Hebrew (he)' },
    { value: 'hi', label: 'Hindi (hi)' },
    { value: 'hu', label: 'Hungarian (hu)' },
    { value: 'is', label: 'Icelandic (is)' },
    { value: 'ig', label: 'Igbo (ig)' },
    { value: 'id', label: 'Indonesian (id)' },
    { value: 'ga', label: 'Irish (ga)' },
    { value: 'it', label: 'Italian (it)' },
    { value: 'ja', label: 'Japanese (ja)' },
    { value: 'kn', label: 'Kannada (kn)' },
    { value: 'kk', label: 'Kazakh (kk)' },
    { value: 'km', label: 'Khmer (km)' },
    { value: 'ko', label: 'Korean (ko)' },
    { value: 'ky', label: 'Kyrgyz (ky)' },
    { value: 'lo', label: 'Lao (lo)' },
    { value: 'lv', label: 'Latvian (lv)' },
    { value: 'lt', label: 'Lithuanian (lt)' },
    { value: 'mk', label: 'Macedonian (mk)' },
    { value: 'ms', label: 'Malay (ms)' },
    { value: 'ml', label: 'Malayalam (ml)' },
    { value: 'mt', label: 'Maltese (mt)' },
    { value: 'mr', label: 'Marathi (mr)' },
    { value: 'mn', label: 'Mongolian (mn)' },
    { value: 'my', label: 'Myanmar (my)' },
    { value: 'ne', label: 'Nepali (ne)' },
    { value: 'no', label: 'Norwegian (no)' },
    { value: 'pa', label: 'Punjabi (pa)' },
    { value: 'fa', label: 'Persian (fa)' },
    { value: 'pl', label: 'Polish (pl)' },
    { value: 'pt', label: 'Portuguese (pt)' },
    { value: 'ro', label: 'Romanian (ro)' },
    { value: 'ru', label: 'Russian (ru)' },
    { value: 'si', label: 'Sinhala (si)' },
    { value: 'sk', label: 'Slovak (sk)' },
    { value: 'sl', label: 'Slovenian (sl)' },
    { value: 'so', label: 'Somali (so)' },
    { value: 'es', label: 'Spanish (es)' },
    { value: 'sw', label: 'Swahili (sw)' },
    { value: 'sv', label: 'Swedish (sv)' },
    { value: 'tg', label: 'Tajik (tg)' },
    { value: 'ta', label: 'Tamil (ta)' },
    { value: 'te', label: 'Telugu (te)' },
    { value: 'th', label: 'Thai (th)' },
    { value: 'tr', label: 'Turkish (tr)' },
    { value: 'uk', label: 'Ukrainian (uk)' },
    { value: 'ur', label: 'Urdu (ur)' },
    { value: 'uz', label: 'Uzbek (uz)' },
    { value: 'vi', label: 'Vietnamese (vi)' },
    { value: 'cy', label: 'Welsh (cy)' },
    { value: 'xh', label: 'Xhosa (xh)' },
    { value: 'yo', label: 'Yoruba (yo)' },
    { value: 'zu', label: 'Zulu (zu)' }
  ];

  // Update status
  const updateStatus = (message, connected = false) => {
    setStatus({ message, connected });
  };

  // Translation function
  const translateText = async (text, sourceLang, targetLang) => {
    if (!text || !targetLang || targetLang === sourceLang) return text;
    
    try {
      const langPair = `${sourceLang}|${targetLang}`;
      const response = await fetch(`${MYMEMORY_API_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${langPair}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.responseStatus === 200 && result.responseData?.translatedText) {
          const translated = result.responseData.translatedText.trim();
          return translated;
        }
      }
      return text;
    } catch (error) {
      return text;
    }
  };

  // Check if text has sentence-ending punctuation
  const hasSentenceEnding = (text) => {
    return /[.!?]/.test(text);
  };

  // Update speech display
  const updateSpeechDisplay = (newSpeechText, newTranslationText) => {
    setSpeechLines(prev => [...prev, newSpeechText]);
    setTranslationLines(prev => [...prev, newTranslationText]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      if (originalTextRef.current) {
        originalTextRef.current.scrollTop = originalTextRef.current.scrollHeight;
      }
      if (translatedTextRef.current) {
        translatedTextRef.current.scrollTop = translatedTextRef.current.scrollHeight;
      }
    }, 100);
  };

  // Process translation for complete sentences
  const processTranslation = async (text, sourceLang) => {
    if (targetLanguage === sourceLang) {
      return;
    }

    pendingTextRef.current += (pendingTextRef.current ? ' ' : '') + text;

    if (hasSentenceEnding(text)) {
      const textToTranslate = pendingTextRef.current.trim();
      if (textToTranslate) {
        const translatedTextResult = await translateText(textToTranslate, sourceLang, targetLanguage);
        
        // Update display using rolling buffer
        updateSpeechDisplay(textToTranslate, translatedTextResult);
        
        // Clear pending text
        pendingTextRef.current = '';
      }
    }
  };

  // Handle Deepgram response
  const handleDeepgramResponse = (response) => {
    // Handle transcription results
    if (response.channel?.alternatives?.length > 0) {
      const alternative = response.channel.alternatives[0];
      const transcript = alternative.transcript;
      const confidence = alternative.confidence;
      const isFinal = response.is_final;

      if (transcript && transcript.trim()) {
        if (isFinal) {
          // Process FINAL transcripts only
          const sourceLang = sourceLanguage;
          
          // Save final transcript
          finalTranscriptsRef.current.push({
            text: transcript,
            confidence: confidence,
            timestamp: new Date().toISOString(),
            language: sourceLang
          });

          // Process for translation
          processTranslation(transcript, sourceLang);
        } else {
          // Show interim results in status
          updateStatus(`🟡 Interim: "${transcript}"`, true);
        }
      }
    }
  };

  // Connect to Deepgram WebSocket
  const connectToDeepgram = () => {
    const params = new URLSearchParams({
      encoding: 'linear16',
      sample_rate: 16000,
      channels: 1,
      interim_results: true,
      punctuate: true,
      smart_format: true,
      model: 'nova-2',
      utterance_end_ms: 1000,
      vad_events: true
    });

    // Add language detection or specific language
    if (sourceLanguage === 'auto') {
      params.append('detect_language', 'true');
    } else {
      params.append('language', sourceLanguage);
    }

    const wsUrl = `${DEEPGRAM_URL}?${params.toString()}`;

    try {
      deepgramSocketRef.current = new WebSocket(wsUrl, ['token', DEEPGRAM_API_KEY]);

      deepgramSocketRef.current.onopen = () => {
        updateStatus('🟢 Connected to Deepgram - Listening...', true);
      };

      deepgramSocketRef.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        handleDeepgramResponse(response);
      };

      deepgramSocketRef.current.onerror = () => {
        updateStatus('❌ Deepgram connection error');
      };

      deepgramSocketRef.current.onclose = () => {
        updateStatus('🔴 Disconnected from Deepgram');
      };

    } catch (error) {
      updateStatus('❌ Failed to connect to Deepgram');
    }
  };

  // Setup audio processing
  const setupAudioProcessing = async (useTabAudio = false) => {
    const audioOptions = useTabAudio 
      ? {
          video: true,
          audio: {
            mediaSource: 'system',
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        }
      : { 
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        };

    try {
      const getMedia = useTabAudio 
        ? navigator.mediaDevices.getDisplayMedia(audioOptions)
        : navigator.mediaDevices.getUserMedia(audioOptions);

      const stream = await getMedia;
      mediaStreamRef.current = stream;
      
      // Check if audio tracks are available
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('No audio track available. Make sure to share audio when prompted.');
      }

      // Handle stream ending (user stops sharing)
      if (useTabAudio) {
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          stopListening();
        });
      }

      // Create audio context for processing
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      // Create script processor for real-time audio data
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (event) => {
        if (deepgramSocketRef.current && deepgramSocketRef.current.readyState === WebSocket.OPEN) {
          const inputBuffer = event.inputBuffer;
          const inputData = inputBuffer.getChannelData(0);
          
          // Check for audio activity
          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += Math.abs(inputData[i]);
          }
          const audioLevel = sum / inputData.length;
          
          // Only send if there's some audio activity (above noise threshold)
          if (audioLevel > 0.001) {
            // Convert float32 to int16 for Deepgram
            const int16Buffer = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              int16Buffer[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
            }
            
            // Send raw audio data to Deepgram
            deepgramSocketRef.current.send(int16Buffer.buffer);
          }
        }
      };
      
      // Connect audio processing pipeline
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      
      // Connect to Deepgram after audio setup
      connectToDeepgram();
      
    } catch (error) {
      if (useTabAudio) {
        updateStatus('❌ Screen capture denied or no audio shared');
      } else {
        updateStatus('❌ Microphone access denied');
      }
      setIsListening(false);
    }
  };

  // Start listening
  const startListening = (useTabAudio = false) => {
    if (isListening) return;
    
    // Clear previous results
    setSpeechLines([]);
    setTranslationLines([]);
    finalTranscriptsRef.current = [];
    pendingTextRef.current = '';
    
    setIsListening(true);
    setupAudioProcessing(useTabAudio);
  };

  // Stop listening
  const stopListening = () => {
    if (!isListening) return;
    
    setIsListening(false);
    
    // Close Deepgram connection
    if (deepgramSocketRef.current && deepgramSocketRef.current.readyState === WebSocket.OPEN) {
      deepgramSocketRef.current.send(JSON.stringify({type: 'CloseStream'}));
      deepgramSocketRef.current.close();
      deepgramSocketRef.current = null;
    }
    
    // Stop audio stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    updateStatus('🔴 Stopped - Ready to start again');
  };

  // Toggle visibility functions
  const toggleSpeechText = () => {
    setSpeechVisible(!speechVisible);
  };

  const toggleTranslationText = () => {
    setTranslationVisible(!translationVisible);
  };

  // Check for required APIs on mount
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      updateStatus('❌ Microphone access not supported in this browser');
    }
  }, []);

  // Swap languages function
  const swapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
    }
  };

  return (
    <div className="app-container">
      <div className="main-card">
        {/* Header */}
        <div className="header">
          <h1>🌍 Real-Time Translator</h1>
          <p>Powered by Deepgram AI • Live speech recognition and translation</p>
        </div>

        <div className="content-area">
          {/* Language Selection */}
          <div className="language-selector">
            <div className="language-row">
              <div className="language-group">
                <label htmlFor="source">From Language</label>
                <select 
                  id="source" 
                  className="language-select"
                  value={sourceLanguage} 
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  aria-label="Source language"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className="swap-button"
                onClick={swapLanguages}
                disabled={sourceLanguage === 'auto'}
                title="Swap languages"
                aria-label="Swap source and target languages"
              >
                ⇄
              </button>
              
              <div className="language-group">
                <label htmlFor="target">To Language</label>
                <select 
                  id="target" 
                  className="language-select"
                  value={targetLanguage} 
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  aria-label="Target language"
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className={`status-indicator ${status.connected ? 'status-connected' : 'status-disconnected'}`}>
            <span>{status.message}</span>
          </div>

          {/* Controls */}
          <div className="controls-section">
            <div className="recording-controls">
              <button 
                className="btn btn-primary" 
                disabled={isListening}
                onClick={() => {
                  updateStatus('🟡 Requesting microphone access...');
                  startListening(false);
                }}
                aria-label="Start microphone recording"
              >
                <span>🎤</span>
                Start Microphone
              </button>
              
              <button 
                className="btn btn-secondary" 
                disabled={isListening}
                onClick={() => {
                  updateStatus('🟡 Requesting screen share with audio...');
                  startListening(true);
                }}
                aria-label="Start tab audio capture"
              >
                <span>🖥️</span>
                Capture Tab Audio
              </button>
              
              <button 
                className="btn btn-danger" 
                disabled={!isListening}
                onClick={stopListening}
                aria-label="Stop recording"
              >
                <span>⏹️</span>
                Stop Listening
              </button>
            </div>
            
            <div className="visibility-controls">
              <button 
                className={`btn btn-toggle ${speechVisible ? 'active' : ''}`}
                onClick={toggleSpeechText}
                aria-label={speechVisible ? 'Hide speech text' : 'Show speech text'}
              >
                <span>{speechVisible ? '👁️' : '🙈'}</span>
                {speechVisible ? 'Hide Speech' : 'Show Speech'}
              </button>
              
              <button 
                className={`btn btn-toggle ${translationVisible ? 'active' : ''}`}
                onClick={toggleTranslationText}
                aria-label={translationVisible ? 'Hide translation text' : 'Show translation text'}
              >
                <span>{translationVisible ? '👁️' : '🙈'}</span>
                {translationVisible ? 'Hide Translation' : 'Show Translation'}
              </button>
            </div>
          </div>

          {/* Text Display Areas */}
          <div className="text-areas">
            <div className={`text-column ${!speechVisible ? 'hidden' : ''}`}>
              <div className="text-column-header speech-header">
                <span>🎤</span>
                Speech Text
              </div>
              <div 
                ref={originalTextRef}
                className="text-content"
                role="log"
                aria-live="polite"
                aria-label="Speech transcription"
              >
                {speechLines.length > 0 ? (
                  speechLines.join('\n\n')
                ) : (
                  <div className="empty-state">
                    🎙️ Start speaking...
                  </div>
                )}
              </div>
            </div>
            
            <div className={`text-column ${!translationVisible ? 'hidden' : ''}`}>
              <div className="text-column-header translation-header">
                <span>🌐</span>
                Translation
                <span style={{ fontSize: '12px', opacity: 0.8 }}>
                  ({languageNames[targetLanguage] || targetLanguage})
                </span>
              </div>
              <div 
                ref={translatedTextRef}
                className="text-content"
                role="log"
                aria-live="polite"
                aria-label="Translation output"
              >
                {translationLines.length > 0 ? (
                  translationLines.join('\n\n')
                ) : (
                  <div className="empty-state">
                    🔄 Translations will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;