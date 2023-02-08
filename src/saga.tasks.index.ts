import { take, fork } from 'saga-ts';
import { root as api } from './saga.tasks.api';
import { root as lifecycle } from './saga.tasks.lifecycle';
import { root as estimations } from './saga.tasks.estimations';
import { root as speech } from './saga.tasks.speech';
import { root as pie } from './saga.tasks.pie';

import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(api);
    yield* fork(lifecycle);
    yield* fork(estimations);
    yield* fork(speech);
    yield* fork(pie);
}

export const appSagas = [root];
