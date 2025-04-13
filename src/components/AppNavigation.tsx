
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutGrid, CalendarDays, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const AppNavigation = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex items-center gap-2">
      <Link to="/">
        <Button 
          variant={isActive('/') ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex items-center gap-1",
            isActive('/') && "bg-todo-primary hover:bg-todo-secondary"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline">Tasks</span>
        </Button>
      </Link>
      
      <Link to="/calendar">
        <Button
          variant={isActive('/calendar') ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex items-center gap-1",
            isActive('/calendar') && "bg-todo-primary hover:bg-todo-secondary"
          )}
        >
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">Calendar</span>
        </Button>
      </Link>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={logout}
        className="flex items-center gap-1 ml-2"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
};

export default AppNavigation;
