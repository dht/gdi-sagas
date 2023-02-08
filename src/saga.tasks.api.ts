import { delay, fork, put } from 'saga-ts';
import { tasks as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.projects.get({})),
        yield* put(store.actions.tickets.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
