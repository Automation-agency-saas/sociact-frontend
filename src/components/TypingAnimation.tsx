import { TypingAnimation } from "@/components/magicui/typing-animation";
interface TypingAnimationProps {
  text: string;
}
export function TypingAnimationDemo({ text }: TypingAnimationProps) {
  return <TypingAnimation className="text-2xl md:text-8xl">{text}</TypingAnimation>;
}
