# React YouTube Player with Seekbar

[![npm version](https://img.shields.io/npm/v/@nishansanjuka/react-yt-framer.svg)](https://www.npmjs.com/package/@nishansanjuka/react-yt-framer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fully-typed React component for embedding YouTube videos in Next.js applications with advanced playback controls and a customizable seekbar.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [YoutubePlayerProvider](#youtubeplayer-provider)
  - [YoutubePlayerWithSeekbar](#youtubeplayer-with-seekbar)
  - [useYoutubePlayer Hook](#useyoutubeplayer-hook)
- [Advanced Usage](#advanced-usage)
- [TypeScript Support](#typescript-support)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🎯 **Full TypeScript Support**: Built with TypeScript for excellent type safety and IntelliSense
- 🎮 **Advanced Controls**: Play, pause, seek, and reset functionality
- ⚡ **Performance Optimized**: Minimal re-renders and efficient state management
- 🎨 **Customizable**: Easily style and extend components
- 📱 **Responsive**: Works across all device sizes
- 🔄 **State Management**: Built-in context for managing player state
- 🎬 **YouTube API Integration**: Seamless integration with YouTube's IFrame API

## 🚀 Installation

```bash
# Using npm
npm install @nishansanjuka/react-yt-framer

# Using yarn
yarn add @nishansanjuka/react-yt-framer

# Using pnpm
pnpm add @nishansanjuka/react-yt-framer
```

## 🎯 Quick Start

```tsx
import {
  YoutubePlayerProvider,
  YoutubePlayerWithSeekbar,
} from "@nishansanjuka/react-yt-framer";

function App() {
  return (
    <YoutubePlayerProvider>
      <YoutubePlayerWithSeekbar
        videoId="dQw4w9WgXcQ"
        className="aspect-video w-full"
      />
    </YoutubePlayerProvider>
  );
}
```

## 📖 API Reference

### YoutubePlayer Provider

The provider component that manages the YouTube player state and context.

```tsx
import { YoutubePlayerProvider } from "@nishansanjuka/react-yt-framer";

function App() {
  return <YoutubePlayerProvider>{/* Your components */}</YoutubePlayerProvider>;
}
```

### YoutubePlayer With Seekbar

The main component that renders the YouTube player.

```tsx
interface YoutubePlayerWithSeekbarProps {
  videoId: string;
  className?: string;
}
```

#### Props

| Prop      | Type    | Description          |
| --------- | ------- | -------------------- |
| videoId   | string  | YouTube video ID     |
| className | string? | Optional CSS classes |

### useYoutubePlayer Hook

A custom hook for accessing player controls and state.

```tsx
const {
  duration,
  currentTime,
  isPlaying,
  isAPIReady,
  play,
  pause,
  seek,
  reset,
  setIsPlaying,
} = useYoutubePlayer();
```

#### Return Values

| Value        | Type                       | Description                          |
| ------------ | -------------------------- | ------------------------------------ |
| duration     | number                     | Total video duration in seconds      |
| currentTime  | number                     | Current playback position in seconds |
| isPlaying    | boolean                    | Whether video is currently playing   |
| isAPIReady   | boolean                    | Whether YouTube API is loaded        |
| play         | () => void                 | Function to play video               |
| pause        | () => void                 | Function to pause video              |
| seek         | (time: number) => void     | Function to seek to specific time    |
| reset        | () => void                 | Function to reset video to start     |
| setIsPlaying | (playing: boolean) => void | Function to set playing state        |

## 🎨 Advanced Usage

### Custom Controls Example

```tsx
import { useYoutubePlayer } from "@nishansanjuka/react-yt-framer";

function CustomControls() {
  const { play, pause, isPlaying, currentTime, duration, seek } =
    useYoutubePlayer();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  return (
    <div className="flex gap-2 items-center">
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeek}
      />
      <span>
        {Math.floor(currentTime)} / {Math.floor(duration)}s
      </span>
    </div>
  );
}
```

### Multiple Players

```tsx
function VideoGallery() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <YoutubePlayerProvider>
        <YoutubePlayerWithSeekbar videoId="video1" />
      </YoutubePlayerProvider>
      <YoutubePlayerProvider>
        <YoutubePlayerWithSeekbar videoId="video2" />
      </YoutubePlayerProvider>
    </div>
  );
}
```

## 🔍 TypeScript Support

The package includes comprehensive TypeScript definitions. Here are some key types:

```typescript
interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  stopVideo(): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
}

interface YoutubePlayerContextType {
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
```

## 💡 Examples

### Basic Player

```tsx
function BasicPlayer() {
  return (
    <YoutubePlayerProvider>
      <YoutubePlayerWithSeekbar
        videoId="dQw4w9WgXcQ"
        className="w-full aspect-video rounded-lg shadow-lg"
      />
    </YoutubePlayerProvider>
  );
}
```

### Player with Custom Controls and Progress Bar

```tsx
function CustomPlayer() {
  const { currentTime, duration, seek, isPlaying, play, pause } =
    useYoutubePlayer();

  const progress = (currentTime / duration) * 100;

  return (
    <div className="space-y-4">
      <YoutubePlayerWithSeekbar videoId="dQw4w9WgXcQ" />

      <div className="flex items-center gap-4">
        <button
          onClick={isPlaying ? pause : play}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="flex-1 bg-gray-200 h-2 rounded">
          <div
            className="bg-blue-500 h-full rounded"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-sm">
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </span>
      </div>
    </div>
  );
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Troubleshooting

### Common Issues

1. **YouTube API Not Loading**

```tsx
// Make sure you're using the Provider
<YoutubePlayerProvider>
  <YourComponent />
</YoutubePlayerProvider>
```

2. **Type Errors**

```tsx
// Import types directly
import type { YoutubePlayerContextType } from "@nishansanjuka/react-yt-framer";
```

3. **Player Not Mounting**

```tsx
// Ensure videoId is valid
<YoutubePlayerWithSeekbar videoId="valid-youtube-id" />
```

## 📦 Package Structure

```
@nishansanjuka/react-yt-framer/
├── dist/
│   ├── cjs/           # CommonJS bundle
│   ├── esm/           # ES Modules bundle
│   └── index.d.ts     # TypeScript declarations
├── src/
│   ├── components/    # React components
│   └── types/        # TypeScript types
└── package.json
```

## 🔄 Updates and Versioning

We follow [Semantic Versioning](https://semver.org/). Here's a summary of what each number means:

- **Major** version when making incompatible API changes
- **Minor** version when adding functionality in a backwards compatible manner
- **Patch** version when making backwards compatible bug fixes

Check the [CHANGELOG.md](CHANGELOG.md) for detailed release notes.

---

Made with ❤️ by Nipuna Nishan
