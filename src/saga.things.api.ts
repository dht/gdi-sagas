import { delay, fork, put } from 'saga-ts';
import { things as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateThings.get()),
        yield* put(store.actions.things.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
