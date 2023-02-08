import { call, takeEvery } from 'saga-ts';
import {
    authChangeChannel,
    authChangeChannelDemo,
} from './channels/channel.authChange';
import { fork, put } from 'redux-saga/effects';
import { PlatformLifeCycleEvents } from '@gdi/types';
import { $s, invokeEvent, setBoolean } from 'shared-base';
import { toast } from '@gdi/web-ui';
import { getDemoConfig } from '@gdi/platformer';
import { auth as store } from '@gdi/selectors';

const REQUESTED_PATH_KEY = 'REQUESTED_PATH';

export function* onLogin(user: any) {
    yield put(
        store.actions.authState.patch({
            isLoggedIn: true,
        })
    );

    yield put({ type: PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED, user });
    invokeEvent(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED, {});
    setBoolean('AUTHENTICATION_COMPLETED', true);

    const { uid, displayName, email, emailVerified, phoneNumber, photoURL } =
        user;

    yield put(
        store.actions.me.patch({
            uid,
            displayName,
            email,
            emailVerified,
            phoneNumber,
            photoURL,
        })
    );

    toast.show(`Logged in as ${displayName}`);

    yield put(
        store.actions.users.patch(uid, {
            id: uid,
            uid,
            displayName,
            email,
            emailVerified,
            phoneNumber,
            photoURL,
        })
    );

    const to = localStorage.getItem(REQUESTED_PATH_KEY) ?? '/';

    yield* call(navigate, to);
}

function* authChange({ user }: any) {
    $s('authChange', { user });

    if (!user) {
        yield put(
            store.actions.authState.patch({
                isLoggedIn: false,
            })
        );

        yield call(navigateToLogin);

        return;
    }

    yield fork(onLogin, user);
}

function* saveCurrentPath() {
    const { pathname } = document.location;
    localStorage.setItem(REQUESTED_PATH_KEY, pathname);
}

function* navigateToLogin() {
    yield call(saveCurrentPath);
    yield put({ type: 'NAVIGATE', path: '/login' });
}

function* navigate(to: string) {
    yield put({ type: 'NAVIGATE', path: to });
}

export function* root() {
    const { on } = getDemoConfig();
    yield call(saveCurrentPath);
    const channel = on ? authChangeChannelDemo() : authChangeChannel();
    yield takeEvery(channel, authChange);
}
