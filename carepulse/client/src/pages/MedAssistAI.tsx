import { useState, useRef, useCallback, useEffect } from "react";
import { useKnowledgeSearch } from "@/hooks/use-medical-data";
import { Send, Mic, StopCircle, BotMessageSquare, AlertTriangle, Hospital, Camera, Paperclip, X, Loader2, FileText, Image, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

type RecordingState = "idle" | "recording";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  disclaimer?: string;
  fileNames?: string[];
  timestamp: Date;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  return FileText;
}

function getFilePreview(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
}

export default function MedAssistAI() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<(string | null)[]>([]);
  const [isAnalyzingFiles, setIsAnalyzingFiles] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const searchMutation = useKnowledgeSearch();
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addUserMessage = (text: string, fileNames?: string[]) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      fileNames,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg.id;
  };

  const addAIMessage = (text: string, disclaimer: string) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "ai",
      text,
      disclaimer,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      handleFileAnalysis();
      return;
    }
    if (!query.trim()) return;

    const userText = query.trim();
    addUserMessage(userText);
    setQuery("");

    searchMutation.mutate(
      { query: userText },
      {
        onSuccess: (data) => {
          addAIMessage(data.answer, data.disclaimer);
        },
      }
    );
  };

  const submitQuery = useCallback((text: string) => {
    if (!text.trim()) return;
    addUserMessage(text.trim());
    setQuery("");

    searchMutation.mutate(
      { query: text.trim() },
      {
        onSuccess: (data) => {
          addAIMessage(data.answer, data.disclaimer);
        },
      }
    );
  }, [searchMutation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch(e as any);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setFileError(null);

    const newFiles: File[] = [];
    const totalCount = selectedFiles.length + files.length;
    if (totalCount > 10) {
      setFileError("Maximum 10 files allowed. Please remove some files first.");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 20 * 1024 * 1024) {
        setFileError(`"${file.name}" is too large. Maximum 20MB per file.`);
        return;
      }
      newFiles.push(file);
    }

    const previews = await Promise.all(newFiles.map((f) => getFilePreview(f)));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setFilePreviews((prev) => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleFileAnalysis = async () => {
    if (selectedFiles.length === 0) return;
    const userText = query.trim() || `Analysing ${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""}`;
    const fileNames = selectedFiles.map((f) => f.name);
    addUserMessage(userText, fileNames);
    setQuery("");

    setIsAnalyzingFiles(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      if (query.trim()) formData.append("query", query.trim());

      const res = await fetch("/api/analyze-files", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Failed to analyze files" }));
        throw new Error(err.message);
      }

      const data = await res.json();
      addAIMessage(data.answer, data.disclaimer);
      clearAllFiles();
    } catch (error: any) {
      setFileError(error.message || "Failed to analyze files. Please try again.");
    } finally {
      setIsAnalyzingFiles(false);
    }
  };

  const toggleRecording = async () => {
    setMicError(null);
    if (recordingState === "recording") {
      recognitionRef.current?.stop();
      setRecordingState("idle");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMicError("Microphone access denied. Please allow microphone access.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript?.trim()) submitQuery(transcript.trim());
      setRecordingState("idle");
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech") setMicError("No speech detected. Please try again.");
      else if (event.error === "not-allowed") setMicError("Microphone access denied.");
      else setMicError(`Voice error: ${event.error}. Please try again.`);
      setRecordingState("idle");
    };

    recognition.onend = () => setRecordingState("idle");

    try {
      recognition.start();
      setRecordingState("recording");
    } catch {
      setMicError("Failed to start voice input. Please try again.");
      setRecordingState("idle");
    }
  };

  const renderInlineFormatting = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
      if (match[1]) parts.push(<strong key={`b-${match.index}`} className="font-semibold">{match[1]}</strong>);
      else if (match[2]) parts.push(<em key={`i-${match.index}`}>{match[2]}</em>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return parts.length > 0 ? parts : [text];
  };

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i} className="text-base font-bold mt-4 mb-1 text-primary">{renderInlineFormatting(line.replace("### ", ""))}</h3>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold mt-5 mb-2 text-primary border-b border-border pb-1">{renderInlineFormatting(line.replace("## ", ""))}</h2>;
      if (line.startsWith("---")) return <hr key={i} className="my-3 border-border" />;
      if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc mb-1 text-sm">{renderInlineFormatting(line.substring(2))}</li>;
      if (line.match(/^\d+\.\s/)) return <li key={i} className="ml-4 list-decimal mb-1 text-sm">{renderInlineFormatting(line.replace(/^\d+\.\s/, ""))}</li>;
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="mb-1.5 text-sm leading-relaxed">{renderInlineFormatting(line)}</p>;
    });
  };

  const isLoading = searchMutation.isPending || isAnalyzingFiles;
  const isEmpty = messages.length === 0;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto w-full">

      {/* ── Top header ── */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
          <BotMessageSquare className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-tight" data-testid="medassist-title">MedAssist AI</h1>
          <p className="text-xs text-muted-foreground">Powered by Google Gemini • Ask about symptoms, conditions, treatments</p>
        </div>
      </div>

      {/* ── Scrollable chat area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Empty state */}
        {isEmpty && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-muted-foreground/50 gap-4 py-8"
          >
            <BotMessageSquare className="h-14 w-14" />
            <p className="text-center text-sm">Ask me anything about health, diseases, or symptoms.<br />Upload files for instant analysis.</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {["Blood Pressure", "Diabetes", "Dengue", "Heart Attack", "Back Pain", "Skin Rash"].map((topic) => (
                <button
                  key={topic}
                  onClick={() => submitQuery(topic)}
                  className="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  data-testid={`topic-${topic.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <Paperclip className="h-3.5 w-3.5" />
              <span>Upload images, PDFs, or medical files — multiple files supported</span>
            </div>
          </motion.div>
        )}

        {/* Chat messages */}
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gradient-to-tr from-primary to-accent text-white"
              }`}>
                {msg.role === "user"
                  ? <User className="h-4 w-4" />
                  : <BotMessageSquare className="h-4 w-4" />
                }
              </div>

              {/* Bubble */}
              <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {/* User message bubble */}
                {msg.role === "user" && (
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {msg.fileNames && msg.fileNames.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.fileNames.map((name, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-primary-foreground/80 text-xs">
                            <Paperclip className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[180px]">{name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* AI message bubble */}
                {msg.role === "ai" && (
                  <div className="space-y-2 w-full">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm" data-testid="ai-response">
                      <div className="prose max-w-none text-foreground/90">
                        {renderMarkdown(msg.text)}
                      </div>
                    </div>

                    {/* Hospital link */}
                    <Link href="/hospitals" className="flex items-center gap-2.5 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2 hover:border-primary/30 transition-colors group cursor-pointer">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Hospital className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Find Nearby Hospitals</p>
                        <p className="text-[10px] text-muted-foreground">Browse 70,000+ hospitals across India</p>
                      </div>
                    </Link>

                    {/* Disclaimer */}
                    {msg.disclaimer && (
                      <div className="flex gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <p className="text-xs leading-relaxed">{msg.disclaimer}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Timestamp */}
                <span className="text-[10px] text-muted-foreground px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shrink-0">
              <BotMessageSquare className="h-4 w-4 text-white" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5" data-testid="loading-text">
                <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-xs text-muted-foreground ml-1">
                  {isAnalyzingFiles ? "Analysing files..." : "MedAssist is thinking..."}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Fixed bottom input area ── */}
      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm px-4 pt-2 pb-4 space-y-2">

        {/* Error banners */}
        <AnimatePresence>
          {fileError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400 text-xs"
            >
              <Paperclip className="h-3.5 w-3.5 shrink-0" />
              <span data-testid="file-error" className="flex-1">{fileError}</span>
              <button onClick={() => setFileError(null)} className="p-0.5 hover:bg-orange-500/10 rounded" data-testid="dismiss-file-error">
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          )}
          {micError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">{micError}</span>
              <button onClick={() => setMicError(null)} className="p-0.5 hover:bg-red-500/10 rounded">
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected files preview */}
        {selectedFiles.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-medium text-muted-foreground" data-testid="file-count">
                {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} attached
              </span>
              <button onClick={clearAllFiles} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors" data-testid="clear-all-files">
                Remove all
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedFiles.map((file, index) => {
                const IconComponent = getFileIcon(file.type);
                const preview = filePreviews[index];
                return (
                  <div key={`${file.name}-${index}`} className="flex items-center gap-1.5 p-1.5 bg-card border border-border rounded-lg max-w-[160px]" data-testid={`file-preview-${index}`}>
                    {preview
                      ? <img src={preview} alt={file.name} className="h-7 w-7 object-cover rounded shrink-0" />
                      : <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center shrink-0"><IconComponent className="h-3.5 w-3.5 text-primary" /></div>
                    }
                    <p className="text-[10px] truncate flex-1">{file.name}</p>
                    <button onClick={() => removeFile(index)} className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground shrink-0" data-testid={`remove-file-${index}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Input row */}
        <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" data-testid="file-input" />
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" data-testid="camera-input" />

        <form onSubmit={handleSearch} className="flex items-end gap-2" data-testid="chat-form">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder={selectedFiles.length > 0 ? "Add a question about the file(s) (optional)..." : "Ask about any disease, symptom, or treatment... (Enter to send)"}
              rows={1}
              className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm resize-none leading-relaxed"
              style={{ maxHeight: "120px" }}
              data-testid="chat-input"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 pb-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
              title="Attach files"
              data-testid="attach-file-button"
            >
              <Paperclip className="h-4.5 w-4.5" />
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isLoading}
              className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
              title="Camera"
              data-testid="camera-button"
            >
              <Camera className="h-4.5 w-4.5" />
            </button>

            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoading}
              className={`p-2.5 rounded-xl transition-all disabled:opacity-50 ${
                recordingState === "recording"
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title={recordingState === "recording" ? "Stop recording" : "Voice input"}
              data-testid="mic-button"
            >
              {recordingState === "recording" ? <StopCircle className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
            </button>

            <button
              type="submit"
              disabled={(!query.trim() && selectedFiles.length === 0) || isLoading}
              className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-primary/20"
              data-testid="send-button"
            >
              {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
