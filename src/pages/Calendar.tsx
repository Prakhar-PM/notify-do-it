
import { useState } from "react";
import { Task } from "@/types/task";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isValid } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";
import { CalendarClock, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { toast } = useToast();
  
  // Fetch tasks using React Query
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });
  
  // Group tasks by date
  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (task.dueDate && isValid(parseISO(task.dueDate.toString()))) {
      const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
    }
    return acc;
  }, {});
  
  // Get tasks for selected date
  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const tasksForSelectedDate = selectedDateKey ? tasksByDate[selectedDateKey] || [] : [];
  
  // Calendar day render function to show task indicators
  const renderCalendarCell = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTasks = tasksByDate[dateKey] || [];
    
    if (dayTasks.length > 0) {
      // Calculate priority colors
      const hasHighPriority = dayTasks.some(task => task.priority === 'high');
      const hasMediumPriority = dayTasks.some(task => task.priority === 'medium');
      
      let priorityClass = "bg-todo-priority-low";
      if (hasHighPriority) {
        priorityClass = "bg-todo-priority-high";
      } else if (hasMediumPriority) {
        priorityClass = "bg-todo-priority-medium";
      }
      
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {day.getDate()}
          <span className={`absolute bottom-1 w-5 h-1 rounded-full ${priorityClass}`}></span>
        </div>
      );
    }
    
    return <div>{day.getDate()}</div>;
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  const handleNewTask = () => {
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
  
  const handleFormSubmit = () => {
    // Form submission is handled by TaskForm component
    setIsFormOpen(false);
    toast({
      title: "Task created",
      description: "Your task has been created successfully",
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-todo-primary to-todo-secondary bg-clip-text text-transparent">
            Task Calendar
          </h1>
        </div>
        <p className="text-muted-foreground">
          Plan and visualize your tasks by date
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardContent className="p-4">
              <Calendar 
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="p-0"
                components={{
                  Day: ({ day, ...props }) => (
                    <Button 
                      variant={props.selected ? "default" : "ghost"}
                      className="h-9 w-9 p-0 font-normal"
                      {...props}
                    >
                      {renderCalendarCell(day)}
                    </Button>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center">
              <CalendarClock className="mr-2 h-5 w-5 text-todo-primary" />
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h2>
            <Button onClick={handleNewTask} className="bg-todo-primary hover:bg-todo-secondary">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-todo-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-destructive">
              Error loading tasks. Please try again.
            </div>
          ) : tasksForSelectedDate.length > 0 ? (
            <div className="space-y-2">
              {tasksForSelectedDate.map(task => (
                <Card key={task.id} className={`p-3 border-l-4 border-todo-priority-${task.priority}`}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'line-through opacity-70' : ''}`}>{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                    </div>
                    <Badge className={`bg-todo-priority-${task.priority} text-white`}>{task.priority}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {selectedDate ? 'No tasks scheduled for this day' : 'Select a date to view tasks'}
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            initialDueDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
