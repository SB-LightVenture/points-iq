
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";

interface VideoModalProps {
  trigger: React.ReactNode;
}

export const VideoModal = ({ trigger }: VideoModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleModalClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 bg-black">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full"
            poster="/videos/demo-poster.jpg"
            onEnded={handleVideoEnd}
            onClick={togglePlay}
          >
            <source src="/videos/pointsiq-demo.mp4" type="video/mp4" />
            <source src="/videos/pointsiq-demo.webm" type="video/webm" />
            <track
              kind="subtitles"
              src="/videos/pointsiq-demo-subtitles.vtt"
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center group">
            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 text-white w-16 h-16 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>
            </div>
            
            {/* Bottom Controls */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
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
