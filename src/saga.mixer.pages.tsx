import { call, put, select, takeEvery } from 'saga-ts';
import { prompt, Versioning } from '@gdi/web-ui';
import { guid4 } from 'shared-base';
import {
    parseMixerRequestToActions,
    parseDeleteInstructionsToActions,
} from './instructions/mixerInstructions';
import { extractTree } from './instructions/extractTree';
import { mixer as store, site } from '@gdi/selectors';

function* editPage() {
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
}

type DuplicatePageAction = {
    type: 'DUPLICATE_PAGE';
    title: string;
    itemId: string;
};

function* getState() {
    const state = yield* select((s) => ({
        ...s.mixer,
        ...s.site,
    }));

    return state;
}

function* duplicatePage(action: DuplicatePageAction) {
    const { title, itemId } = action;
    const state = yield* call(getState);

    const actionsArr = parseMixerRequestToActions(
        {
            destination: 'library',
            source: 'library',
            entityType: 'pages',
            itemId,
        },
        state,
        true
    );

    actionsArr[0].payload.title = title;

    for (const action of actionsArr) {
        yield* put(action);
    }
}

function* duplicatePageInstance() {
    const pageInstance = yield* select(store.selectors.base.$pageInstance);
    const nextInstanceVersion = yield* select(store.selectors.base.$nextInstanceVersion); // prettier-ignore

    if (!pageInstance) {
        return;
    }

    const state = yield* call(getState);

    const actionsArr = parseMixerRequestToActions(
        {
            destination: 'library',
            source: 'library',
            entityType: 'pageInstances',
            itemId: pageInstance.id,
        },
        state,
        true
    );

    actionsArr[0].payload.version = nextInstanceVersion;
    actionsArr[0].payload.pageId = pageInstance.pageId;

    const id = actionsArr[0].payload.id;

    for (const action of actionsArr) {
        yield* put(action);
    }

    yield put(store.actions.currentIds.patch({ pageInstanceId: id }));
}

function* resetPageInstance() {
    const pageInstance = yield* select(store.selectors.base.$pageInstance);

    if (!pageInstance) {
        return;
    }

    const { id } = pageInstance;

    const state = yield* call(getState);

    const tree = extractTree(
        {
            source: 'library',
            destination: 'library',
            itemId: id,
            entityType: 'pageInstances',
        },
        state
    );

    delete tree['pageInstances'];

    const actionsArr = parseDeleteInstructionsToActions('library', tree);

    for (const action of actionsArr) {
        yield* put(action);
    }
}

function* deletePageInstance() {
    const pageInstance = yield* select(store.selectors.base.$pageInstance);

    if (!pageInstance) {
        return;
    }

    const { id } = pageInstance;

    const state = yield* call(getState);

    const tree = extractTree(
        {
            source: 'library',
            destination: 'library',
            itemId: id,
            entityType: 'pageInstances',
        },
        state
    );

    const actionsArr = parseDeleteInstructionsToActions('library', tree);

    for (const action of actionsArr) {
        yield* put(action);
    }

    yield put(store.actions.currentIds.patch({ pageInstanceId: '' }));
}

function* selectPageInstanceOnNavigation() {
    const currentIds = yield* select(store.selectors.raw.$rawCurrentIds);
    const pageInstanceId = yield* select(store.selectors.base.$pageInstanceId);
    const pageInstances = yield* select(
        store.selectors.raw.$rawLibraryPageInstances
    );

    const { pageId } = currentIds;

    let pageInstance: IPageInstance | undefined;

    pageInstance = pageInstances[pageInstanceId ?? ''];

    if (pageInstance && pageInstance.pageId === pageId) {
        return;
    }

    pageInstance = Object.values(pageInstances).find(
        (i) => i.pageId === pageId
    );

    if (pageInstance) {
        yield put(
            store.actions.currentIds.patch({ pageInstanceId: pageInstance.id })
        );
    }
}

type ChangePageStatusAction = {
    type: 'CHANGE_PAGE_STATUS';
    pageId: string;
};

function* changePageStatus(action: ChangePageStatusAction) {
    const { pageId } = action;

    const libraryPages = yield* select(store.selectors.raw.$rawLibraryPages);
    const page = libraryPages[pageId];

    if (!pageId || !page) {
        return;
    }

    const pageStatuses = yield* select(store.selectors.options.$pageStatus);

    const { didCancel, value } = yield prompt.choice({
        title: page.title + ' Status',
        options: pageStatuses,
        submitButtonText: 'Set status',
        defaultValue: page.status,
    });

    if (didCancel || !value) {
        return;
    }

    yield put(
        store.actions.libraryPages.patch(pageId, {
            status: value,
        })
    );
}

type DeletePageAction = {
    type: 'DELETE_LIBRARYPAG';
    id: string;
};

function* deletePage(action: DeletePageAction) {
    const { id } = action;

    const state = yield* call(getState);

    const tree = extractTree(
        {
            source: 'library',
            destination: 'library',
            itemId: id,
            entityType: 'pages',
        },
        state
    );

    delete tree['pages'];

    const actionsArr = parseDeleteInstructionsToActions('library', tree);

    for (const action of actionsArr) {
        yield* put(action);
    }
}

export function* root() {
    yield takeEvery('EDIT_PAGE', editPage);
    yield takeEvery('DUPLICATE_PAGE', duplicatePage);
    yield takeEvery('DUPLICATE_PAGE_INSTANCE', duplicatePageInstance);
    yield takeEvery('RESET_PAGE_INSTANCE', resetPageInstance);
    yield takeEvery('DELETE_PAGE_INSTANCE', deletePageInstance);
    yield takeEvery('SELECT_PAGE_INSTANCE_ON_NAVIGATION', selectPageInstanceOnNavigation); // prettier-ignore
    yield takeEvery('CHANGE_PAGE_STATUS', changePageStatus);
    yield takeEvery((action: any) => {
        return action.type === 'DELETE_LIBRARYPAG';
    }, deletePage);
}
