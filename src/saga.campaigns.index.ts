import ping from './saga.campaigns.ping';
import { fork, take } from 'saga-ts';
import { root as api } from './saga.campaigns.api';
import { root as pie } from './saga.campaigns.pie';
import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(api);
    yield* fork(pie);
    yield* fork(ping);
}

export const appSagas = [root];
