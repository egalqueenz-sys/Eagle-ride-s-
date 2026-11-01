import React, { useState, useEffect, useRef } from 'react';
import { RideBooking, RideChatMessage, Language } from '../types';
import { playNotificationChime } from '../utils/audio';
import {
  Send,
  ShieldCheck,
  Lock,
  Clock,
  Sparkles,
  CheckCheck,
  User,
  Car,
  Bike,
  PhoneOff,
  CornerDownLeft,
  ArrowLeft,
  X,
} from 'lucide-react';

interface RideChatProps {
  booking: RideBooking;
  lang: Language;
  onCloseChat?: () => void;
  onUpdateBookingMessages?: (messages: RideChatMessage[]) => void;
}

export const RideChat: React.FC<RideChatProps> = ({
  booking,
  lang,
  onCloseChat,
  onUpdateBookingMessages,
}) => {
  const driverName = booking.driverName || 'Ayesha Bibi';
  const passengerName = booking.passengerName || 'Passenger';

  // Seed default greeting if empty
  const [messages, setMessages] = useState<RideChatMessage[]>(() => {
    if (booking.chatMessages && booking.chatMessages.length > 0) {
      return booking.chatMessages;
    }
    return [
      {
        id: 'msg-1',
        senderRole: 'driver',
        senderName: driverName,
        text: `Assalam-o-Alaikum ${passengerName}! I am your verified captain. I am heading to your pickup at ${booking.pickupAddress}. Please let me know if you are waiting near any specific landmark!`,
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isRead: true,
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [currentSender, setCurrentSender] = useState<'passenger' | 'driver'>('passenger');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Notify parent if callback provided
  useEffect(() => {
    if (onUpdateBookingMessages) {
      onUpdateBookingMessages(messages);
    }
  }, [messages, onUpdateBookingMessages]);

  const quickChips = [
    { en: "I'm at the Main Gate", ur: 'میں مین گیٹ پر کھڑی ہوں' },
    { en: 'Wearing pink dupatta / scarf', ur: 'گلابی دوپٹہ اوڑھا ہوا ہے' },
    { en: 'Waiting right outside Pharmacy', ur: 'فارمیسی کے بالکل باہر انتظار کر رہی ہوں' },
    { en: 'Near the ATM booth', ur: 'اے ٹی ایم کیبن کے پاس کھڑی ہوں' },
    { en: 'Please turn on hazard blinkers', ur: 'براہ کرم گاڑی کے بلنکرز آن رکھیں' },
    { en: 'I have arrived at pickup spot', ur: 'میں پک اپ پوائنٹ پر پہنچ چکی ہوں' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: RideChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: currentSender,
      senderName: currentSender === 'passenger' ? passengerName : driverName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    playNotificationChime();

    // If sent by passenger, simulate an authentic driver response to coordinate pickup specifics
    if (currentSender === 'passenger') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const driverReplies = [
          `Ji bilkul ${passengerName}! I noted that. I will pull over right by that spot in 1 minute.`,
          `Understood! I have my hazard blinkers on near the road curb. See you shortly!`,
          `Received! Please ensure you check my registration plate (MN-24-7860) before boarding safely.`,
          `Got your message! I am stopping safely at the main road point now.`,
        ];
        const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];

        const driverMsg: RideChatMessage = {
          id: `msg-drv-${Date.now()}`,
          senderRole: 'driver',
          senderName: driverName,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        };
        setMessages((prev) => [...prev, driverMsg]);
        playNotificationChime();
      }, 1400);
    }
  };

  return (
    <div className="flex flex-col h-[440px] bg-slate-50/70 rounded-2xl border border-rose-100 overflow-hidden text-xs shadow-inner">
      {/* Privacy Shield Top Banner with Back Button */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-2.5 px-3 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          {onCloseChat && (
            <button
              type="button"
              onClick={onCloseChat}
              className="p-1 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white transition-colors"
              title="Return to Trip Details"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="p-1 rounded-lg bg-emerald-700/80 text-amber-300">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-100">
              <span>Chat with Driver ({driverName})</span>
              <span className="text-[9px] bg-emerald-600/70 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                Number Masked
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/90 font-medium">
              {lang === 'ur'
                ? 'ذاتی موبائل نمبر شیئر کیے بغیر مکمل محفوظ رابطہ'
                : 'Direct in-app messaging · No phone numbers shared'}
            </p>
          </div>
        </div>

        {/* Sender Role Switcher (Passenger / Driver) */}
        <div className="flex items-center bg-black/25 rounded-lg p-0.5 text-[10px] border border-emerald-700/50">
          <button
            type="button"
            onClick={() => setCurrentSender('passenger')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              currentSender === 'passenger'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            Passenger
          </button>
          <button
            type="button"
            onClick={() => setCurrentSender('driver')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              currentSender === 'driver'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            Driver
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="text-center my-1">
          <span className="text-[10px] text-slate-400 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200/70 inline-flex items-center gap-1">
            <PhoneOff className="w-3 h-3 text-emerald-600" />
            <span>End-to-End Encrypted Session · Ride #{booking.id.slice(-6)}</span>
          </span>
        </div>

        {messages.map((msg) => {
          const isPassenger = msg.senderRole === 'passenger';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isPassenger ? 'items-end' : 'items-start'} space-y-0.5`}
            >
              <div className="flex items-center gap-1 px-1">
                <span className="text-[10px] font-bold text-slate-500">
                  {msg.senderName} ({isPassenger ? 'You' : 'Driver'})
                </span>
                <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] p-2.5 rounded-2xl shadow-xs leading-relaxed text-xs ${
                  isPassenger
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                <div
                  className={`flex justify-end items-center gap-1 mt-1 text-[9px] ${
                    isPassenger ? 'text-pink-200' : 'text-slate-400'
                  }`}
                >
                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                  <span>Delivered</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] italic bg-white/70 w-fit px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-ping"></span>
            <span>{driverName} is replying...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Pickup Coordination Chips */}
      <div className="px-3 pt-1.5 pb-1 bg-white/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-pink-700 whitespace-nowrap flex items-center gap-0.5">
          <Sparkles className="w-3 h-3" />
          <span>Quick:</span>
        </span>
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(lang === 'ur' ? chip.ur : chip.en)}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 whitespace-nowrap active:scale-95 transition-all shrink-0"
          >
            {lang === 'ur' ? chip.ur : chip.en}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            currentSender === 'passenger'
              ? 'Message captain (e.g. Near gate 2 in black abaya)...'
              : 'Reply as captain to coordinate safe spot...'
          }
          className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-800"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 px-3.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
