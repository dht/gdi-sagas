import { call, fork, put, select, takeEvery, delay, take } from 'saga-ts';
import { prompt } from '@gdi/web-ui';
import { factory as store } from '@gdi/selectors';

function* editFlex() {
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
    const flexEntity = yield* select(store.selectors.base.$flexEntity);
    const { layoutId, flexEntityId } = currentIds;

    if (!layoutId || !flexEntityId || !flexEntity) {
        return;
    }

    yield put(
        store.actions.appStateFactory.patch({
            showPropertiesModal: true,
        })
    );
}

function* chooseNameFlex() {
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
    const flexEntity = yield* select(store.selectors.base.$flexEntity);
    const options = yield* select(store.selectors.options.$layoutLocationIds);
    const { layoutId, flexEntityId } = currentIds;

    if (!layoutId || !flexEntityId || !flexEntity) {
        return;
    }

    const { value, didCancel } = yield* call((prompt as any).select, {
        title: 'Placeholder',
        description: 'Choose Id: ',
        placeholder: 'For instance "topLeft" or "main"',
        defaultValue: flexEntity.locationId,
        options,
        submitButtonText: 'Set (⌥⏎)',
    }) as any;

    if (didCancel) {
        return;
    }

    yield put(
        store.actions.layouts.patchItem(layoutId, flexEntityId, {
            locationId: value,
        })
    );
}

function* renameFlex() {
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
    const flexEntity = yield* select(store.selectors.base.$flexEntity);
    const { layoutId, flexEntityId, resolutionId } = currentIds;

    if (!layoutId || !flexEntityId || !flexEntity) {
        return;
    }

    if (flexEntity.entityType === 'container') {
        return;
    }

    if (resolutionId !== '1080p') {
        yield call(chooseNameFlex);
        return;
    }

    const { value, didCancel } = yield* call(prompt.input, {
        title: 'Placeholder',
        description: 'Placeholder Id: ',
        placeholder: 'For instance "topLeft" or "main"',
        defaultValue: flexEntity.locationId,
        submitButtonText: 'Set (⏎)',
    });

    if (didCancel) {
        return;
    }

    yield put(
        store.actions.layouts.patchItem(layoutId, flexEntityId, {
            locationId: value,
        })
    );
}

type StyleFlexAction = {
    type: 'FLEX_PROPS_FLEX';
    flex: number;
};

function* changeStyleFlex(action: StyleFlexAction) {
    const { flex } = action;
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
    const flexEntity = yield* select(store.selectors.base.$flexEntity);
    const { layoutId, flexEntityId } = currentIds;

    if (!layoutId || !flexEntityId || !flexEntity) {
        return;
    }

    yield put(
        store.actions.layouts.patchItem(layoutId, flexEntityId, {
            flex,
        })
    );
}

export function* root() {
    yield takeEvery('FLEX_RENAME', renameFlex);
    yield takeEvery('FLEX_EDIT', editFlex);
    yield takeEvery('FLEX_PROPS_FLEX', changeStyleFlex);
}
