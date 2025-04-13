
import { useState, useEffect } from "react";
import { Task, TaskFormData } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import EmptyState from "@/components/EmptyState";
import { v4 as uuidv4 } from "uuid";

// Mock data - to be replaced with API calls
const mockTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Complete project proposal",
    description: "Prepare the project proposal document for the client meeting",
    completed: false,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    priority: "high",
    tags: ["work", "urgent"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Buy groceries",
    description: "Milk, eggs, bread, and vegetables",
    completed: false,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    priority: "medium",
    tags: ["personal", "shopping"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: "Schedule dentist appointment",
    completed: true,
    priority: "low",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date()
  }
];

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  const { toast } = useToast();

  // Simulate API fetch
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/tasks');
        // const data = await response.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setTasks(mockTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error fetching tasks",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = (formData: TaskFormData) => {
    const newTask: Task = {
      id: uuidv4(),
      title: formData.title,
      description: formData.description,
      completed: false,
      dueDate: formData.dueDate,
      priority: formData.priority,
      tags: formData.tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real app, this would be an API call
    // await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(newTask) })

    setTasks(prev => [newTask, ...prev]);
    setIsFormOpen(false);
    toast({
      title: "Task created",
      description: "Your task has been created successfully",
      duration: 3000,
    });
  };

  const handleUpdateTask = (formData: TaskFormData) => {
    if (!editingTask) return;

    const updatedTask: Task = {
      ...editingTask,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      tags: formData.tags,
      updatedAt: new Date()
    };

    // In a real app, this would be an API call
    // await fetch(`/api/tasks/${editingTask.id}`, { method: 'PUT', body: JSON.stringify(updatedTask) })

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id ? updatedTask : task
    ));
    setEditingTask(undefined);
    setIsFormOpen(false);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully",
      duration: 3000,
    });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    // In a real app, this would be an API call
    // await fetch(`/api/tasks/${id}/complete`, { method: 'PATCH', body: JSON.stringify({ completed }) })

    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed, updatedAt: new Date() } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    // In a real app, this would be an API call
    // await fetch(`/api/tasks/${id}`, { method: 'DELETE' })

    setTasks(prev => prev.filter(task => task.id !== id));
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

        <Button 
          onClick={handleOpenForm} 
          className="bg-todo-primary hover:bg-todo-secondary transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </header>

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
