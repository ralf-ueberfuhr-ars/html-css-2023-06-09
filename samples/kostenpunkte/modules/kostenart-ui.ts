import { Kostenart, KostenartService } from "./kostenart-domain.js";
import { ContentFilter, ContentSupplier, OptionSupplier, TypeAheadHandle, initializeTypeAhead } from "./typeahead.js";

const DEFAULT_DESCRIPTION = '(keine Beschreibung vorhanden)';

const contentFilter: ContentFilter<Kostenart> = (content, searchtext) => {
  const regex = new RegExp(searchtext, 'i');
  return regex.test(content.name) || regex.test(content.description || '');
};
const optionSupplier: OptionSupplier<Kostenart> = (content) => {
  return {
    value: content.name,
    label: `${content.name} - ${content.description ?? DEFAULT_DESCRIPTION}`
  }
};

function initializeKostenartTypeAhead(service: KostenartService, inputComponent: HTMLInputElement): TypeAheadHandle {
  const result = initializeTypeAhead<Kostenart>({
    inputComponent,
    contentSupplier: () => service.kostenarten,
    contentFilter,
    optionSupplier
  });
  service.onKostenartenChanged(data => result.refresh());
  return result;
}

export {
  initializeKostenartTypeAhead
}