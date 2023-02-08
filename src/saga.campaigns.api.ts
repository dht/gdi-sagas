import { delay, fork, put } from 'saga-ts';
import { campaigns as store } from '@gdi/selectors';

function* api() {
    const promises = [
        yield* put(store.actions.appStateCampaigns.get()),
        yield* put(store.actions.campaigns.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(api);
}
