import { delay, fork, put } from 'saga-ts';
import { $s } from 'shared-base';
import { factory as store } from '@gdi/selectors';

function* apiPrivate() {
    $s('apiPrivate', {
        nodes: ['appStateFactory', 'layouts'],
    });

    const promises = [
        yield* put(store.actions.appStateFactory.get()),
        yield* put(store.actions.layouts.get({})),
        yield* put(store.actions.articles.get({})),
        yield* put(store.actions.articleCategories.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(apiPrivate);
}
