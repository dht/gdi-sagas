import { delay, put, fork } from 'saga-ts';
import { soundboard as store } from '@gdi/selectors';

export function* api() {
    const promises = [
        yield* put(store.actions.appStateScheduler.get()),
        yield* put(store.actions.actualManas.get({})),
        yield* put(store.actions.expectedManas.get({})),
        yield* put(store.actions.scheduleBlocks.get({})),
        yield* put(store.actions.scheduleSessions.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}

export default root;
