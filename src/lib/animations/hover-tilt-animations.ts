function updateHoverTiltStyle(
    node: HTMLElement,
    selector: string,
    update: (hoverTilt: HTMLElement) => void,
) {
    const hoverTilts = node.getElementsByClassName(selector);
    for (const element of hoverTilts) {
        const hoverTilt = element as HTMLElement;
        // Ensure this is indeed a HTMLElement
        if (hoverTilt.style) {
            update(hoverTilt);
        }
    }
}

export function resetHoverTiltTransform(node: HTMLElement, params?: { duration?: number }) {
    const duration = params?.duration ?? 300;

    // Reset HoverTilt's transform with smooth transition
    updateHoverTiltStyle(node, 'hover-tilt', (hoverTilt) => {
        hoverTilt.style.setProperty(
            'transform',
            'scale(1) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)',
        );
        hoverTilt.style.setProperty('transition', `transform ${duration}ms`);
        // These CSS variables can be used to also fade the glare effect
        hoverTilt.style.setProperty('--hover-tilt-custom-glare-opacity', '0');
        hoverTilt.style.setProperty(
            '--hover-tilt-custom-glare-transition',
            `opacity ${duration}ms`,
        );
    });

    // No CSS style on the element itself
    return {
        duration: duration,
        css: () => '',
    };
}

export function blockHoverTiltTransform(node: HTMLElement, params?: { duration?: number }) {
    const duration = params?.duration ?? 300;

    // Reset HoverTilt's transform with smooth transition
    updateHoverTiltStyle(node, 'hover-tilt-container', (hoverTilt) => {
        const pointerEvents = hoverTilt.style.getPropertyValue('pointer-events');
        hoverTilt.style.setProperty('pointer-events', 'none');
        setTimeout(() => {
            if (pointerEvents) {
                hoverTilt.style.setProperty('pointer-events', pointerEvents);
            } else {
                hoverTilt.style.removeProperty('pointer-events');
            }
        }, duration);
    });

    // No CSS style on the element itself
    return {
        duration: duration,
        css: () => '',
    };
}

export function addHoverTiltGlareClass(node: HTMLElement, params: { class: string }) {
    updateHoverTiltStyle(node, 'hover-tilt', (hoverTilt) => {
        hoverTilt.classList.add(params.class);
    });
}
