
import React, { useState, useRef, useEffect } from 'react';
import { solveQuestion } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { SendIcon } from './components/icons/SendIcon';
import { BotIcon } from './components/icons/BotIcon';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAsked, setHasAsked] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');
    setHasAsked(true);

    try {
      const result = await solveQuestion(question);
      setAnswer(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}. Please check your API key and network connection.`);
      } else {
        setError("An unknown error occurred while trying to get an answer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const AnswerDisplay: React.FC = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-sky-300 animate-pulse">Thinking...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8">
          <p className="text-red-400 font-semibold">Error</p>
          <p className="text-slate-300 mt-2">{error}</p>
        </div>
      );
    }

    if (answer) {
      return (
        <div className="p-6 md:p-8 text-slate-200 whitespace-pre-wrap font-serif text-lg leading-relaxed">
          {answer}
        </div>
      );
    }
    
    if (!hasAsked) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <BotIcon />
                <p className="mt-4 text-lg">Ask me anything!</p>
                <p className="text-sm">Your answer will appear here.</p>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white font-sans flex flex-col items-center p-4">
      <main className="w-full max-w-3xl flex-grow flex flex-col justify-center">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400 flex items-center justify-center gap-3">
            <SparklesIcon />
            AI Question Solver
          </h1>
          <p className="text-slate-400 mt-2">Powered by Gemini 2.5 Flash</p>
        </div>

        <div className="relative w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-900/50">
                <div id="answer-container" className="h-96 overflow-y-auto p-4 transition-all duration-500">
                    <AnswerDisplay />
                </div>

                <div className="border-t border-slate-700 p-4">
                    <form onSubmit={handleSubmit} className="flex items-end gap-3">
                    <textarea
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                        placeholder="Type your question here..."
                        rows={1}
                        className="flex-grow bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none max-h-48"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !question.trim()}
                        className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
                    >
                        <SendIcon />
                    </button>
                    </form>
                </div>
            </div>
        </div>
        <footer className="text-center mt-10 text-slate-500 text-sm">
            <p>Built by a world-class senior frontend React engineer.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
