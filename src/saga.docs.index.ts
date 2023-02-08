import ping from './saga.docs.ping';
import { fork, take } from 'saga-ts';
import { root as api } from './saga.docs.api';
import { root as docs } from './saga.docs.docs';
import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(api);
    yield* fork(docs);
    yield* fork(ping);
}

export const appSagas = [root];
