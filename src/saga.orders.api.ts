import { delay, fork, put } from 'saga-ts';
import { orders as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateOrders.get()),
        yield* put(store.actions.orders.get({})),
        yield* put(store.actions.orderJournals.get({})),
        yield* put(store.actions.coupons.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
