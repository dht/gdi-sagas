import { delay, takeEvery } from 'saga-ts';
import { leads as store } from '@gdi/selectors';

type PieAction = {
    type: string;
    item: IPerson;
    itemId: string;
};

function* pieNewLead(action: PieAction) {
    console.log('pieNewLead action ->', action);
}

function* pieNewLeadAction(action: PieAction) {
    console.log('pieNewLeadAction action ->', action);
}

export function* root() {
    yield delay(300);
    yield takeEvery('ITEM_ACTION_PERSON_NEWSALE', pieNewLead);
    yield takeEvery('ITEM_ACTION_PERSON_NEWSALEACTION', pieNewLeadAction);
}
