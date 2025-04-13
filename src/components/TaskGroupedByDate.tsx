
import { useState } from "react";
import { Task } from "@/types/task";
import { format, isToday, isTomorrow, isThisWeek, isPast, parseISO } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TaskItem from "./TaskItem";
import { Calendar, CalendarDays, CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskGroupedByDateProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskGroupedByDate = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskGroupedByDateProps) => {
  const [openGroups, setOpenGroups] = useState<string[]>(["today", "tomorrow"]);

  const groupTasks = () => {
    const overdue: Task[] = [];
    const today: Task[] = [];
    const tomorrow: Task[] = [];
    const thisWeek: Task[] = [];
    const later: Task[] = [];
    const noDate: Task[] = [];

    tasks.forEach(task => {
      if (!task.dueDate) {
        noDate.push(task);
        return;
      }

      const dueDate = parseISO(task.dueDate.toString());
      
      if (isPast(dueDate) && !isToday(dueDate)) {
        overdue.push(task);
      } else if (isToday(dueDate)) {
        today.push(task);
      } else if (isTomorrow(dueDate)) {
        tomorrow.push(task);
      } else if (isThisWeek(dueDate)) {
        thisWeek.push(task);
      } else {
        later.push(task);
      }
    });

    return { overdue, today, tomorrow, thisWeek, later, noDate };
  };

  const { overdue, today, tomorrow, thisWeek, later, noDate } = groupTasks();
  
  // Track which accordion items are open
  const handleToggle = (value: string) => {
    setOpenGroups(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  // Create a reusable component for the group header
  const GroupHeader = ({ label, count, icon: Icon, variant = "default" }: { 
    label: string; 
    count: number; 
    icon?: React.ComponentType<{ className?: string }>;
    variant?: "default" | "destructive" | "outline";
  }) => (
    <div className="flex items-center">
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{label}</span>
      <Badge variant={variant} className="ml-2">{count}</Badge>
    </div>
  );

  return (
    <Accordion
      type="multiple"
      value={openGroups}
      className="w-full space-y-2"
    >
      {overdue.length > 0 && (
        <AccordionItem value="overdue" className="border rounded-md overflow-hidden">
          <AccordionTrigger 
            className="px-4 py-2 hover:bg-secondary/50" 
            onClick={() => handleToggle("overdue")}
          >
            <GroupHeader 
              label="Overdue" 
              count={overdue.length} 
              icon={CalendarX} 
              variant="destructive"
            />
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="space-y-1">
              {overdue.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {today.length > 0 && (
        <AccordionItem value="today" className="border rounded-md overflow-hidden">
          <AccordionTrigger 
            className="px-4 py-2 hover:bg-secondary/50" 
            onClick={() => handleToggle("today")}
          >
            <GroupHeader 
              label="Today" 
              count={today.length} 
              icon={Calendar}
            />
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="space-y-1">
              {today.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {tomorrow.length > 0 && (
        <AccordionItem value="tomorrow" className="border rounded-md overflow-hidden">
          <AccordionTrigger 
            className="px-4 py-2 hover:bg-secondary/50" 
            onClick={() => handleToggle("tomorrow")}
          >
            <GroupHeader 
              label="Tomorrow" 
              count={tomorrow.length} 
              icon={Calendar}
            />
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="space-y-1">
              {tomorrow.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {thisWeek.length > 0 && (
        <AccordionItem value="thisWeek" className="border rounded-md overflow-hidden">
          <AccordionTrigger 
            className="px-4 py-2 hover:bg-secondary/50" 
            onClick={() => handleToggle("thisWeek")}
          >
            <GroupHeader 
              label="This Week" 
              count={thisWeek.length} 
              icon={CalendarDays}
            />
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="space-y-1">
              {thisWeek.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {later.length > 0 && (
        <AccordionItem value="later" className="border rounded-md overflow-hidden">
          <AccordionTrigger 
            className="px-4 py-2 hover:bg-secondary/50" 
            onClick={() => handleToggle("later")}
          >
            <GroupHeader 
              label="Later" 
              count={later.length} 
              icon={CalendarDays}
            />
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="space-y-1">
              {later.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {noDate.length > 0 && (
        <AccordionItem value="noDate" className="border rounded-md overflow-hidden">
          <AccordionTrigger 
            className="px-4 py-2 hover:bg-secondary/50" 
            onClick={() => handleToggle("noDate")}
          >
            <GroupHeader 
              label="No Due Date" 
              count={noDate.length}
            />
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="space-y-1">
              {noDate.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default TaskGroupedByDate;
