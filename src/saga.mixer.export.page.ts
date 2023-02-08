import { delay, select, takeEvery } from 'saga-ts';
import { downloadJson } from 'shared-base';
import { dateFilename } from '@gdi/language';
import { toast } from '@gdi/web-ui';
import { mixer as store } from '@gdi/selectors';

function* exportPage(_action: any) {
    const siteData = yield* select(store.selectors.base.$pageData);
    const filename = dateFilename('pageData.json');
    downloadJson(filename, siteData);

    toast.show(`Page data generated as ${filename}`);
}

export function* root() {
    yield delay(300);
    yield takeEvery('EXPORT_PAGE', exportPage);
}
