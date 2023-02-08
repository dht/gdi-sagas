import { call, delay, fork, put, select, take, takeEvery } from 'saga-ts';
import { clear } from './saga.factory.flex.split';
import { duplicateItems } from './utils/flex';
import { factory as store } from '@gdi/selectors';
import { guid, guid4 } from 'shared-base';
import { toast } from '@gdi/web-ui';

type ActionSeedFlex = {
    type: 'FLEX_SEED';
    withId: string;
};

function* seedFlex(action: ActionSeedFlex) {
    const { withId } = action;

    const layout = yield* select(store.selectors.base.$layoutWithAllItems);
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
    const { layoutId, resolutionId } = currentIds;

    if (!layout || !layout.items || !resolutionId) {
        return;
    }

    // cannot reset 1080p to self
    if (resolutionId === withId) {
        toast.show('Cannot reset 1080p to self', 'warning');

        return;
    }

    yield call(clear);

    const { items } = layout;

    let itemsToAdd: IFlexEntity[] = [];

    if (withId === 'blank') {
        const id = guid4();

        const itemsToAdd = [
            {
                id,
                parentId: '',
                entityType: 'container',
                resolution: resolutionId,
                direction: 'row',
                order: 1,
            },
            {
                id: guid4(),
                parentId: id,
                entityType: 'item',
                resolution: resolutionId,
                locationId: 'main',
                order: 2,
            },
        ];

        for (let item of itemsToAdd) {
            yield put(store.actions.layouts.pushItem(layoutId, item));
        }
    } else {
        const itemsForSourceResolution = items.filter(
            (i: IFlexEntity) => i.resolution === '1080p'
        );

        itemsToAdd = duplicateItems(itemsForSourceResolution, {
            resolution: resolutionId,
        });

        for (let item of itemsToAdd) {
            yield put(store.actions.layouts.pushItem(layoutId, item));
        }
    }
}

export function* root() {
    yield takeEvery('FLEX_SEED', seedFlex);
}
