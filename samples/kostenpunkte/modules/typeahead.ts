type ContentSupplier<T> = () => T[];
type ContentFilter<T> = (element: T, searchtext: string) => boolean;
type OptionSupplier<T> = (element: T) => { value: string, label: string };
type TypeAheadConfig<T> = {
    inputComponent: HTMLInputElement,
    contentSupplier: ContentSupplier<T>,
    contentFilter: ContentFilter<T>,
    optionSupplier: OptionSupplier<T>
}

function getOrCreateDataList(inputComponent: HTMLInputElement): HTMLDataListElement {
    // datalist exists?
    if (inputComponent.list) {
        return inputComponent.list;
    } else {
        const result = document.createElement('datalist');
        inputComponent.parentNode?.appendChild(result);
        if (!inputComponent.id) throw "component id is missing";
        result.id = `${inputComponent.id}:datalist`; // TODO: if id empty -> generate!
        inputComponent.setAttribute('list', result.id);
        return result;
    }
}

function fillDataList<T>(
    datalist: HTMLDataListElement,
    contents: T[],
    optionSupplier: OptionSupplier<T>) {
    datalist.innerHTML =
        contents
            .map(content => {
                const option = optionSupplier(content);
                return `<option value="${option.value}">${option.label}</option>`
            })
            .join('');
}

let lastValue: string; // TODO: multiple typeaheads

function handleTypeAhead<T>(config: TypeAheadConfig<T>, datalist: HTMLDataListElement): void {
    const searchtext = config.inputComponent.value;
    if (lastValue !== searchtext) {
        lastValue = searchtext;
        // filter
        const options = config.contentSupplier()
            .filter(content => config.contentFilter(content, searchtext))
        fillDataList(datalist, options, config.optionSupplier);
    }
}

type TypeAheadHandle = { refresh: () => void };
function initializeTypeAhead<T>(config: TypeAheadConfig<T>): TypeAheadHandle {
    const datalist = getOrCreateDataList(config.inputComponent);
    config.inputComponent.addEventListener('change', () => handleTypeAhead(config, datalist));
    config.inputComponent.addEventListener('keyup', () => handleTypeAhead(config, datalist));
    fillDataList(datalist, config.contentSupplier(), config.optionSupplier);
    return {
        refresh: () => handleTypeAhead(config, datalist)
    }
}

export {
    initializeTypeAhead,
    TypeAheadConfig,
    TypeAheadHandle,
    ContentSupplier,
    ContentFilter,
    OptionSupplier
}
