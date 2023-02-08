import ping from './saga.source.ping';
import { fork, take } from 'saga-ts';
import { root as importData } from './saga.source.import';
import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(importData);
    yield* fork(ping);
}

export const appSagas = [root];
