import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  HeartPulse,
  IdCard,
  Stethoscope,
  Calculator,
  CalendarDays,
  FileText,
  Building2,
  Bot,
  Pill,
  AlertTriangle,
  Settings,
  Command,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "My Health", path: "/my-health", icon: HeartPulse },
  { label: "Medical ID", path: "/medical-id", icon: IdCard },
  { label: "Symptom Checker", path: "/symptom-checker", icon: Stethoscope },
  { label: "Health Tools", path: "/health-tools", icon: Calculator },
  { label: "Appointments", path: "/appointments", icon: CalendarDays },
  { label: "Prescriptions", path: "/prescriptions", icon: FileText },
  { label: "Hospitals", path: "/hospitals", icon: Building2 },
  { label: "MedAssist AI", path: "/medassist", icon: Bot },
  { label: "Drug Checker", path: "/drug-checker", icon: Pill },
  { label: "Emergency Alerts", path: "/alerts", icon: AlertTriangle },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function CommandPalette() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback(
    (path: string) => {
      setLocation(path);
      handleClose();
    },
    [setLocation, handleClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleOpen, handleClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "ArrowDown" && filtered.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp" && filtered.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].path);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted rounded border border-border">
                ESC
              </kbd>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              ) : (
                filtered.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        index === selectedIndex
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted rounded border border-border text-[10px]">↑</kbd>
                  <kbd className="px-1 py-0.5 bg-muted rounded border border-border text-[10px]">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted rounded border border-border text-[10px]">↵</kbd>
                  select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Command className="h-3 w-3" />K to toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}