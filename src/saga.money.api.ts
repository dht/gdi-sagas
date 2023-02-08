import { delay, fork, put } from 'saga-ts';
import { money as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateMoney.get()),
        yield* put(store.actions.moneyBehaviors.get({})),
        yield* put(store.actions.moneyLines.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
