import { KostenartService } from "./modules/kostenart-domain.js";
import { initializeKostenartTypeAhead } from "./modules/kostenart-ui.js";
import { Kostenpunkt, KostenpunktService } from "./modules/kostenpunkt-domain.js";
import { initializeKostenpunktTable } from "./modules/kostenpunkt-ui.js";
import { TypeAheadHandle } from "./modules/typeahead.js";

/*
 * Kostenarten
 */
// domain
const kostenartService = new KostenartService();
// ui
const inputComponent: HTMLInputElement = document.querySelector('#kostenart')!;
let typeAhead: TypeAheadHandle;

kostenartService.initialisiereDaten(inputComponent.dataset.src!)
    .then(() => initializeKostenartTypeAhead(kostenartService, inputComponent))
    .then(result => typeAhead = result);

/*
 * Kostenpunkte
 */
// domain
const kostenpunktService = new KostenpunktService();
// ui
const form: HTMLFormElement = document.querySelector('form')!;
const inputDatum: HTMLInputElement = form.querySelector('input[name=datum]')!;
const inputBetrag: HTMLInputElement = form.querySelector('input[name=betrag]')!;
const inputKostenart: HTMLInputElement = form.querySelector('input[name=kostenart]')!;
const inputKommentar: HTMLInputElement = form.querySelector('input[name=kommentar]')!;
const tableBody: HTMLTableSectionElement = document.querySelector('#kostenpunktContent')!;
function readKostenpunktFromForm() {
    const kostenart = kostenartService.kostenarten
        .find(ka => ka.name === inputKostenart.value)
        ?? kostenartService.erzeugeKostenart(inputKostenart.value)
    return {
        date: new Date(Date.parse(inputDatum.value)),
        value: Number.parseFloat(inputBetrag.value),
        type: kostenart,
        comment: inputKommentar.value
    } as Kostenpunkt;
}

const kostenpunktTable = initializeKostenpunktTable({
    tableBody,
    onRemove: id => kostenpunktService.remove(id)
});

function addKostenpunkt(evt: Event): boolean {
    evt.preventDefault();
    const kostenpunkt = readKostenpunktFromForm();
    kostenpunktService.add(kostenpunkt);
    kostenpunktTable.add(kostenpunkt);
    form.reset();
    return false;
}

form.addEventListener('submit', addKostenpunkt);
