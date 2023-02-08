import { delay, fork, put } from 'saga-ts';
import { biblo as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateBiblo.get()),
        yield* put(store.actions.interestingReads.get({})),
        yield* put(store.actions.readCategories.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
