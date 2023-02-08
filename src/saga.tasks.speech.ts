import { delay, fork, put, select, takeEvery } from 'saga-ts';
// import { getAxiosInstance } from 'axios-oauth';
import { tasks as store } from '@gdi/selectors';

function* speech(action: any) {
    try {
        // const axiosInstance = getAxiosInstance();
        const tickets = yield* select(store.selectors.raw.$rawTickets);
        const { ticketId } = action.payload;
        const ticket = tickets[ticketId];
        const { summary } = ticket;

        const match = summary.match(/session *$/);

        if (!match) {
            return;
        }

        const text = `Starting a ${summary}`.replace(/\//g, '');
        // axiosInstance.get(`/speech/say/${text}`);
    } catch (err: any) {
        console.log('speech err ->', err);
    }
}

export function* root() {
    yield takeEvery('BLKR_SESSION_START', speech);
}
