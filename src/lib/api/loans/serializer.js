import { fromISO } from '@api/date';
import _isEmpty from 'lodash/isEmpty';

function serializeResponse(hit) {
  let result = {};
  if (!_isEmpty(hit)) {
    result['id'] = hit.id;
    result['created'] = fromISO(hit.created);
    result['updated'] = fromISO(hit.updated);
    result['availableActions'] = hit.links ? hit.links.actions : {};

    if (hit.links) {
      result['links'] = hit.links;
    }
    if (!_isEmpty(hit.metadata)) {
      result['metadata'] = hit.metadata;
      result['pid'] = hit.metadata.pid;
      result['metadata']['request_start_date'] = fromISO(
        hit.metadata.request_start_date
      );
      result['metadata']['request_expire_date'] = fromISO(
        hit.metadata.request_expire_date
      );
      result['metadata']['start_date'] = fromISO(hit.metadata.start_date);
      result['metadata']['end_date'] = fromISO(hit.metadata.end_date);
      result['metadata']['transaction_date'] = fromISO(
        hit.metadata.transaction_date
      );
    }
  }

  return result;
}

export const serializer = {
  fromJSON: serializeResponse,
};
