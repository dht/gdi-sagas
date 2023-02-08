import { delay, fork, put } from 'saga-ts';
import { leads as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateLeads.get()),
        yield* put(store.actions.leads.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
