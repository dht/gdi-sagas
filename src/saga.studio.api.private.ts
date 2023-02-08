import { delay, fork, put } from 'saga-ts';
import { $s } from 'shared-base';
import { studio as store, dashboard } from '@gdi/selectors';

function* apiPrivate() {
    $s('apiPrivate', {
        nodes: ['stats', 'statsJourneys', 'inboxMessages'],
    });

    const promises = [
        yield* put(dashboard.actions.stats.get({})),
        yield* put(dashboard.actions.statsJourneys.get({})),
        yield* put(dashboard.actions.inboxMessages.get({})),
        yield* put(store.actions.studioBoards.get({})),
        yield* put(store.actions.studioCameras.get({})),
        yield* put(store.actions.studioGrounds.get({})),
        yield* put(store.actions.studioExternals.get({})),
        yield* put(store.actions.studioLights.get({})),
        yield* put(store.actions.studioMicroAnimations.get({})),
        yield* put(store.actions.studioPacks.get({})),
        yield* put(store.actions.studioParticles.get({})),
        yield* put(store.actions.studioSounds.get({})),
        yield* put(store.actions.studioSprites.get({})),
        yield* put(store.actions.studioVideos.get({})),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(apiPrivate);
}
