import { call, put, select, takeEvery, delay } from 'saga-ts';
import { guid4 } from 'shared-base';
import {
    findDescendantsIds,
    findRoot,
    getItemInfo,
    nextOrder,
} from './utils/flex';
import { factory as store } from '@gdi/selectors';

type ActionSplitFlex = {
    type: 'SPLIT_FLEX';
    isHorizontally: boolean;
};

function* splitFlex(action: ActionSplitFlex) {
    const { isHorizontally } = action;

    const layout = yield* select(store.selectors.base.$layout);
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);

    if (!layout || !layout.items) {
        return;
    }

    const { layoutId, flexEntityId, resolutionId } = currentIds;

    if (!layoutId || !flexEntityId || !resolutionId) {
        return;
    }

    const { items } = layout;

    const info = getItemInfo(items, flexEntityId);

    if (!info.parent || !info.item) {
        return;
    }

    let newItem1: IFlexEntity, newItem2: IFlexEntity;

    const sameDirection =
        (isHorizontally && info.parentFlexDirection === 'row') ||
        (!isHorizontally && info.parentFlexDirection === 'column');

    if (sameDirection) {
        const order = nextOrder(items, info.parentId);

        newItem1 = {
            id: guid4(),
            entityType: 'item',
            parentId: info.parentId,
            resolution: resolutionId as IResolution,
            order,
        };

        yield* put(store.actions.layouts.pushItem(layoutId, newItem1));
    } else {
        const id = guid4();

        newItem1 = {
            id,
            entityType: 'container',
            parentId: info.parentId,
            direction: isHorizontally ? 'row' : 'column',
            resolution: resolutionId as IResolution,
            order: info.item.order,
            flex: info.item.flex,
        };

        newItem2 = {
            ...info.item,
            id: guid4(),
            parentId: id,
            order: 2,
        };

        yield* put(store.actions.layouts.pushItem(layoutId, newItem1));
        yield* put(store.actions.layouts.pushItem(layoutId, newItem2));

        yield* put(
            store.actions.layouts.patchItem(layoutId, info.item.id, {
                parentId: id,
                order: 1,
            })
        );
    }
}

function* deleteFlex() {
    const layout = yield* select(store.selectors.base.$layout);
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
    const { flexEntityId } = currentIds;

    if (!layout || !layout.items || !flexEntityId) {
        return;
    }

    const { items } = layout;

    const ids = findDescendantsIds(items, currentIds.flexEntityId);

    for (let id of ids) {
        yield put(store.actions.layouts.deleteItem(currentIds.layoutId, id));
    }

    yield put(
        store.actions.layouts.deleteItem(
            currentIds.layoutId,
            currentIds.flexEntityId
        )
    );
}

export function* clear() {
    const layout = yield* select(store.selectors.base.$layout);

    if (!layout || !layout.items) {
        return;
    }

    const root = findRoot(layout.items);

    if (!root) {
        return;
    }

    yield put(
        store.actions.currentIdsFactory.patch({
            flexEntityId: root.id,
        })
    );

    yield delay(100);

    yield call(deleteFlex);
}

function* rotateFlex() {
    const layout = yield* select(store.selectors.base.$layout);
    const flexEntity = yield* select(store.selectors.base.$flexEntity);

    if (!layout || !flexEntity) {
        return;
    }

    const { direction } = flexEntity;

    if (!direction) {
        return;
    }

    const newDirection = direction === 'column' ? 'row' : 'column';

    yield put(
        store.actions.layouts.patchItem(layout.id, flexEntity.id, {
            direction: newDirection,
        })
    );
}

export function* root() {
    yield takeEvery('FLEX_SPLIT', splitFlex);
    yield takeEvery('FLEX_ROTATE', rotateFlex);
    yield takeEvery('FLEX_DELETE', deleteFlex);
}
