import { delay, fork, put } from 'saga-ts';
import { $s } from 'shared-base';
import { mixer as store, site } from '@gdi/selectors';

function* apiPublic() {
    $s('apiPublic', {
        nodes: ['fonts', 'breakpoints', 'palette'],
    });

    const promises = [
        yield* put(site.actions.fonts.get()),
        yield* put(site.actions.palette.get()),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

function* apiSitePublic() {
    $s('apiPublic', {
        nodes: [
            'blocks',
            'fonts',
            'breakpoints',
            'instance',
            'instanceProps',
            'pages',
            'palette',
            'datasets',
        ],
    });

    const promises = [
        yield* put(site.actions.blocks.get({})),
        yield* put(site.actions.fonts.get()),
        yield* put(site.actions.instances.get({})),
        yield* put(site.actions.instancesProps.get({})),
        yield* put(site.actions.pages.get({})),
        yield* put(site.actions.pageInstances.get({})),
        yield* put(site.actions.palette.get()),
        yield* put(site.actions.datasets.get()),
    ];

    yield Promise.all(promises);

    yield delay(100);
}

export function* root() {
    yield delay(300);
    yield* fork(apiPublic);
    yield* fork(apiSitePublic);
}
