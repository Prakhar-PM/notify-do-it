
import { useState, useEffect } from "react";
import { Task, TaskFormData } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { Plus, LogOut } from "lucide-react";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import {
  fetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  toggleTaskCompletion,
  deleteTask as apiDeleteTask
} from "@/services/api";

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  const { toast: uiToast } = useToast();
  const { user, logout } = useAuth();

  // Fetch tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        uiToast({
          title: "Error fetching tasks",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      const newTask = await apiCreateTask({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        tags: formData.tags
      });

      setTasks(prev => [newTask, ...prev]);
      setIsFormOpen(false);
      
      // Show modern toast notification for task creation
      toast.success(`Task Created: ${formData.title}`, {
        description: "Your task has been created successfully",
        duration: 4000,
        icon: "✅",
      });
      
    } catch (error) {
      uiToast({
        title: "Error creating task",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (formData: TaskFormData) => {
    if (!editingTask) return;

    try {
      const updatedTask = await apiUpdateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        tags: formData.tags
      });

      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(undefined);
      setIsFormOpen(false);
      
      // Show modern toast notification for task update
      toast.success(`Task Updated: ${formData.title}`, {
        description: "Your task has been updated successfully",
        duration: 4000,
      });
      
    } catch (error) {
      uiToast({
        title: "Error updating task",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await toggleTaskCompletion(id, completed);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      uiToast({
        title: "Error updating task",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await apiDeleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      uiToast({
        title: "Error deleting task",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleOpenForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(false);
  };

  const handleFormSubmit = (formData: TaskFormData) => {
    if (editingTask) {
      handleUpdateTask(formData);
    } else {
      handleCreateTask(formData);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-3xl mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-todo-primary to-todo-secondary bg-clip-text text-transparent">
            NotifyDo
          </h1>
          <p className="text-muted-foreground">
            Organize your tasks, set reminders, stay productive.
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleOpenForm} 
            className="bg-todo-primary hover:bg-todo-secondary transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
          
          <Button 
            variant="outline"
            onClick={logout}
            className="flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      {user && (
        <div className="mb-6 text-sm">
          <span className="text-muted-foreground">Logged in as: </span>
          <span className="font-medium">{user.name}</span>
        </div>
      )}

      <main>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-todo-primary border-t-transparent rounded-full"></div>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState onCreateTask={handleOpenForm} />
        ) : (
          <TaskList 
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        )}
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={editingTask}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoApp;
