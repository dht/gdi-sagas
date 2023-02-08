import ping from './saga.deals.ping';
import { fork, take } from 'saga-ts';
import { root as api } from './saga.deals.api';
import { root as pie } from './saga.deals.pie';
import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(api);
    yield* fork(pie);
    yield* fork(ping);
}

export const appSagas = [root];
