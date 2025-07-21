
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DemoVideoContent } from "@/components/DemoVideoContent";
import { useState } from "react";

interface VideoModalProps {
  trigger: React.ReactNode;
}

export const VideoModal = ({ trigger }: VideoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <DemoVideoContent />
        </div>
        
        {/* Video Title and Description */}
        <div className="p-6 bg-background">
          <h3 className="text-2xl font-bold mb-2 text-foreground">
            See PointsIQ in Action
          </h3>
          <p className="text-muted-foreground">
            Discover how PointsIQ helps travelers maximize their frequent flyer points 
            and save thousands on premium flights.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
