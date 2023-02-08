import ping from './saga.dashboard.ping';
import { fork, take } from 'saga-ts';
import { root as apiPrivate } from './saga.dashboard.api.private';
import { root as statClick } from './saga.dashboard.statClick';
import { root as inbox } from './saga.dashboard.inbox';
import { PlatformLifeCycleEvents } from '@gdi/types';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(apiPrivate);
    yield* fork(statClick);
    yield* fork(inbox);
    yield* fork(ping);
}

export const appSagas = [root];
