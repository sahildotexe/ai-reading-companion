'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { useUser } from '@clerk/nextjs';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Add this CSS at the top of your file or in a separate CSS file
const pulseAnimation = `
  @keyframes pulse {
    0% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
    100% { transform: scaleY(0.3); }
  }
`;

// Create new plugin instance

function isValidBase64(str: string) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

// Add new interface for chat messages
interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
}

export default function BookPage() {
  const params = useParams();
  const [pdfContent, setPdfContent] = useState<string | null>(null);  
  const [selectedText, setSelectedText] = useState('');

  const [error, setError] = useState<string | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useUser();

  // Add new state for chat history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    // Check for OpenAI API key in localStorage
    const apiKey = localStorage.getItem('openai_key');
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('openai_key', key);
    setShowApiKeyModal(false);
  };

  const handleTextSelection = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      console.log(selectedText);
      setSelectedText(selectedText);
    }
  };


  useEffect(() => {
    const book = localStorage.getItem("book.pdf");
    if (book) {
      if (isValidBase64(book)) {
        setPdfContent(book);
        setError(null);
      } else {
        setError("Invalid PDF data format");
      }
    }
  }, [params.bookId]);

  const startRecording = async () => {
    try {
      // Stop audio if it's playing
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {

        const recordingStoppedPromise = new Promise<string>((resolve) => {
        if (mediaRecorderRef.current) {
          const audioChunks: BlobPart[] = [];
          
          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };

          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
            resolve(audioUrl);
          };
        }
      });

      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

      // Wait for the audio URL to be created
      const audioUrl = await recordingStoppedPromise;

      try {
        setIsGenerating(true);
        setShowResponse(false);
        const response = await fetch(audioUrl);
        const audioBlob = await response.blob();

        // Create FormData and append the audio file
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');

        // Send to your API endpoint
        const transcriptionResponse = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!transcriptionResponse.ok) {
          throw new Error('Transcription failed');
        }

        const { text } = await transcriptionResponse.json();
        
        setTranscription(text);
        await getResponse(text);
        setIsGenerating(false);
        setShowResponse(true);

      } catch (error) {
        console.error('Error transcribing audio:', error);
      }
    }
  };

  const getResponse = async (text: string) => {
    // Add user message to chat history
    setChatHistory(prev => [...prev, { type: 'user', content: text }]);

    const bodyObj = {
      user_id: user?.id,
      query: text,
      api_key: localStorage.getItem('openai_key')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/ai-reader/converse-with-pdf`, {   
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyObj),
    });

    const data = await response.json();
    console.log("Data: ", data);
    
    // Add assistant message to chat history
    setChatHistory(prev => [...prev, { type: 'assistant', content: data.content }]);
    setResponse(data.content);
    
    // Get text-to-speech audio
    try {
      const speechResponse = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: data.content }),
      });

      console.log('Speech Response Status:', speechResponse.status);
      console.log('Speech Response Headers:', speechResponse.headers);

      if (!speechResponse.ok) {
        throw new Error('Text-to-speech conversion failed');
      }

      const audioBlob = await speechResponse.blob();
      console.log('Audio Blob:', audioBlob.type, audioBlob.size);
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("Audio URL: ", audioUrl);
      
      if (audioRef.current) {
        console.log('Audio element exists');
        audioRef.current.src = audioUrl;
        
        audioRef.current.onloadeddata = () => {
          console.log('Audio data loaded');
          audioRef.current?.play()
            .then(() => {
              console.log('Playing audio successfully');
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
            });
        };

        audioRef.current.onerror = (e) => {
          console.error('Error loading audio:', e);
          console.error('Audio error code:', audioRef.current?.error?.code);
          console.error('Audio error message:', audioRef.current?.error?.message);
        };

        // Add these new event listeners
        audioRef.current.oncanplay = () => console.log('Audio can play');
        audioRef.current.onwaiting = () => console.log('Audio is waiting');
        audioRef.current.onplaying = () => console.log('Audio is playing');
      } else {
        console.error('Audio element ref is null');
      }
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <main className="max-w-[85rem] w-full mx-auto p-8 relative">
      <Navbar />
      <div className="w-full mt-8 flex flex-col items-center">
        <div style={{ width: '100%', height: '80vh' }}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${process.env.NEXT_PUBLIC_PDFJS_VERSION}/build/pdf.worker.min.js`}>
            <Viewer
              fileUrl={`/${params.bookId}.pdf`}
              plugins={[
                defaultLayoutPluginInstance,
              ]}
            />
          </Worker>
        </div>
      </div>
      
      <div className="fixed bottom-8 right-8 z-50">
        {isGenerating ? (
          <div className="bg-[#131316] rounded-full p-4 shadow-lg flex items-center justify-center gap-1">
            <style>{pulseAnimation}</style>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-8 bg-white rounded-full"
                style={{
                  animation: `pulse 1s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-[#131316] text-white rounded-full p-4 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}
      </div>
      {chatHistory.length > 0 && (
        <div className="fixed bottom-24 right-8 z-50 bg-white p-4 rounded-lg shadow-lg max-w-md w-96 max-h-[60vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    if (isPlaying) {
                      audioRef.current.pause();
                    } else {
                      audioRef.current.play();
                    }
                    setIsPlaying(!isPlaying);
                  }
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => {
                  setChatHistory([]);
                  setShowResponse(false);
                  setTranscription('');
                  if (audioRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  }
                }}    
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-[#131316] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} style={{ display: 'none' }} />

      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Enter OpenAI API Key</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const key = (e.target as HTMLFormElement).apiKey.value;
              handleApiKeySubmit(key);
            }}>
              <input
                type="password"
                name="apiKey"
                placeholder="sk-..."
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#131316] text-white py-2 rounded hover:bg-opacity-90"
              >
                Save API Key
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 