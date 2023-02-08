import { select } from 'saga-ts';
import { mixer as store, site } from '@gdi/selectors';
import type { SourceDestination, Entity } from './types/types.mixer';

// P
export function* createPage(
    source: SourceDestination,
    destination: SourceDestination,
    sourceId: string,
    destinationId?: string
) {
    const selector =
        source === 'site'
            ? site.selectors.raw.$rawPages
            : store.selectors.raw.$rawLibraryPages;

    const pages = yield* select(selector);
    const page = pages[sourceId];
}

// V
export function* createPageInstance(
    source: SourceDestination,
    destination: SourceDestination,
    id: string
) {
    const selector =
        source === 'site'
            ? site.selectors.raw.$rawPageInstances
            : store.selectors.raw.$rawLibraryPageInstances;

    const pageInstance = yield* select(selector);
}

// I
export function* createInstance(
    source: SourceDestination,
    destination: SourceDestination,
    id: string
) {
    const selector =
        source === 'site'
            ? site.selectors.raw.$rawInstances
            : store.selectors.raw.$rawLibraryInstances;
}

// D
export function* createInstancesProps(
    source: SourceDestination,
    destination: SourceDestination,
    id: string
) {
    const selector =
        source === 'site'
            ? site.selectors.raw.$rawInstancesProps
            : store.selectors.raw.$rawLibraryInstancesProps;
}

// W
export function* createWidget(
    source: SourceDestination,
    destination: SourceDestination,
    id: string
) {
    const selector =
        source === 'site'
            ? site.selectors.raw.$rawWidgets
            : store.selectors.raw.$rawLibraryWidgets;
}

// M
export function* createImage(
    source: SourceDestination,
    destination: SourceDestination,
    id: string
) {
    const selector =
        source === 'site'
            ? site.selectors.raw.$rawImages
            : store.selectors.raw.$rawLibraryImages;
}

export function* create(
    source: SourceDestination,
    destination: SourceDestination,
    entityType: Entity,
    id: string
) {
    switch (entityType as any) {
        case 'page':
            yield createPage(source, destination, id);
            break;
        case 'pageInstance':
            yield createPageInstance(source, destination, id);
            break;
        case 'instance':
            yield createInstance(source, destination, id);
            break;
        case 'instancesProps':
            yield createInstancesProps(source, destination, id);
            break;
        case 'widget':
            yield createWidget(source, destination, id);
            break;
        case 'image':
            yield createImage(source, destination, id);
            break;
    }
}
