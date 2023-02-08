import { api, call, put, select, fork, takeEvery } from 'saga-ts';
import { deltaInSeconds, ts } from '@gdi/language';
import { tasks as store } from '@gdi/selectors';

type LifecycleAction = {
    type: string;
    activeTask: IActiveTask;
    payload: Json;
};

const HTTP_OK = 200;
const HTTP_CREATED = 201;

export function* newSession(action: LifecycleAction) {
    const { ticketId } = action.payload;
    const tickets = yield* select(store.selectors.raw.$rawTickets);

    yield call(closeRunningSession);

    let response;

    const ticket = tickets[ticketId];

    if (!ticket) {
        console.log(`could not find ticket ${ticketId} in store`);
        return;
    }

    response = yield* api(
        store.actions.sessions.add({
            ticketKey: ticket.key,
            estimation: '',
            startTimestamp: ts(),
            breakStartTimestamp: 0,
            breakTimeTotal: 0,
            lastVerb: 'start',
            lastVerbTimestamp: ts(),
        })
    );

    if (response.status !== HTTP_CREATED) {
        console.log(
            `API: could not create session for ${ticket.key}`,
            response
        );
        return;
    }

    response = yield* api(
        store.actions.currentIdsTasks.patch({
            sessionId: response.data.id,
        })
    );

    if (response.status !== HTTP_OK) {
        console.log(`API: could not patch appStateTasks`, response);
        return;
    }
}

export function* pauseSession(action: LifecycleAction) {
    const { activeTask } = action;

    if (!activeTask || !activeTask.session) {
        console.log('No running session');
        return;
    }

    const { session } = activeTask;

    let response;

    response = yield* api(
        store.actions.sessions.patch(session.id, {
            breakStartTimestamp: ts(),
            lastVerb: 'pause',
            lastVerbTimestamp: ts(),
        })
    );

    if (response.status !== HTTP_OK) {
        console.log(`API: could not pause session ${session.id}`);
        return;
    }
}

export function* resumeSession(action: LifecycleAction) {
    const { activeTask } = action;

    if (!activeTask || !activeTask.session) {
        console.log('No running session');
        return;
    }

    const { session } = activeTask;
    const { breakTimeTotal: previousBreakTimeTotal, breakStartTimestamp } =
        session;

    const delta = deltaInSeconds(breakStartTimestamp);
    const breakTimeTotal = previousBreakTimeTotal + delta;

    let response;

    response = yield* api(
        store.actions.sessions.patch(session.id, {
            breakStartTimestamp: 0,
            breakTimeTotal,
            lastVerb: 'resume',
            lastVerbTimestamp: ts(),
        })
    );

    if (response.status !== HTTP_OK) {
        console.log(`API: could not pause session ${session.id}`);
        return;
    }
}

export function* cancelSession(action: LifecycleAction) {
    const { activeTask } = action;

    if (!activeTask || !activeTask.session) {
        console.log('No running session');
        return;
    }

    const { session } = activeTask;

    let response;

    response = yield* api(store.actions.sessions.delete(session.id));

    if (response.status !== HTTP_OK) {
        console.log(`API: could not cancel session ${session.id}`);
        return;
    }

    response = yield* api(
        store.actions.currentIdsTasks.patch({
            sessionId: '',
        })
    );

    if (response.status !== HTTP_OK) {
        console.log('API: could not clear currentSessionId');
        return;
    }
}

export function* pauseOrResume(action: LifecycleAction) {
    const { activeTask } = action;

    if (!activeTask || !activeTask.session || !activeTask.stats) {
        console.log('No running session');
        return;
    }

    const { stats } = activeTask;

    if (stats.isInBreak) {
        yield* fork(resumeSession, action);
    } else {
        yield* fork(pauseSession, action);
    }
}

export function* completeSession(action: LifecycleAction) {
    console.log('completeSession activeTask ->', action.activeTask);

    let { activeTask, payload = {} } = action;

    if (!activeTask || !activeTask.session) {
        console.log('No running session');
        return;
    }

    const { ticket, session, stats } = activeTask;
    const { key: ticketKey } = ticket;
    const { startTimestamp } = session;
    const { isDone } = payload;

    if (stats.isInBreak) {
        yield put({ type: 'BLKR_SESSION_PAUSE_OR_RESUME' });
    }

    let response;

    response = yield* api(
        store.actions.sessions.patch(session.id, {
            lastVerb: 'done',
            lastVerbTimestamp: ts(),
            endTimestamp: ts(),
        })
    );

    if (response.status !== HTTP_OK) {
        console.log(`API: could not end session ${session.id}`);
        return;
    }

    response = yield* api(
        store.actions.recentSessions.add({
            ticketKey,
            startTimestamp,
            endTimestamp: ts(),
            verb: 'done',
        })
    );

    if (response.status !== HTTP_CREATED) {
        console.log(
            `API: could not add recentSession for session ${session.id}`
        );
        return;
    }

    // bring active task again after calculations were made
    activeTask = yield* select(store.selectors.base.$activeTask);

    if (!activeTask || !activeTask.stats) {
        console.log('could not find active task in redux store');
        return;
    }

    const { startTimestamp: started, duration } = activeTask.stats;
    const { comment = '', author = '' } = payload;

    response = yield* api(
        store.actions.worklogs.add({
            started: new Date(started).toString(),
            timeSpent: duration.totalText,
            timeSpentSeconds: duration.totalSeconds,
            comment,
            author,
            ticketKey,
        })
    );

    if (response.status !== HTTP_CREATED) {
        console.log(`API: could not add worklog for session ${session.id}`);
        return;
    }

    response = yield* api(
        store.actions.currentIdsTasks.patch({
            sessionId: '',
        })
    );

    if (response.status !== HTTP_OK) {
        console.log('API: could not clear currentSessionId');
        return;
    }

    if (!isDone) {
        return;
    }

    response = yield* api(
        store.actions.tickets.patch(ticket.id, {
            status: 'Done',
        })
    );

    if (response.status !== HTTP_OK) {
        console.log(`API: could not set ticket as done for ${ticket.key}`);
        return;
    }
}

export function* closeRunningSession() {
    const activeTask = yield* select(store.selectors.base.$activeTask);

    const { session, stats } = activeTask;

    // no running session
    if (!session) {
        return;
    }

    yield put({
        type: 'BLKR_SESSION_COMPLETE',
        activeTask,
    });
}

export function* jiraSync() {
    yield* put(
        store.actions.appStateTasks.patch({
            lastSyncTimestamp: ts(),
        })
    );
}

export function* tasksApiRoot() {
    const promises = [
        yield* put(store.actions.appStateTasks.get()),
        yield* put(store.actions.projects.get({})),
        yield* put(store.actions.tickets.get({})),
        yield* put(store.actions.sessions.get({})),
        yield* put(store.actions.worklogs.get({})),
        yield* put(store.actions.recentSessions.get({})),
    ];

    yield Promise.all(promises);
}

export function* root() {
    yield takeEvery('BLKR_API_ROOT', tasksApiRoot);
    yield takeEvery('BLKR_SESSION_START', newSession);
    yield takeEvery('BLKR_SESSION_PAUSE_OR_RESUME', pauseOrResume);
    yield takeEvery('BLKR_SESSION_CANCEL', cancelSession);
    yield takeEvery('BLKR_SESSION_COMPLETE', completeSession);
    yield takeEvery('BLKR_JIRA_SYNC', jiraSync);
}
