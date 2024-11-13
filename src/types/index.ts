export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  stopVideo(): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
}

export interface YouTubeEvent {
  target: YouTubePlayer;
  data?: number;
}

export interface YoutubePlayerContextType {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  isAPIReady: boolean;
  registerPlayer: (player: YouTubePlayer) => void;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setIsPlaying: (playing: boolean) => void;
}

export interface YoutubePlayerProviderProps {
  children: React.ReactNode;
}

export interface YoutubePlayerWithSeekbarProps {
  videoId: string;
  className?: string;
}
