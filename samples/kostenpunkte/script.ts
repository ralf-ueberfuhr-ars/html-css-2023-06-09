import { ContentFilter, OptionSupplier, TypeAheadHandle, initializeTypeAhead } from "./modules/typeahead.js";

type Kostenart = {
    id: number,
    name: string,
    description?: string
};

type Kostenpunkt = {
    id: number,
    date: Date,
    value: number,
    type: Kostenart,
    comment?: string

};

const kostenarten: Kostenart[] = []
const kostenpunkte: Kostenpunkt[] = [];

// TODO: Vom Server laden
// const kostenarten = [];
const defaultDescription = '(keine Beschreibung vorhanden)';
const inputComponent: HTMLInputElement = document.querySelector('#kostenart')!;

let typeAhead: TypeAheadHandle;

const optionSupplier: OptionSupplier<Kostenart> = (content) => {
    return {
        value: content.name,
        label: `${content.name} - ${content.description ?? defaultDescription}`
    }
};

const contentFilter: ContentFilter<Kostenart> = (content, searchtext) => {
    const regex = new RegExp(searchtext, 'i');
    return regex.test(content.name) || regex.test(content.description || '');
};

fetch(inputComponent.dataset.src!)
    .then(body => body.json())
    .catch(err => {
        console.error(err);
        const cachedValue = localStorage.getItem(`${inputComponent.id}:data`);
        if (cachedValue) {
            return JSON.parse(cachedValue);
        } else {
            throw err;
        }
    })
    .then((loadedKostenarten: Kostenart[]) => {
        kostenarten.push(...loadedKostenarten);
        localStorage.setItem(`${inputComponent.id}:data`, JSON.stringify(kostenarten));
        return kostenarten;
    })
    .then(kostenarten => typeAhead = initializeTypeAhead<Kostenart>({
        inputComponent,
        contentSupplier: () => kostenarten,
        contentFilter,
        optionSupplier
    }));

/*
 * Kostenpunkte
 */
const form: HTMLFormElement = document.querySelector('form')!;
const inputDatum: HTMLInputElement = form.querySelector('input[name=datum]')!;
const inputBetrag: HTMLInputElement = form.querySelector('input[name=betrag]')!;
const inputKostenart: HTMLInputElement = form.querySelector('input[name=kostenart]')!;
const inputKommentar: HTMLInputElement = form.querySelector('input[name=kommentar]')!;
const tableBody = document.querySelector('#kostenpunktContent')!;

let kostenpunktId = 0;

function createKostenart(name: string): Kostenart {
    // find next kostenart id
    const nextId = Math.max(...kostenarten.map(ka => ka.id)) + 1;
    console.warn('create kostenart is not implemented yet')
    // TODO neue ID generieren, kostenart ins Array fügen, refresh() auf Typeahead (ta hat Rückgabewert...)
    const result: Kostenart = {
        id: nextId,
        name
    };
    kostenarten.push(result);
    typeAhead?.refresh();
    return result;
}

function deleteKostenpunkt(this: HTMLElement) {
    const id = Number.parseInt(this.dataset.kostenpunkt!);
    const newKostenpunkte = kostenpunkte.filter(kp => kp.id !== id);
    kostenpunkte.length = 0;
    kostenpunkte.push(...newKostenpunkte);
    // delete <tr>
    let nodeToDelete = this.parentNode;
    while (nodeToDelete && nodeToDelete.nodeName.toLowerCase() !== 'tr') {
        nodeToDelete = nodeToDelete.parentNode;
    }
    if (nodeToDelete) {
        nodeToDelete.parentNode?.removeChild(nodeToDelete);
    }
}

const currencyFormat = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
})

function addKostenpunkt(evt: Event): boolean {
    evt.preventDefault();
    const kostenart = kostenarten
        .find(ka => ka.name === inputKostenart.value)
        ?? createKostenart(inputKostenart.value)

    const kostenpunkt: Kostenpunkt = {
        id: kostenpunktId,
        date: new Date(Date.parse(inputDatum.value)),
        value: Number.parseFloat(inputBetrag.value),
        type: kostenart,
        comment: inputKommentar.value
    }
    kostenpunkte.push(kostenpunkt);
    tableBody.innerHTML = tableBody.innerHTML + `
        <tr>
            <td>${kostenpunkt.date?.toLocaleDateString('de')}</td>
            <td>${kostenpunkt.type?.name}</td>
            <td class="betrag">${currencyFormat.format(kostenpunkt.value)}</td>
            <td><button data-kostenpunkt="${kostenpunkt.id}" title="Löschen">❌</button></td>
        </tr>
    `;
    document.querySelector(`[data-kostenpunkt="${kostenpunkt.id}"]`)
        ?.addEventListener('click', deleteKostenpunkt);
    kostenpunktId++;
    form.reset();
    return false;
}

form.addEventListener('submit', addKostenpunkt);
