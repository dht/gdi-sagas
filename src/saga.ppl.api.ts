import { ppl as store } from '@gdi/selectors';
import { delay, fork, put } from 'saga-ts';

function* api() {
    const promises = [
        yield* put(store.actions.appStatePpl.get()),
        yield* put(store.actions.persons.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
