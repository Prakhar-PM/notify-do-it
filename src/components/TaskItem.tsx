
import { useState } from "react";
import { format } from "date-fns";
import { Task, Priority } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Clock, Edit, Trash2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityClasses: Record<Priority, string> = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

const priorityColors: Record<Priority, string> = {
  high: "bg-todo-priority-high text-white",
  medium: "bg-todo-priority-medium text-white",
  low: "bg-todo-priority-low text-white",
};

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) => {
  const { toast } = useToast();
  const [isCompleting, setIsCompleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleToggleComplete = () => {
    setIsCompleting(true);
    onToggleComplete(task.id, !task.completed);
    
    toast({
      title: task.completed ? "Task marked as incomplete" : "Task completed",
      description: task.title,
      duration: 2000,
    });
    
    setTimeout(() => setIsCompleting(false), 300);
  };

  const handleDelete = () => {
    onDelete(task.id);
    setDeleteDialogOpen(false);
    toast({
      title: "Task deleted",
      description: task.title,
      variant: "destructive",
      duration: 2000,
    });
  };

  return (
    <Card 
      className={cn(
        "p-4 mb-3 transition-all duration-200 hover:shadow-md animate-fade-in",
        priorityClasses[task.priority],
        task.completed ? "bg-secondary/50" : ""
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={() => handleToggleComplete()}
          className={cn(
            "mt-1 h-5 w-5 rounded-full transition-all",
            isCompleting && "scale-110"
          )}
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={cn(
              "text-lg font-medium transition-opacity",
              task.completed && "task-completed"
            )}>
              {task.title}
            </h3>
            
            <div className="flex space-x-1">
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-sm text-muted-foreground mt-1",
              task.completed && "task-completed"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3 items-center">
            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock size={14} className="mr-1" />
                {format(new Date(task.dueDate), "MMM d, yyyy h:mm a")}
              </div>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center text-xs">
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onEdit(task)}
            className="h-8 w-8"
          >
            <Edit size={16} />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setDeleteDialogOpen(true)}
            className="h-8 w-8 text-destructive hover:text-destructive/90"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{task.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TaskItem;
