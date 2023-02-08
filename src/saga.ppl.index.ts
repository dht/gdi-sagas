import ping from './saga.ppl.ping';
import { fork, take } from 'saga-ts';
import { root as api } from './saga.ppl.api';
import { root as pie } from './saga.ppl.pie';
import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(api);
    yield* fork(pie);
    yield* fork(ping);
}

export const appSagas = [root];
