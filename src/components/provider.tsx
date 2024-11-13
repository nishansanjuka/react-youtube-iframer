"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { cn } from "../utils";

// Types for YouTube Player API
interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  stopVideo(): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
}

interface YouTubeEvent {
  target: YouTubePlayer;
  data?: number;
}

// Context types
interface YoutubePlayerContextType {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  isAPIReady: boolean;
  registerPlayer: (player: YouTubePlayer) => void;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void; // Added reset to context type
  setIsPlaying: (playing: boolean) => void;
}

// Props types
interface YoutubePlayerProviderProps {
  children: React.ReactNode;
}

interface YoutubePlayerWithSeekbarProps {
  videoId: string;
  className?: string;
}

// Create context with null check
const YoutubePlayerContext = createContext<YoutubePlayerContextType | null>(
  null
);

// Provider component
export const YoutubePlayerProvider: React.FC<YoutubePlayerProviderProps> = ({
  children,
}) => {
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isAPIReady, setIsAPIReady] = useState<boolean>(false);

  // Initialize YouTube API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsAPIReady(true);
      };
    }
  }, []);

  // Update current time periodically when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player]);

  const registerPlayer = useCallback((youtubePlayer: YouTubePlayer) => {
    setPlayer(youtubePlayer);
    setDuration(youtubePlayer.getDuration());
  }, []);

  const seek = useCallback(
    (time: number) => {
      if (player && time >= 0 && time <= duration) {
        player.seekTo(time, true);
        setCurrentTime(time);
      }
    },
    [player, duration]
  );

  const play = useCallback(() => {
    if (player) {
      player.playVideo();
      setIsPlaying(true);
    }
  }, [player]);

  const pause = useCallback(() => {
    if (player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  }, [player]);

  // Reset function
  const reset = useCallback(() => {
    if (player) {
      player.stopVideo();
      player.seekTo(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [player]);

  const contextValue: YoutubePlayerContextType = {
    duration,
    currentTime,
    isPlaying,
    isAPIReady,
    registerPlayer,
    seek,
    play,
    pause,
    reset, // Added to context value
    setIsPlaying,
  };

  return (
    <YoutubePlayerContext.Provider value={contextValue}>
      {children}
    </YoutubePlayerContext.Provider>
  );
};

// Custom hook with type safety
export const useYoutubePlayer = (): YoutubePlayerContextType => {
  const context = useContext(YoutubePlayerContext);
  if (!context) {
    throw new Error(
      "useYoutubePlayer must be used within a YoutubePlayerProvider"
    );
  }
  return context;
};

// Declare global YouTube API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          events?: {
            onReady?: (event: YouTubeEvent) => void;
            onStateChange?: (event: YouTubeEvent) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Main component
const YoutubePlayerWithSeekbar: React.FC<YoutubePlayerWithSeekbarProps> = ({
  videoId,
  className = "",
}) => {
  const { isAPIReady, registerPlayer, setIsPlaying } = useYoutubePlayer();

  const [playerElement, setPlayerElement] = useState<YouTubePlayer | null>(
    null
  );

  useEffect(() => {
    if (
      isAPIReady &&
      !playerElement &&
      videoId &&
      typeof window !== "undefined"
    ) {
      const newPlayer = new window.YT.Player(`youtube-player-${videoId}`, {
        videoId: videoId,
        events: {
          onReady: (event: YouTubeEvent) => registerPlayer(event.target),
          onStateChange: (event: YouTubeEvent) => {
            if (event.data !== undefined) {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            }
          },
        },
      });
      setPlayerElement(newPlayer);
    }
  }, [isAPIReady, videoId, registerPlayer, playerElement, setIsPlaying]);

  return (
    <div
      id={`youtube-player-${videoId}`}
      className={cn(
        "absolute right-0 top-0 aspect-video h-full w-full",
        className
      )}
    />
  );
};

export default YoutubePlayerWithSeekbar;
