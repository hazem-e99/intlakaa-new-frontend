import React, { useEffect, useRef } from 'react';

interface SafariVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    src: string;
}

/**
 * SafariVideo Fix Component
 * 
 * Specifically designed to solve the "black screen" issue on Safari (iOS/macOS)
 * when a video has no poster image and is initially hidden or in a conditional layout.
 */
const SafariVideo = React.forwardRef<HTMLVideoElement, SafariVideoProps>(({
    src,
    className,
    autoPlay = false,
    muted = true,
    playsInline = true,
    preload = "metadata",
    ...props
}, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Merge forwarded ref with local ref
    const setRefs = (node: HTMLVideoElement) => {
        (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // 1. Force a small seek to render the first frame
        const forceFirstFrame = () => {
            // Safari needs a tiny seek to 'wake up' the video renderer for the first frame
            // without needing a poster image.
            if (video.currentTime === 0) {
                video.currentTime = 0.01;
            }
        };

        // 2. Intersection Observer to handle videos in tabs/hidden layouts
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // When video becomes visible, we trigger load()
                    // This ensures Safari fetches metadata and renders the frame
                    video.load();

                    // Once it's loaded metadata, we perform the seek trick
                    video.addEventListener('loadedmetadata', forceFirstFrame, { once: true });

                    // Stop observing once we've triggered the initial load
                    observer.unobserve(video);
                }
            });
        }, { threshold: 0 });

        observer.observe(video);

        return () => {
            observer.disconnect();
            video.removeEventListener('loadedmetadata', forceFirstFrame);
        };
    }, [src]);

    return (
        <video
            ref={setRefs}
            className={className}
            /* Required: allow playing without fullscreen on iOS */
            playsInline={playsInline}
            /* Required: hint to the browser to load metadata so we can seek */
            preload={preload}
            /* Required: many Safari versions require muted for any autoplay or rendering behavior */
            muted={muted}
            autoPlay={autoPlay}
            {...props}
        >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
});

SafariVideo.displayName = 'SafariVideo';

export default SafariVideo;
