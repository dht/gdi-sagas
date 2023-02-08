import { select } from 'saga-ts';
import { mixer as store, site } from '@gdi/selectors';

type SourceDestination = 'site' | 'library';

// P
export function* get(
    source: SourceDestination,
    entityType: any,
    filter: (entity: Json) => boolean
) {
    const map = mapAll[source];
    const selector = map[entityType];

    const collection = yield* select(selector);

    return Object.values(collection).filter(filter as any);
}

const mapAll: any = {
    site: {
        image: site.selectors.raw.$rawImages,
        instance: site.selectors.raw.$rawInstances,
        instancesProps: site.selectors.raw.$rawInstancesProps,
        page: site.selectors.raw.$rawPages,
        pageInstance: site.selectors.raw.$rawPageInstances,
        widget: site.selectors.raw.$rawWidgets,
    },
    library: {
        image: store.selectors.raw.$rawLibraryImages,
        instance: store.selectors.raw.$rawLibraryInstances,
        instancesProps: store.selectors.raw.$rawLibraryInstancesProps,
        page: store.selectors.raw.$rawLibraryPages,
        pageInstance: store.selectors.raw.$rawLibraryPageInstances,
        widget: store.selectors.raw.$rawLibraryWidgets,
    },
};
