
import { useState } from "react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, CheckCircle, LayoutGrid, LayoutList } from "lucide-react";
import TaskItem from "./TaskItem";
import TaskGroupedByDate from "./TaskGroupedByDate";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

type SortOption = "dueDate" | "priority" | "createdAt";
type ViewMode = "list" | "grouped";

const TaskList = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Filter tasks based on search term and completion status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesSearch && (showCompleted || !task.completed);
  });

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      // Sort by due date (tasks with no due date come last)
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "priority") {
      // Sort by priority (high -> medium -> low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else {
      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Count incomplete tasks
  const incompleteTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(showFilters && "bg-secondary")}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 py-2 animate-fade-in">
          <div className="space-y-1 flex-1">
            <Label htmlFor="sort-by">Sort by</Label>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger id="sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant={showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {showCompleted ? "Hide Completed" : "Show Completed"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        {incompleteTasks > 0 && (
          <div className="text-sm text-muted-foreground">
            {incompleteTasks} {incompleteTasks === 1 ? 'task' : 'tasks'} remaining
          </div>
        )}
        
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="ml-auto">
          <TabsList className="h-8">
            <TabsTrigger value="list" className="h-7">
              <LayoutList className="h-4 w-4 mr-1" /> List
            </TabsTrigger>
            <TabsTrigger value="grouped" className="h-7">
              <LayoutGrid className="h-4 w-4 mr-1" /> By Date
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-1">
        {sortedTasks.length > 0 ? (
          viewMode === "list" ? (
            sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TaskGroupedByDate
              tasks={sortedTasks}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks found</p>
            {searchTerm && (
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
