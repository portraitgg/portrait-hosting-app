import { formatDistanceToNowStrict } from 'date-fns';
import { store } from '../../../helpers/store.mjs';

export const getLastUpdateItem = () => ({
  label: store.get('lastUpdateTimestamp')
    ? `Last update ${formatDistanceToNowStrict(store.get('lastUpdateTimestamp') as Date, { addSuffix: true })}`
    : 'No updates yet',
  enabled: false,
});
