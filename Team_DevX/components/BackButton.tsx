import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(-1)}
      className={`fixed top-4 left-4 z-50 ${className ?? ""}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
};

export default BackButton;
