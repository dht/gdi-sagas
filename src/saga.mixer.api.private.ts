import { delay, fork, put } from 'saga-ts';
import { $s } from 'shared-base';
import { mixer as store, site } from '@gdi/selectors';

function* apiPrivate() {
    $s('apiPrivate', {
        nodes: [
            'appStateMixer',
            'libraryWidgets',
            'libraryImages',
            'libraryInstances',
            'libraryInstancesProps',
            'libraryPages',
            'libraryPageInstances',
            'libraryPalettes',
            'libraryTypography',
            'libraryDatasets',
            'locales',
            'packages',
            'siteProperties',
        ],
    });

    const promises = [
        yield* put(store.actions.appStateMixer.get()),
        yield* put(store.actions.libraryWidgets.get({})),
        yield* put(store.actions.libraryImages.get({})),
        yield* put(store.actions.libraryInstances.get({})),
        yield* put(store.actions.libraryInstancesProps.get({})),
        yield* put(store.actions.libraryPages.get({})),
        yield* put(store.actions.libraryPageInstances.get({})),
        yield* put(store.actions.libraryPalettes.get()),
        yield* put(store.actions.libraryTypography.get({})),
        yield* put(store.actions.libraryDatasets.get()),
        yield* put(store.actions.locales.get({})),
        yield* put(store.actions.packages.get({})),
        yield* put(site.actions.siteProperties.get()),
        yield* put(site.actions.datasets.get()),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(apiPrivate);
}
