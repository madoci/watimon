import { sinusoidal } from './utils';

export function whirl(node: HTMLElement) {
    const maxScale = 1.2;

    return {
        duration: 1500,
        css: (t: number) => {
            const translationX =
                t < 1 / 3
                    ? sinusoidal(t, 1.5, -1, 1)
                    : t > 2 / 3
                      ? sinusoidal(t, 1.5, -1, -1)
                      : sinusoidal(t, 1.5, -1, 0);
            const translationY = sinusoidal(t, 1, -1, 1);
            const rotationY =
                t < 0.5 ? sinusoidal(t, 1, 1, 1) : sinusoidal(2 * (t - 0.5), 1, 1, -1) * 0.2;
            const scale =
                t < 0.5
                    ? sinusoidal(t, 1, -1, 1) * maxScale
                    : sinusoidal(t, 1, -1, 1) * (maxScale - 1) + 1;
            return `transform: scale(${scale}) translateX(${translationX * 75}%) translateY(${translationY * 10}%) rotateY(${rotationY * 180}deg)`;
        },
    };
}

export function fadeOverlap(
    node: HTMLElement,
    params?: { duration?: number; overlap?: number; delay?: number },
) {
    const duration = params?.duration ?? 300;
    const overlap = params?.overlap ?? 100;
    const delay = params?.delay ?? 0;

    const overlapEnd = overlap / (duration + overlap);

    const style = getComputedStyle(node);
    const shadowOpacity = style.getPropertyValue('--drop-shadow-opacity') ?? '0%';

    return {
        duration: duration + overlap,
        delay,
        css: (t: number) => {
            const t1 = Math.min(t / overlapEnd, 1);
            const t2 = Math.max((t - overlapEnd) / (1 - overlapEnd), 0);
            return `position: absolute; top: 0; left: 0; opacity: ${t1}; --drop-shadow-opacity: calc(${shadowOpacity} * ${t2});`;
        },
    };
}

export function slideDown(node: HTMLElement) {
    const translationDelay = 0.25;
    const opacityDelay = 0.8;
    return {
        duration: 900,
        css: (t: number, u: number) => {
            const v = (u - translationDelay) / (1 - translationDelay);
            const translationY = v < 0 ? 0 : sinusoidal(v, 0.25, -1, 1);
            const opacity =
                u < opacityDelay
                    ? 1
                    : 1 - sinusoidal((u - opacityDelay) / (1 - opacityDelay) / 2, 1, -1, 1);
            return `transform: translateY(${translationY * 100}%); opacity: ${opacity};`;
        },
    };
}

export function thrown(node: HTMLElement, params?: { direction: 'left' | 'right' }) {
    const dettachedDelay = 0.25;
    const opacityDelay = 0.8;
    const direction = params?.direction ?? 'right';
    const directionSign = params?.direction === 'left' ? -1 : 1;
    return {
        duration: 600,
        css: (t: number, u: number) => {
            const v = (u - dettachedDelay) / (1 - dettachedDelay);
            const scale = v < 0 ? 1 : sinusoidal(v, 0.25, 1, 1);
            const translationY = v < 0 ? 0 : sinusoidal(v * 2, 0.25, -1, 1);
            const translationX = v < 0 ? 0 : sinusoidal(v * 1.5, 0.25, -1, 1);
            const rotationZ = u < 0.5 ? sinusoidal(u, 0.5, -1, 1) : sinusoidal(u, 0.5, -1, 1);
            const rotationY = u < 0.5 ? sinusoidal(u, 1, -1, 1) : sinusoidal(u, 1, -1, 0);
            const opacity =
                u < opacityDelay
                    ? 1
                    : 1 - sinusoidal((u - opacityDelay) / (1 - opacityDelay) / 2, 1, -1, 1);
            return `transform-origin: bottom ${direction}; transform: scale(${scale}) translateX(${directionSign * translationX * 50}%) translateY(${translationY * 1600}%) rotateZ(${directionSign * rotationZ * 10}deg) rotateY(${directionSign * rotationY * 2}deg); opacity: ${opacity};`;
        },
    };
}

export function slideCardUp(node: HTMLElement, params: { index: number; count: number }) {
    const delay = 150;
    const maxTotalDelay = 500;
    return {
        duration: 600,
        delay: params.index * Math.min(delay, maxTotalDelay / (params.count - 1)),
        css: (t: number) => `transform: translateY(${(1 - t) * 200}%);`,
    };
}

export function ghost(node: HTMLElement, params?: { duration?: number }) {
    const duration = params?.duration ?? 500;
    const top = node.offsetTop;
    const left = node.offsetLeft;
    const height = node.offsetHeight;
    const width = node.offsetWidth;
    return {
        duration,
        css: () =>
            `position: absolute; top: ${top}px; left: ${left}px; height: ${height}px; width: ${width}px;`,
    };
}
