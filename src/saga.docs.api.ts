import { delay, fork, put } from 'saga-ts';
import { docs as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateDocs.get()),
        yield* put(store.actions.docs.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
