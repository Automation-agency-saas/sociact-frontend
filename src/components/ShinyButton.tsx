import { ShimmerButton } from "@/components/magicui/shimmer-button";
interface ButtonProps {
    text : string
}
export function ShimmerButtonDemo({text}:ButtonProps) {
  return (
    <ShimmerButton className="shadow-2xl">
      <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
        {text}
      </span>
    </ShimmerButton>
  );
}
