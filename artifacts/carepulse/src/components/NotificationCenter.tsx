import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Heart, Shield, Pill, IdCard, Lightbulb, Check, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  link?: string;
}

const healthTips = [
  { title: "Stay Hydrated", description: "Drink at least 8 glasses of water daily for optimal health." },
  { title: "Move More", description: "Take a 5-minute walk every hour to improve circulation." },
  { title: "Sleep Well", description: "Aim for 7-9 hours of quality sleep each night." },
  { title: "Eat Your Greens", description: "Include leafy vegetables in at least one meal daily." },
  { title: "Practice Mindfulness", description: "Spend 10 minutes daily on deep breathing or meditation." },
  { title: "Limit Screen Time", description: "Take regular breaks from screens to reduce eye strain." },
];

function getNotifications(): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  notifications.push({
    id: "welcome",
    icon: <Heart className="h-4 w-4 text-red-500" />,
    title: "Welcome back!",
    description: "We're glad to see you again. Stay on top of your health.",
    time: "Just now",
    link: "/",
  });

  const tipIndex = now.getHours() % healthTips.length;
  const tip = healthTips[tipIndex];
  notifications.push({
    id: "health-tip",
    icon: <Lightbulb className="h-4 w-4 text-yellow-500" />,
    title: tip.title,
    description: tip.description,
    time: "1h ago",
    link: "/health-tools",
  });

  const medicalId = localStorage.getItem("carepulse-medical-id");
  if (!medicalId) {
    notifications.push({
      id: "medical-id",
      icon: <IdCard className="h-4 w-4 text-blue-500" />,
      title: "Complete your Medical ID",
      description: "Set up your emergency medical ID card for quick access in emergencies.",
      time: "2h ago",
      link: "/medical-id",
    });
  }

  notifications.push({
    id: "drug-checker",
    icon: <Pill className="h-4 w-4 text-purple-500" />,
    title: "Try the Drug Interaction Checker",
    description: "Check if your medications have any interactions with our AI-powered tool.",
    time: "3h ago",
    link: "/drug-checker",
  });

  const settings = localStorage.getItem("carepulse-settings");
  if (settings) {
    try {
      const parsed = JSON.parse(settings);
      if (parsed.twoFactorEnabled) {
        notifications.push({
          id: "2fa-secured",
          icon: <Shield className="h-4 w-4 text-green-500" />,
          title: "Your account is secured",
          description: "Two-factor authentication is enabled on your account.",
          time: "5h ago",
          link: "/settings",
        });
      }
    } catch {}
  }

  return notifications;
}

export function NotificationCenter() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [clearedIds, setClearedIds] = useState<string[]>([]);
  const [notifications] = useState<Notification[]>(getNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("carepulse-notifications-read");
    if (stored) {
      try { setReadIds(JSON.parse(stored)); } catch {}
    }
    const cleared = localStorage.getItem("carepulse-notifications-cleared");
    if (cleared) {
      try { setClearedIds(JSON.parse(cleared)); } catch {}
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const visibleNotifications = notifications.filter((n) => !clearedIds.includes(n.id));
  const unreadCount = visibleNotifications.filter((n) => !readIds.includes(n.id)).length;

  function markAllRead() {
    const allIds = visibleNotifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem("carepulse-notifications-read", JSON.stringify(allIds));
  }

  function clearAll() {
    const allIds = notifications.map((n) => n.id);
    setClearedIds(allIds);
    localStorage.setItem("carepulse-notifications-cleared", JSON.stringify(allIds));
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Check className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
                {visibleNotifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {visibleNotifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : visibleNotifications.map((n) => {
                const isRead = readIds.includes(n.id);
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (!readIds.includes(n.id)) {
                        const updated = [...readIds, n.id];
                        setReadIds(updated);
                        localStorage.setItem("carepulse-notifications-read", JSON.stringify(updated));
                      }
                      if (n.link) {
                        setLocation(n.link);
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors hover:bg-muted/50 ${
                      isRead ? "opacity-60" : "bg-primary/5"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">{n.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.description}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                    </div>
                    {!isRead && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
