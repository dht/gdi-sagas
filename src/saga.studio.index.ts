import ping from './saga.studio.ping';
import { fork, take } from 'saga-ts';
import { root as apiPrivate } from './saga.studio.api.private';
import { root as statClick } from './saga.studio.statClick';
import { PlatformLifeCycleEvents } from '@gdi/types';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(apiPrivate);
    yield* fork(statClick);
    yield* fork(ping);
}

export const appSagas = [root];
