export function resetHoverTilt(node: HTMLElement, params?: { duration?: number }) {
    const duration = params?.duration ?? 300;

    // Reset HoverTilt's transform with smooth transition
    const hoverTilts = node.getElementsByClassName('hover-tilt');
    for (const element of hoverTilts) {
        const hoverTilt = element as HTMLElement;
        if (hoverTilt.style) {
            hoverTilt.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
            hoverTilt.style.transition = `transform ${duration}ms`;
        }
    }

    // No CSS style on the element itself
    return {
        duration: duration,
        css: () => '',
    };
}
