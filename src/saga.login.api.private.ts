import { delay, fork, put } from 'saga-ts';
import { $s } from 'shared-base';
import { auth as store } from '@gdi/selectors';

function* apiPrivate() {
    $s('apiPrivate', {
        nodes: ['users', 'roles'],
    });

    const promises = [
        yield* put(store.actions.users.get({})),
        yield* put(store.actions.roles.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(apiPrivate);
}
