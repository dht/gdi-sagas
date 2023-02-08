import { delay, fork, put } from 'saga-ts';
import { knowledge as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateKnowledge.get()),
        yield* put(store.actions.linkCategories.get({})),
        yield* put(store.actions.links.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
