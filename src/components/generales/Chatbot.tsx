import React, { useCallback, useEffect, useState } from 'react';
import { ChatAlt2Icon, XIcon } from '@heroicons/react/outline';

import api from '../../services/api';

interface ChatbotQuestion {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const useChatbotQuestions = () => {
  const [questions, setQuestions] = useState<ChatbotQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/chatbot/questions');
        setQuestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error cargando preguntas del chatbot:', error);
      } finally {
        setLoading(false);
      }
    };
    void loadQuestions();
  }, []);

  return { questions, loading };
};

const useChatbotEvents = (
  isOpen: boolean,
  handleOpen: () => void,
  handleClose: () => void
): void => {
  useEffect(() => {
    const handleOpenChatbot = () => {
      if (!isOpen) {
        handleOpen();
      }
    };
    const handleCloseChatbot = () => {
      if (isOpen) {
        handleClose();
      }
    };
    window.addEventListener('open-chatbot', handleOpenChatbot);
    window.addEventListener('close-chatbot', handleCloseChatbot);
    return () => {
      window.removeEventListener('open-chatbot', handleOpenChatbot);
      window.removeEventListener('close-chatbot', handleCloseChatbot);
    };
  }, [isOpen, handleOpen, handleClose]);
};

interface ChatbotButtonProps {
  onOpen: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onOpen }) => (
  <button
    onClick={onOpen}
    data-tutorial="chatbot"
    className="fixed bottom-4 right-4 md:bottom-[4rem] md:right-[2rem] z-50 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 md:p-[1.15rem] shadow-lg transition-all hover:scale-110 scale-[0.966] md:scale-[1.15]"
    aria-label="Abrir chatbot"
  >
    <ChatAlt2Icon className="h-5 w-5 md:h-[1.725rem] md:w-[1.725rem]" />
  </button>
);

interface ChatbotHeaderProps {
  onClose: () => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({ onClose }) => (
  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-600 to-primary-700 border-b border-primary-800">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <ChatAlt2Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white">Prefa</h3>
    </div>
    <button
      onClick={onClose}
      className="text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors md:p-1"
      aria-label="Cerrar chatbot"
    >
      <XIcon className="h-6 w-6 md:h-5 md:w-5" />
    </button>
  </div>
);

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping }) => (
  <div className="space-y-4">
    {messages.map((msg) => (
      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
            msg.type === 'user'
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-tr-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-600'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        </div>
      </div>
    ))}
    {isTyping && (
      <div className="flex justify-start">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
          <TypingIndicator />
        </div>
      </div>
    )}
  </div>
);

interface QuestionsMasonryProps {
  questions: ChatbotQuestion[];
  onQuestionClick: (question: ChatbotQuestion) => Promise<void>;
}

const QuestionsMasonry: React.FC<QuestionsMasonryProps> = ({ questions, onQuestionClick }) => {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount(window.innerWidth < 768 ? 1 : 3);
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  const handleQuestionClick = (q: ChatbotQuestion) => {
    void onQuestionClick(q);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Selecciona una pregunta:
      </p>
      <div
        className="overflow-y-auto pb-2"
        style={{
          columnCount,
          columnGap: '0.75rem',
          columnFill: 'balance',
        }}
      >
        {questions.map((q) => (
          <button
            key={q._id}
            onClick={() => {
              handleQuestionClick(q);
            }}
            className="px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 hover:shadow-md transition-all duration-200 text-left w-full mb-3 break-inside-avoid border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700"
            style={{ display: 'inline-block', width: '100%' }}
          >
            {q.question}
          </button>
        ))}
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce" />
    <div
      className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: '0.15s' }}
    />
    <div
      className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: '0.3s' }}
    />
  </div>
);

interface ChatbotWindowProps {
  onClose: () => void;
  questions: ChatbotQuestion[];
  messages: ChatMessage[];
  isTyping: boolean;
  showQuestions: boolean;
  showGreeting: boolean;
  onQuestionClick: (question: ChatbotQuestion) => Promise<void>;
}

const ChatbotWindow: React.FC<ChatbotWindowProps> = ({
  onClose,
  questions,
  messages,
  isTyping,
  showQuestions,
  showGreeting,
  onQuestionClick,
}) => (
  <div className="fixed inset-0 md:inset-auto md:bottom-[4rem] md:right-[2rem] z-50 w-full md:w-[30.8rem] md:max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 md:rounded-2xl shadow-2xl border-0 md:border border-gray-200 dark:border-gray-700 flex flex-col h-full md:h-[650px] overflow-hidden">
    <ChatbotHeader onClose={onClose} />
    <div className="flex-1 overflow-y-auto p-4 md:p-5 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="space-y-4">
        {isTyping && messages.length === 0 && !showGreeting && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        {showGreeting && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm p-4 shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                Hola, soy Prefa, ¿cómo puedo ayudarte el día de hoy?
              </p>
            </div>
          </div>
        )}
        {messages.length > 0 && <ChatMessages messages={messages} isTyping={isTyping} />}
      </div>
      {showQuestions && !isTyping && showGreeting && (
        <div className="mt-6">
          <QuestionsMasonry questions={questions} onQuestionClick={onQuestionClick} />
        </div>
      )}
    </div>
  </div>
);

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const { questions, loading } = useChatbotQuestions();

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setMessages([]);
    setIsTyping(true);
    setShowQuestions(true);
    setShowGreeting(false);

    setTimeout(() => {
      setIsTyping(false);
      setShowGreeting(true);
    }, 2000);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setMessages([]);
    setIsTyping(false);
    setShowQuestions(true);
    setShowGreeting(false);
  }, []);

  useChatbotEvents(isOpen, handleOpen, handleClose);

  const handleQuestionClick = useCallback(async (question: ChatbotQuestion) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question.question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowQuestions(false);
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: question.answer,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
    setShowQuestions(true);
  }, []);

  if (loading || questions.length === 0) {
    return null;
  }

  return (
    <ChatbotRenderer
      isOpen={isOpen}
      questions={questions}
      messages={messages}
      isTyping={isTyping}
      showQuestions={showQuestions}
      showGreeting={showGreeting}
      onOpen={handleOpen}
      onClose={handleClose}
      onQuestionClick={handleQuestionClick}
    />
  );
};

interface ChatbotRendererProps {
  isOpen: boolean;
  questions: ChatbotQuestion[];
  messages: ChatMessage[];
  isTyping: boolean;
  showQuestions: boolean;
  showGreeting: boolean;
  onOpen: () => void;
  onClose: () => void;
  onQuestionClick: (question: ChatbotQuestion) => Promise<void>;
}

const ChatbotRenderer: React.FC<ChatbotRendererProps> = ({
  isOpen,
  questions,
  messages,
  isTyping,
  showQuestions,
  showGreeting,
  onOpen,
  onClose,
  onQuestionClick,
}) => {
  if (!isOpen) {
    return <ChatbotButton onOpen={onOpen} />;
  }
  return (
    <ChatbotWindow
      onClose={onClose}
      questions={questions}
      messages={messages}
      isTyping={isTyping}
      showQuestions={showQuestions}
      showGreeting={showGreeting}
      onQuestionClick={onQuestionClick}
    />
  );
};

export default Chatbot;
