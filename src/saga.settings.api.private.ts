import { delay, fork, put } from 'saga-ts';
import { $s } from 'shared-base';
import { settings as store, business } from '@gdi/selectors';

function* apiPrivate() {
    $s('apiPrivate', {
        nodes: ['business', 'settings'],
    });

    const promises = [
        yield* put(business.actions.business.get()),
        yield* put(store.actions.settings.get()),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(apiPrivate);
}
