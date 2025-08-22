# Fullscreen Module System

This system provides a seamless fullscreen experience for navigating between modules and submodules while maintaining fullscreen state.

## Features

- **Persistent Fullscreen**: Fullscreen mode is maintained when navigating between modules
- **Keyboard Navigation**: Arrow keys, spacebar, and other shortcuts for easy navigation
- **Video Support**: Built-in video player with controls and auto-advance
- **Content Types**: Supports both static content and video content
- **Responsive Design**: Works on all screen sizes and devices

## Components

### 1. FullscreenModule
For static content modules (text, images, interactive elements).

### 2. FullscreenVideoModule
For video-based modules with built-in video controls.

### 3. useFullscreenNavigation Hook
Custom hook for managing fullscreen state across components.

## Usage

### Basic Implementation

```tsx
import { FullscreenModule } from '@/components/fullscreen-module';

const modules = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: <div>Your content here</div>
  },
  {
    id: 'm1',
    title: 'Module 1',
    content: <div>Module 1 content</div>
  }
];

function MyPage() {
  const [showFullscreen, setShowFullscreen] = useState(false);

  if (showFullscreen) {
    return (
      <FullscreenModule
        modules={modules}
        initialModuleId="introduction"
        onClose={() => setShowFullscreen(false)}
        className="min-h-screen"
      />
    );
  }

  return (
    <button onClick={() => setShowFullscreen(true)}>
      Launch Fullscreen
    </button>
  );
}
```

### Video Modules

```tsx
import { FullscreenVideoModule } from '@/components/fullscreen-video-module';

const videoModules = [
  {
    id: 'intro',
    title: 'Introduction Video',
    description: 'Learn about our company',
    videoUrl: 'https://example.com/video.mp4',
    autoPlay: true
  }
];

function VideoPage() {
  const [showFullscreen, setShowFullscreen] = useState(false);

  if (showFullscreen) {
    return (
      <FullscreenVideoModule
        modules={videoModules}
        initialModuleId="intro"
        onClose={() => setShowFullscreen(false)}
        className="min-h-screen"
      />
    );
  }

  return (
    <button onClick={() => setShowFullscreen(true)}>
      Watch Videos
    </button>
  );
}
```

## Module Structure

### Content Modules
```typescript
interface Module {
  id: string;           // Unique identifier
  title: string;        // Display title
  content: React.ReactNode; // React component or JSX
  nextModuleId?: string;    // Optional: next module ID
  prevModuleId?: string;    // Optional: previous module ID
}
```

### Video Modules
```typescript
interface VideoModule {
  id: string;           // Unique identifier
  title: string;        // Display title
  videoUrl: string;     // Video source URL
  description?: string; // Optional description
  nextModuleId?: string;    // Optional: next module ID
  prevModuleId?: string;    // Optional: previous module ID
  autoPlay?: boolean;       // Auto-play video when loaded
}
```

## Keyboard Controls

### Navigation
- **Left Arrow (←)**: Previous module
- **Right Arrow (→)**: Next module
- **Space**: Play/Pause (video modules only)

### Fullscreen
- **F11**: Toggle fullscreen
- **Escape**: Exit fullscreen
- **M**: Mute/Unmute (video modules only)

## Fullscreen State Management

The system automatically detects fullscreen changes and maintains state:

```tsx
import { useFullscreenNavigation } from '@/components/fullscreen-module';

function MyComponent() {
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreenNavigation();

  return (
    <div>
      {isFullscreen ? (
        <button onClick={exitFullscreen}>Exit Fullscreen</button>
      ) : (
        <button onClick={enterFullscreen}>Enter Fullscreen</button>
      )}
    </div>
  );
}
```

## Styling

The components use Tailwind CSS classes and can be customized:

```tsx
<FullscreenModule
  modules={modules}
  initialModuleId="intro"
  className="custom-fullscreen-class"
/>
```

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11.1+)
- **Mobile**: Touch-friendly controls

## Best Practices

1. **Module IDs**: Use descriptive, unique IDs for easy debugging
2. **Content Size**: Keep module content reasonable for smooth navigation
3. **Video Optimization**: Compress videos for faster loading
4. **Accessibility**: Ensure keyboard navigation works for all users
5. **Mobile**: Test touch interactions on mobile devices

## Example Pages

- `/fullscreen-modules` - Static content modules
- `/fullscreen-video-modules` - Video-based modules

## Troubleshooting

### Fullscreen Not Working
- Ensure HTTPS is used (required for fullscreen API)
- Check browser permissions
- Verify user interaction before calling fullscreen

### Navigation Issues
- Check module IDs are unique
- Verify module order in array
- Ensure all required props are provided

### Video Playback
- Check video format compatibility
- Verify video URLs are accessible
- Test autoplay policies in different browsers

## Customization

You can extend the components by:

1. **Adding new content types**
2. **Customizing navigation controls**
3. **Implementing progress tracking**
4. **Adding analytics events**
5. **Creating custom themes**

## Performance Considerations

- Lazy load video content
- Optimize images and media
- Use React.memo for static content
- Implement virtual scrolling for many modules
