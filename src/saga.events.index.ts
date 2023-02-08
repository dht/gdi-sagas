import ping from './saga.events.ping';
import { fork, take } from 'saga-ts';
import { root as api } from './saga.events.api';
import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(api);
    yield* fork(ping);
}

export const appSagas = [root];
