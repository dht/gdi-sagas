import ping from './saga.mixer.ping';
import { fork, take } from 'saga-ts';
import { root as apiPublic } from './saga.mixer.api.public';
import { root as apiPrivate } from './saga.mixer.api.private';
import { root as bootstrap } from './saga.mixer.bootstrap';
import { root as elements } from './saga.mixer.elements';
import { root as contentImages } from './saga.mixer.content.images';
import { root as demo } from './saga.mixer.demo';
import { root as gallery } from './saga.mixer.gallery';
import { root as importSite } from './saga.mixer.import';
import { root as innerNav } from './saga.mixer.innerNav';
import { root as exportPage } from './saga.mixer.export.page';
import { root as exportSite } from './saga.mixer.export';
import { root as pages } from './saga.mixer.pages';
import { root as pagesPromote } from './saga.mixer.pages.promote';
import { root as pagesBalance } from './saga.mixer.pages.balance';
import { root as mixer } from './saga.mixer.mixer';
import { root as mobileMode } from './saga.mixer.mobileMode';
import { root as toLive } from './saga.mixer.toLive';
import { root as toDraft } from './saga.mixer.toDraft';
import { PlatformLifeCycleEvents } from '@gdi/types';

function* root() {
    yield* fork(apiPublic);
    yield take(PlatformLifeCycleEvents.AUTHENTICATION_COMPLETED);
    yield* fork(apiPrivate);
    yield* fork(bootstrap);
    yield* fork(elements);
    yield* fork(gallery);
    yield* fork(demo);
    yield* fork(importSite);
    yield* fork(innerNav);
    yield* fork(exportPage);
    yield* fork(exportSite);
    yield* fork(contentImages);
    yield* fork(mixer);
    yield* fork(mobileMode);
    yield* fork(pages);
    yield* fork(pagesPromote);
    yield* fork(pagesBalance);
    yield* fork(toLive);
    yield* fork(toDraft);
    yield* fork(ping);
}

export const appSagas = [root];
