import { prompt, toast } from '@gdi/web-ui';
import { call, delay, put, select, takeEvery, takeLatest } from 'saga-ts';
import { docs as store } from '@gdi/selectors';

type ActionSaveDoc = {
    type: 'SAVE_DOC';
    docId: string;
    content: string;
    noDebounce?: boolean;
};

function* saveDoc(action: ActionSaveDoc) {
    const { docId, content, noDebounce } = action;

    if (noDebounce) {
        yield delay(500);
    }

    yield* put(
        store.actions.docs.patch(docId, {
            content,
        })
    );
}

function* newDoc() {
    const { value, didCancel } = yield* call(prompt.input, {
        title: 'Title',
        description: '',
        placeholder: "Doc's title",
        submitButtonText: 'Start',
    });

    if (didCancel || !value) {
        return;
    }

    yield* put(
        store.actions.docs.add({
            title: value as string,
            content: '',
            docType: 'markdown',
            tags: [],
            dataTags: [],
        })
    );

    toast.show('New document created titled ' + value);
}

type ActionGeneralDoc = {
    type: 'DELETE_DOC' | 'RENAME_DOC';
    docId: string;
};

function* renameDoc(action: ActionGeneralDoc) {
    const { docId } = action;

    const docs = yield* select(store.selectors.raw.$rawDocs);
    const doc = docs[docId];

    const { title = '' } = doc ?? {};

    const { value, didCancel: didCancel1 } = yield* call(prompt.input, {
        title: 'Change Title',
        description: '',
        placeholder: "Doc's title",
        submitButtonText: 'Start',
        defaultValue: title,
    });

    if (didCancel1 || !value) {
        return;
    }

    yield* put(
        store.actions.docs.patch(docId, {
            title: value as string,
        })
    );
}

function* removeDoc(action: ActionGeneralDoc) {
    const { docId } = action;

    const { didCancel } = yield* call(prompt.confirm, {
        title: 'Delete document',
        description: 'Are you sure you want to delete this document?',
        submitButtonText: "I'm sure",
    });

    if (didCancel) {
        return;
    }

    yield* put(store.actions.docs.delete(docId));
}

export function* root() {
    yield delay(300);
    yield takeEvery('$NEW_DOC', newDoc);
    yield takeLatest('$SAVE_DOC', saveDoc);
    yield takeEvery('$RENAME_DOC', renameDoc);
    yield takeEvery('$DELETE_DOC', removeDoc);
}
