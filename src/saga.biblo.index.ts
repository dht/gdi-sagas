import ping from './saga.biblo.ping';
import { fork, take } from 'saga-ts';
import { PlatformLifeCycleEvents } from '@gdi/platformer';
import { root as api } from './saga.biblo.api';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(api);
    yield* fork(ping);
}

export const appSagas = [root];
