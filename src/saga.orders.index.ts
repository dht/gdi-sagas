import ping from './saga.orders.ping';
import { fork, take } from 'saga-ts';
import { root as api } from './saga.orders.api';
import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(api);
    yield* fork(ping);
}

export const appSagas = [root];
