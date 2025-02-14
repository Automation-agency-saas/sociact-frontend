import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Facebook,
  Instagram,
  Linkedin,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "../ui/button";

export const EvervaultCard = ({
  className,
  icon,
  app,
}: {
  className?: string;
  icon: any;
  app: string;
}) => {
  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    const str = generateRandomString(1500);
    setRandomString(str);
  }, []);

  const Icon = icon;

  const renderAppIcon = (app: string) => {
    switch (app) {
      case "youtube":
        return <Youtube className="w-6 h-6 text-red-500" />;
      case "instagram":
        return <Instagram className="w-6 h-6 text-pink-500" />;
      case "facebook":
        return <Facebook className="w-6 h-6 text-blue-500" />;
      case "twitter":
        return <Twitter className="w-6 h-6 text-blue-700" />;
      case "linkedin":
        return <Linkedin className="w-6 h-6 text-blue-700" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "bg-transparent flex items-center justify-center w-full h-full relative",
        className
      )}
    >
      <div className="rounded-3xl w-full relative overflow-hidden bg-black/80 flex items-center justify-center h-full border border-purple-500">
        <CardPattern randomString={randomString} />
        <Button className="absolute top-2 left-2 p-2 bg-gray-200">
          {renderAppIcon(app)}
        </Button>
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-32 w-32 rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-primary/30 blur-lg rounded-full" />
            <Icon className="z-20 w-16 h-16 text-purple-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ randomString }: { randomString: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        }}
        className="absolute inset-0 text-xs break-words whitespace-pre-wrap text-gray-700/80 font-mono"
      >
        {randomString.repeat(2)}
      </motion.div>
    </div>
  );
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
