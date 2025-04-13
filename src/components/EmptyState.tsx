
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";

interface EmptyStateProps {
  onCreateTask: () => void;
}

const EmptyState = ({ onCreateTask }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-todo-light p-4 mb-4">
        <ListTodo size={32} className="text-todo-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No tasks yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start by creating your first task. Add due dates, priorities, and tags to keep everything organized.
      </p>
      <Button onClick={onCreateTask} className="animate-pulse">
        Create your first task
      </Button>
    </div>
  );
};

export default EmptyState;
