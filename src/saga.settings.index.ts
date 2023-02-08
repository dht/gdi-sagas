import { fork, take } from 'saga-ts';
import ping from './saga.settings.ping';
import { PlatformLifeCycleEvents } from '@gdi/types';
import { root as apiPrivate } from './saga.settings.api.private';
import { root as settings } from './saga.settings.settings';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(apiPrivate);
    yield* fork(settings);
    yield* fork(ping);
}

export const appSagas = [root];
