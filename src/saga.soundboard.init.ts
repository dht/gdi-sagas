import { delay, put, fork } from 'saga-ts';
import { XDate } from '@gdi/language';
import { soundboard as store } from '@gdi/selectors';

export function* init() {
    const now = new XDate();
    const nowInfo = now.toInfo();

    if (!nowInfo) {
        return;
    }
    const year = nowInfo.year;
    const week = nowInfo.week;

    const start = now.add(-2, 'week');
    const startInfo = start.toInfo();

    if (!startInfo) {
        return;
    }

    const startYear = startInfo.year;
    const startWeek = startInfo.week;

    yield put(
        store.actions.appStateSoundboard.patch({
            startYear,
            startWeek,
            year,
            week,
        })
    );
}

export function* root() {
    yield delay(50);
    yield* fork(init);
}

export default root;
