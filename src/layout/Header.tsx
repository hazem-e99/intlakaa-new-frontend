import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "لوحة التحكم" }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg sm:text-2xl font-semibold tracking-tight truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
