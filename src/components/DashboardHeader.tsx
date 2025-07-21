
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface DashboardHeaderProps {
  userEmail: string;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userEmail, onSignOut }) => {
  return (
    <header className="border-b border-border bg-card backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">
            <span className="text-foreground">Points</span>
            <span className="text-[hsl(var(--orange-brand))]">IQ</span>
          </h1>
          <span className="text-muted-foreground">Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-foreground">
            <User className="w-4 h-4" />
            <span className="text-sm">{userEmail}</span>
          </div>
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
