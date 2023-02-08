import { delay, fork, put } from 'saga-ts';
import { events as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateEvents.get()),
        yield* put(store.actions.events.get({})),
        yield* put(store.actions.reminders.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
