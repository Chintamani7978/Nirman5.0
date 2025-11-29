import { motion, AnimatePresence } from "motion/react";
import { Plus, User, Mail, Phone, Zap, Copy, Trash2, Clock } from "lucide-react";
import { Button } from "./Button";
import { NebulaBackground } from "./NebulaBackground";
import { GlassCard } from "./GlassCard";
import { StatusBadge } from "./StatusBadge";
import { Toast } from "./Toast";
import { useState } from "react";

// Mock data for email aliases
const mockEmailAliases = [
  {
    id: "1",
    email: "mask_qtb1@maskme.io",
    status: "active" as const,
    timeRemaining: "22h 39m",
    logsCount: 0,
  },
  {
    id: "2",
    email: "mask_kv7m@maskme.io",
    status: "active" as const,
    timeRemaining: "22h 53m",
    logsCount: 0,
  },
];

// Mock data for phone aliases
const mockPhoneAliases = [
  {
    id: "1",
    phone: "+1-513-36-8",
    status: "active" as const,
    timeRemaining: "22h 32m",
    logsCount: 1,
  },
  {
    id: "2",
    phone: "+1-311-98-6",
    status: "active" as const,
    timeRemaining: "22h 31m",
    logsCount: 0,
  },
];

// Mock data for incoming messages
const mockMessages = [
  {
    id: "1",
    type: "otp" as const,
    from: "service@example.com",
    content: "Your verification code is: 123456",
    time: "2m ago",
    alias: "mask_qtb1@maskme.io",
  },
  {
    id: "2",
    type: "message" as const,
    from: "notifications@app.io",
    content: "Welcome to our service!",
    time: "15m ago",
    alias: "mask_kv7m@maskme.io",
  },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [emailAliases, setEmailAliases] = useState(mockEmailAliases);
  const [phoneAliases, setPhoneAliases] = useState(mockPhoneAliases);
  const [messages] = useState(mockMessages);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [expiryTime, setExpiryTime] = useState("24 hours");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const handleCreateEmailAlias = () => {
    const newAlias = {
      id: Date.now().toString(),
      email: `mask_${Math.random().toString(36).substr(2, 4)}@maskme.io`,
      status: "active" as const,
      timeRemaining: "24h",
      logsCount: 0,
    };
    
    setEmailAliases([newAlias, ...emailAliases]);
    setToastMessage("Email alias created successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleCreatePhoneAlias = () => {
    const newAlias = {
      id: Date.now().toString(),
      phone: `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1 + Math.random() * 9)}`,
      status: "active" as const,
      timeRemaining: "24h",
      logsCount: 0,
    };
    
    setPhoneAliases([newAlias, ...phoneAliases]);
    setToastMessage("Phone alias created successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setToastMessage("Copied to clipboard!");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setCopiedId(null);
    }, 2500);
  };

  const handleDelete = (id: string, type: "email" | "phone") => {
    setDeletedId(id);
    setTimeout(() => {
      if (type === "email") {
        setEmailAliases(emailAliases.filter(a => a.id !== id));
      } else {
        setPhoneAliases(phoneAliases.filter(a => a.id !== id));
      }
      setToastMessage("Alias deleted");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setDeletedId(null);
    }, 300);
  };

  const activeEmailCount = emailAliases.filter(a => a.status === "active").length;
  const activePhoneCount = phoneAliases.filter(a => a.status === "active").length;

  return (
    <div className="w-[900px] h-[700px] relative overflow-hidden bg-[#0D0D0D] flex">
      {/* Nebula Background */}
      <NebulaBackground />

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-hidden flex">
        {/* Left Section - Alias Management */}
        <div className="flex-1 overflow-auto">
          <motion.div
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 0.78, 0.43, 1] }}
          >
            {/* Header */}
            <div className="mb-6">
              <div>
                <h1 className="text-gradient mb-1">MaskMe</h1>
                <p className="text-xs text-[#9CA3AF]">Hide Your Presence</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-sm text-[#9CA3AF]">
                {activeTab === "email" ? (
                  <>
                    <span className="text-[#5CE1E6]">{activeEmailCount} active</span> {activeTab}s
                  </>
                ) : (
                  <>
                    <span className="text-[#5CE1E6]">{activePhoneCount} active</span> {activeTab}s
                  </>
                )}
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-lg">
              <motion.button
                onClick={() => setActiveTab("email")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === "email"
                    ? "bg-gradient-to-r from-[#6C63FF]/30 to-[#5CE1E6]/30 text-white"
                    : "text-[#9CA3AF]"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("phone")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === "phone"
                    ? "bg-gradient-to-r from-[#6C63FF]/30 to-[#5CE1E6]/30 text-white"
                    : "text-[#9CA3AF]"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">Phone</span>
              </motion.button>
            </div>

            {/* Expiry Selector */}
            <div className="mb-4">
              <label className="text-xs text-[#9CA3AF] mb-2 block">Expires In</label>
              <select
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-lg text-[#EDEDED] text-sm focus:outline-none focus:border-[#6C63FF]/50 transition-colors"
              >
                <option value="24 hours">24 hours</option>
                <option value="12 hours">12 hours</option>
                <option value="6 hours">6 hours</option>
                <option value="1 hour">1 hour</option>
              </select>
            </div>

            {/* Create Button */}
            <motion.button
              onClick={activeTab === "email" ? handleCreateEmailAlias : handleCreatePhoneAlias}
              className="w-full py-4 mb-6 bg-gradient-to-r from-[#6C63FF] to-[#5CE1E6] rounded-lg font-medium flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(108, 99, 255, 0.4)",
                  "0 0 30px rgba(92, 225, 230, 0.6)",
                  "0 0 20px rgba(108, 99, 255, 0.4)",
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity },
              }}
            >
              <Zap className="w-5 h-5" />
              {activeTab === "email" ? "Create New Alias" : "Create Phone Alias"}
            </motion.button>

            {/* Recent Aliases */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-[#EDEDED]">
                  {activeTab === "email" ? "Recent Email Aliases" : "Recent Phone Aliases"}
                </h3>
                <button
                  onClick={() => {
                    const value = activeTab === "email" ? emailAliases[0]?.email : phoneAliases[0]?.phone;
                    const id = activeTab === "email" ? emailAliases[0]?.id : phoneAliases[0]?.id;
                    if (value && id) handleCopy(value, id);
                  }}
                  className="text-xs text-[#5CE1E6] hover:text-[#4AC5CA] transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  Simulate Incoming OTP
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "email" ? (
                  <motion.div
                    key="email-list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {emailAliases.map((alias, index) => (
                      <motion.div
                        key={alias.id}
                        className="glass-card p-4 flex items-center justify-between group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07 }}
                        whileHover={{ scale: 1.01, boxShadow: "0 8px 24px rgba(108, 99, 255, 0.2)" }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5CE1E6] flex items-center justify-center">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-[#EDEDED] mb-1 font-mono">{alias.email}</p>
                            <p className="text-xs text-[#9CA3AF]">email alias</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <StatusBadge status={alias.status} />
                          
                          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                            <Clock className="w-3 h-3" />
                            {alias.timeRemaining}
                          </div>

                          <div className="text-xs text-[#9CA3AF]">
                            <User className="w-3 h-3 inline mr-1" />
                            {alias.logsCount} logs
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              onClick={() => handleCopy(alias.email, alias.id)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.div
                                animate={copiedId === alias.id ? {
                                  scale: [1, 1.3, 1],
                                  rotate: [0, 15, -15, 0],
                                } : {}}
                                transition={{ duration: 0.4 }}
                              >
                                <Copy className="w-4 h-4 text-[#5CE1E6]" />
                              </motion.div>
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(alias.id, "email")}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.div
                                animate={deletedId === alias.id ? {
                                  scale: [1, 1.3, 0],
                                  rotate: [0, 0, 180],
                                  opacity: [1, 1, 0],
                                } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                <Trash2 className="w-4 h-4 text-[#EF4444]" />
                              </motion.div>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone-list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {phoneAliases.map((alias, index) => (
                      <motion.div
                        key={alias.id}
                        className="glass-card p-4 flex items-center justify-between group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07 }}
                        whileHover={{ scale: 1.01, boxShadow: "0 8px 24px rgba(108, 99, 255, 0.2)" }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5CE1E6] flex items-center justify-center">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-[#EDEDED] mb-1 font-mono">{alias.phone}</p>
                            <p className="text-xs text-[#9CA3AF]">phone alias</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <StatusBadge status={alias.status} />
                          
                          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                            <Clock className="w-3 h-3" />
                            {alias.timeRemaining}
                          </div>

                          <div className="text-xs text-[#9CA3AF]">
                            <User className="w-3 h-3 inline mr-1" />
                            {alias.logsCount} logs
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              onClick={() => handleCopy(alias.phone, alias.id)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.div
                                animate={copiedId === alias.id ? {
                                  scale: [1, 1.3, 1],
                                  rotate: [0, 15, -15, 0],
                                } : {}}
                                transition={{ duration: 0.4 }}
                              >
                                <Copy className="w-4 h-4 text-[#5CE1E6]" />
                              </motion.div>
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(alias.id, "phone")}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.div
                                animate={deletedId === alias.id ? {
                                  scale: [1, 1.3, 0],
                                  rotate: [0, 0, 180],
                                  opacity: [1, 1, 0],
                                } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                <Trash2 className="w-4 h-4 text-[#EF4444]" />
                              </motion.div>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right Section - Messages/OTPs */}
        <motion.div
          className="w-72 border-l border-white/10 overflow-auto"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 0.78, 0.43, 1] }}
        >
          <div className="p-6">
            {/* Messages Header */}
            <div className="mb-6">
              <h3 className="text-sm mb-1">Incoming Messages</h3>
              <p className="text-xs text-[#9CA3AF]">{messages.length} new</p>
            </div>

            {/* Messages List */}
            <div className="space-y-3">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className="glass-card p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(92, 225, 230, 0.2)" }}
                >
                  {/* Message Type Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      message.type === "otp" 
                        ? "bg-[#6C63FF]/20 text-[#6C63FF]" 
                        : "bg-[#5CE1E6]/20 text-[#5CE1E6]"
                    }`}>
                      {message.type === "otp" ? "OTP" : "Message"}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">{message.time}</span>
                  </div>

                  {/* From */}
                  <p className="text-xs text-[#9CA3AF] mb-2">From: {message.from}</p>

                  {/* Content */}
                  <p className="text-sm text-[#EDEDED] mb-2 break-words">{message.content}</p>

                  {/* Target Alias */}
                  <p className="text-xs text-[#5CE1E6] font-mono truncate">
                    → {message.alias}
                  </p>

                  {/* Copy Button */}
                  {message.type === "otp" && (
                    <motion.button
                      onClick={() => {
                        const otpMatch = message.content.match(/\d{6}/);
                        if (otpMatch) handleCopy(otpMatch[0], message.id);
                      }}
                      className="w-full mt-3 px-3 py-2 bg-[#6C63FF]/20 hover:bg-[#6C63FF]/30 rounded-lg text-xs text-[#6C63FF] transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        animate={copiedId === message.id ? {
                          scale: [1, 1.3, 1],
                          rotate: [0, 15, -15, 0],
                        } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <Copy className="w-3 h-3" />
                      </motion.div>
                      Copy OTP
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4 opacity-50" />
                <p className="text-sm text-[#9CA3AF]">No messages yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Toast */}
      <Toast isVisible={showToast} message={toastMessage} type="success" />
    </div>
  );
}
