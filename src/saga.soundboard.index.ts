import { root as init } from './saga.soundboard.init';
import { root as api } from './saga.soundboard.api';
import { root as tweak } from './saga.soundboard.tweak';
import { root as schedule } from './saga.soundboard.schedule';
import { root as ping } from './saga.soundboard.ping';
import { fork, take } from 'saga-ts';
import { PlatformLifeCycleEvents } from '@gdi/platformer';

function* root() {
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(init);
    yield* fork(api);
    yield* fork(tweak);
    yield* fork(schedule);
    yield* fork(ping);
}

export const appSagas = [root];
