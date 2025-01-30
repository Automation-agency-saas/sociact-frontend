import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [isLight, setIsLight] = useState(theme === "light")

  useEffect(() => {
    setIsLight(theme === "light")
  }, [theme])

  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light")
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="relative w-10 h-10 overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isLight ? "sun" : "moon"}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 16,
            duration: 0.2,
          }}
        >
          {isLight ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

