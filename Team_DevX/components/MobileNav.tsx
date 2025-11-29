import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface MobileNavProps {
  nav?: React.ReactNode;
}

const MobileNav: React.FC<MobileNavProps> = ({ nav }) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-2">
            <img src="/voice.svg" alt="VoiceUp Logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold">VoiceUp</h1>
          </div>
          <nav className="flex flex-col gap-4 text-lg">{nav}</nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
