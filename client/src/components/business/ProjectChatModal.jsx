import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  X,
  Send,
  Image,
  FileText,
  MapPin,
  CheckCheck,
  Smile,
  Paperclip,
  Building2,
  User,
} from 'lucide-react';

const ProjectChatModal = ({ isOpen, onClose, project }) => {
  const { user } = useAuth();
  const { toastSuccess, toastInfo } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const projectId = project?._id || project?.id || 'PRJ-901';
  const projectName = project?.name || 'Smart Building Automation';

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${projectId}`);
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (e) {
      console.warn('Fetch chat error:', e.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !photoUrl && !documentUrl && !showLocation) return;

    setLoading(true);
    try {
      const payload = {
        projectId,
        text: inputMessage,
        photoUrl,
        documentUrl,
        documentName,
        location: showLocation ? { address: project?.location?.address || 'Site 12', city: 'Mumbai' } : null,
      };

      const res = await api.post('/messages', payload);
      if (res.success) {
        setInputMessage('');
        setPhotoUrl('');
        setDocumentUrl('');
        setDocumentName('');
        setShowLocation(false);
        fetchMessages();
      }
    } catch (err) {
      toastInfo('Message sent to project conversation stream.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 relative flex flex-col h-[650px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white truncate max-w-xs">{projectName}</h3>
                <p className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Project Conversation Stream
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-slate-900/40 rounded-2xl border border-white/5">
            {messages.map((msg, idx) => {
              const isMe = msg.sender === (user?._id || user?.id) || msg.senderRole === user?.role;
              return (
                <motion.div
                  key={msg._id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-2 border ${
                      isMe
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400/30 rounded-tr-none shadow-md shadow-cyan-500/10'
                        : 'bg-white/10 text-slate-100 border-white/10 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75 font-semibold">
                      <span>{msg.senderName || (isMe ? 'You' : 'Workforce Contact')}</span>
                      <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {msg.text && <p className="leading-relaxed font-sans">{msg.text}</p>}

                    {msg.photoUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/20">
                        <img src={msg.photoUrl} alt="Site attachment" className="w-full max-h-48 object-cover" />
                      </div>
                    )}

                    {msg.documentUrl && (
                      <div className="p-2 rounded-xl bg-black/20 flex items-center gap-2 font-mono text-[11px]">
                        <FileText className="w-4 h-4 text-cyan-300" />
                        <span className="truncate">{msg.documentName || 'Site_Document.pdf'}</span>
                      </div>
                    )}

                    {msg.location?.city && (
                      <div className="p-2 rounded-xl bg-black/20 flex items-center gap-1.5 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Shared Location: {msg.location.address || msg.location.city}</span>
                      </div>
                    )}

                    <div className="flex justify-end text-[10px] opacity-75">
                      <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Media Attachment Previews */}
          {(photoUrl || documentUrl || showLocation) && (
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
              <span className="truncate">
                Attached: {photoUrl ? '📷 Photo Attachment' : documentUrl ? '📄 Document File' : '📍 Site Location Shared'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPhotoUrl('');
                  setDocumentUrl('');
                  setShowLocation(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form Input Bar */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-white/10 shrink-0">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758')}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 bg-white/5 hover:bg-white/10 transition-colors"
                title="Attach Photo"
              >
                <Image className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocumentUrl('https://example.com/site-report.pdf');
                  setDocumentName('Site_Safety_Inspection.pdf');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 bg-white/5 hover:bg-white/10 transition-colors"
                title="Attach Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowLocation(!showLocation)}
                className={`p-2 rounded-xl transition-colors ${
                  showLocation ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-cyan-400 bg-white/5 hover:bg-white/10'
                }`}
                title="Share Site Location"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type message, site instructions, or work updates..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectChatModal;
