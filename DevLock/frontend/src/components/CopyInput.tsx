import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CopyInputProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyInput({ value, label, className = "" }: CopyInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm text-[#9CA3AF]">{label}</label>}
      <div className="relative">
        <input
          type="text"
          value={value}
          readOnly
          className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-[#EDEDED] focus:outline-none focus:border-[#6C63FF]/50 transition-colors duration-220"
        />
        <motion.button
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-220"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Check className="w-4 h-4 text-[#5CE1E6]" />
            </motion.div>
          ) : (
            <Copy className="w-4 h-4 text-[#9CA3AF]" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
