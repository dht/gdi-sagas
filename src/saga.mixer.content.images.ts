import { delay, put, select, takeEvery } from 'saga-ts';
import { onInstanceSelectionChange } from './predicates/predicates.mixer';
import { mixer as store } from '@gdi/selectors';

type ActionSwitchImage = {
    type: 'SWITCH_IMAGE_ACTION';
    imageId: string;
    unselect?: boolean;
};

function* switchImage(action: ActionSwitchImage) {
    try {
        const { imageId, unselect } = action;
        const images = yield* select(store.selectors.raw.$rawLibraryImages);
        const params = yield* select(
            store.selectors.base.$selectedElementImageId
        );
        const { instanceId, fieldId } = params;

        const image = images[imageId];

        if (!image) {
            return;
        }

        const fieldIdWithDashes = fieldId.replace(/\./g, '_');

        yield put(
            store.actions.libraryInstancesProps.patch(instanceId, {
                [fieldIdWithDashes]: unselect ? '' : image.imageUrl,
            })
        );
    } catch (_err) {}
}

function* chooseFirstImageField(action: any) {
    yield delay(10);

    const fieldInfo = yield* select(
        store.selectors.base.$imageFieldsForCurrentElement
    );

    if (!fieldInfo) {
        return;
    }

    const fieldId = Object.keys(fieldInfo)[0];

    yield put(store.actions.currentIds.patch({ fieldId }));

    yield delay(10);

    const params = yield* select(store.selectors.base.$selectedElementImageId);

    if (params.imageId) {
        // yield put(
        //     actions.galleryState.patch({
        //         selectedIds: [params.imageId],
        //     })
        // );
    }
}

export function* root() {
    yield takeEvery('SWITCH_IMAGE_ACTION', switchImage);
    yield takeEvery(onInstanceSelectionChange, chooseFirstImageField);
}
