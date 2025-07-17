import React from 'react';
import { toast } from '@/hooks/use-toast';
import { UserFriendlyError } from '@/utils/errorUtils';
import { RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedToastProps extends UserFriendlyError {
  onRetry?: () => void;
}

export const showEnhancedToast = (error: UserFriendlyError, onRetry?: () => void) => {
  const getIcon = () => {
    switch (error.type) {
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getVariant = () => {
    switch (error.type) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      case 'info':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  toast({
    title: error.title,
    description: (
      <div className="space-y-3">
        <p className="text-sm">{error.message}</p>
        
        {error.actions && error.actions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium opacity-80">What you can try:</p>
            <ul className="text-xs space-y-1 opacity-80">
              {error.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {error.retry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-full mt-3"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    ),
    variant: getVariant(),
  });
};

export const showSuccessToast = (title: string, message: string) => {
  toast({
    title: title,
    description: message,
  });
};