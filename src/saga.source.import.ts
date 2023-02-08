import { ImportExport, prompt, toast } from '@gdi/web-ui';
import { delay, put, select, takeEvery } from 'saga-ts';
import { invokeEvent, isEmpty, log, logStart, logEnd } from 'shared-base';
import { all } from './data/allEntityFields';
import { existsInCurrentItems } from './utils/entityFields';

type ActionImportData = {
    type: 'IMPORT_DATA_FROM_FILE';
    payload: Json;
};

function* importData(action: ActionImportData) {
    const { payload } = action;

    const { value, didCancel } = yield prompt.custom({
        title: 'Import from file',
        component: ImportExport,
        componentProps: {
            id: 'ModalImportData',
            json: payload,
            ctaButtonText: 'Import',
            groups,
            options,
        },
    });

    if (didCancel || isEmpty(value)) {
        return;
    }

    yield delay(100);

    invokeEvent('toggleAdhocModal', {
        show: true,
    });

    log('Starting import');

    for (let key of Object.keys(value)) {
        const nodeValue = value[key];
        const nodeDefinition = all[key];

        const ids = Object.keys(nodeValue);

        logStart(`Importing ${key}`, 'importing ' + ids.length + ' items...');

        const currentItems = yield* select(nodeDefinition.selector);

        for (let id of ids) {
            const item = nodeValue[id];
            const action = all[key].actionCreator;

            const exists = existsInCurrentItems(
                item,
                Object.values(currentItems),
                nodeDefinition.equality
            );

            if (!exists) {
                yield put(action(item));
            }
        }

        yield delay(100);

        logEnd(`Importing ${key}`, 'success', 'success');
    }

    yield delay(1000);

    // invokeEvent('toggleAdhocModal', {
    //     show: false,
    // });

    toast.show('Data imported successfully');
}

export function* root() {
    yield delay(300);
    yield takeEvery('IMPORT_DATA_FROM_FILE', importData);
}

const groups = [
    {
        id: 'crm',
        title: 'CRM',
    },
    {
        id: 'tasks',
        title: 'Tasks',
    },
    {
        id: 'sales',
        title: 'Sales',
    },
];

const options: IOption[] = [
    {
        id: 'contacts',
        text: 'Contacts',
        groupId: 'crm',
    },
    {
        id: 'projects',
        text: 'Projects',
        groupId: 'tasks',
    },
    {
        id: 'tasks',
        text: 'Tasks',
        groupId: 'tasks',
    },
    {
        id: 'leads',
        text: 'Leads',
        groupId: 'sales',
    },
];
