import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { containerVariants, itemVariants } from "../../lib/animations";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

type HistorySectionProps<T> = {
  title: string;
  items: T[];
  onDelete: (id: string) => void;
  renderPreview: (item: T) => React.ReactNode;
  emptyMessage?: string;
};

export function HistorySection<T extends { id: string; timestamp: Date }>({
  title,
  items,
  onDelete,
  renderPreview,
  emptyMessage = "No history items yet"
}: HistorySectionProps<T>) {
  return (
    <Card className="p-6 bg-background/60 backdrop-blur-lg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        
        <ScrollArea className="h-[400px] pr-4">
          {items.length === 0 ? (
            <motion.p
              variants={itemVariants}
              className="text-muted-foreground text-center py-8"
            >
              {emptyMessage}
            </motion.p>
          ) : (
            <motion.div
              variants={containerVariants}
              className="space-y-4"
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  className="relative"
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </div>
                        {renderPreview(item)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </ScrollArea>
      </motion.div>
    </Card>
  );
} 