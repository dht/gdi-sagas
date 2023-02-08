import { call, put, select, takeEvery } from 'saga-ts';
import { prompt } from '@gdi/web-ui';
import { guid4 } from 'shared-base';
import { mixer as store } from '@gdi/selectors';

type ActionAddElement = {
    type: 'ADD_ELEMENT';
    placeholderType?: string;
};

function* addElement(action: ActionAddElement) {
    let { placeholderType } = action;
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
    const pageId = currentIds.pageId;
    const order = yield* select(store.selectors.base.$nextElementOrder);
    const options = yield* select(store.selectors.options.$instanceTypes);

    if (!placeholderType) {
        const { didCancel, value } = yield prompt.select({
            title: 'New instance',
            label: 'Select a type',
            options,
            placeholder: 'Element type',
            submitButtonText: 'Create',
        });

        if (didCancel) {
            return;
        }

        placeholderType = value;
    }

    const id = `${pageId}-${placeholderType}-${guid4()}`;

    yield put(
        store.actions.libraryInstances.add({
            id,
            pageId,
            isPlaceholder: true,
            placeholderType,
            order,
        })
    );

    yield put(
        store.actions.currentIds.patch({
            selectedInstanceId: id,
        })
    );
}

type ActionDeleteElement = {
    type: 'DELETE_ELEMENT';
    id: string;
};

function* deleteElement(action: ActionDeleteElement) {
    const { didCancel } = yield* call(prompt.confirm, {
        title: 'Delete instance',
        description: 'Are you sure you want to delete this instance?',
        submitButtonText: "I'm sure",
    });

    if (didCancel) {
        return;
    }

    yield put(store.actions.libraryInstances.delete(action.id));
}

type ActionShowContentModal = {
    type: 'ELEMENT_CONTENT';
    id: string;
};

function* showContentModal(action: ActionShowContentModal) {
    const { id } = action;
    const element = yield* select(store.selectors.base.$instanceSelected);

    if (element?.isPlaceholder) {
        return;
    }

    yield* put(store.actions.currentIds.patch({ contentInstanceId: id }));
}

export function* root() {
    yield takeEvery('ELEMENT_ADD', addElement);
    yield takeEvery('ELEMENT_DELETE', deleteElement);
    yield takeEvery('ELEMENT_CONTENT', showContentModal);
}
