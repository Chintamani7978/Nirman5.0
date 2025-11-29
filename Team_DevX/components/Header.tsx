import React from "react";
import { MapPin, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";

interface HeaderProps {
  right?: React.ReactNode;
  subtitle?: string;
  nav?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ right, subtitle, nav }) => {
  const navigate = useNavigate();

  const goBack = () => {
    try {
      navigate(-1);
    } catch (e) {
      // fallback to history
      window.history.back();
    }
  };
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
        role="banner"
      >
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:py-4">
          {/* Back button + Logo / Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              aria-label="Go back"
              title="Go back"
              className="p-2 rounded hover:bg-muted/50 text-muted-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  VoiceUp
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground leading-tight">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Optional Navigation */}
          {nav && (
            <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              {nav}
            </nav>
          )}

          {/* Right Actions (buttons, avatar, etc.) */}
          <div className="flex items-center gap-3">
            {right}
            <MobileNav nav={nav} />
          </div>
        </div>
      </header>

      {/* Spacer to prevent content overlap */}
      <div className="h-[64px] sm:h-[72px]" aria-hidden />
    </>
  );
};

export default Header;
