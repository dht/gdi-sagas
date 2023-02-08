import { delay, takeEvery } from 'saga-ts';
import { deals as store } from '@gdi/selectors';

type PieAction = {
    type: string;
    item: IPerson;
    itemId: string;
};

function* pieNewDeal(action: PieAction) {
    console.log('pieNewDeal action ->', action);
}

function* pieNewDealAction(action: PieAction) {
    console.log('pieNewDealAction action ->', action);
}

export function* root() {
    yield delay(300);
    yield takeEvery('ITEM_ACTION_PERSON_NEWSALE', pieNewDeal);
    yield takeEvery('ITEM_ACTION_PERSON_NEWSALEACTION', pieNewDealAction);
}
