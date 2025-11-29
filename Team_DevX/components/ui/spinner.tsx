import { Loader2 } from "lucide-react";

export function Spinner({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8",
    large: "h-16 w-16",
  };

  return (
    <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
  );
}
