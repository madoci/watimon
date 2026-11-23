let timeTick = $state(Date.now());

let intervalId: ReturnType<typeof setInterval> | undefined;

export function getTimeTick() {
    return timeTick;
}

export function initializeTimeTick() {
    if (intervalId === undefined) {
        intervalId = setInterval(() => {
            timeTick = Date.now();
        }, 1000);
    }
    return () => {
        intervalId !== undefined && clearInterval(intervalId);
        intervalId = undefined;
    };
}
