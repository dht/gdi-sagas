import { delay, takeEvery } from 'saga-ts';
import { tasks as store } from '@gdi/selectors';

type PieAction = {
    type: string;
    item: IPerson;
    itemId: string;
};

function* pieNewTicket(action: PieAction) {
    console.log('pieNewTicket action ->', action);
}

export function* root() {
    yield delay(300);
    yield takeEvery('ITEM_ACTION_PERSON_NEWTICKET', pieNewTicket);
}
