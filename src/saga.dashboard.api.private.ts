import { delay, fork, put } from 'saga-ts';
import { $s } from 'shared-base';
import { dashboard as store } from '@gdi/selectors';

function* apiPrivate() {
    $s('apiPrivate', {
        nodes: ['stats', 'statsJourneys', 'inboxMessages'],
    });

    const promises = [
        yield* put(store.actions.stats.get({})),
        yield* put(store.actions.statsJourneys.get({})),
        yield* put(store.actions.inboxMessages.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(apiPrivate);
}
