import { Kostenpunkt } from "./kostenpunkt-domain"

type KostenpunktTableHandle = {
  add: (kostenpunkt: Kostenpunkt) => void;
};

const currencyFormat = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
})

function initializeKostenpunktTable(options: {
  tableBody: HTMLTableSectionElement,
  onRemove: (id: number) => boolean
}): KostenpunktTableHandle {
  const tableBody = options.tableBody;
  return {
    add: (kostenpunkt) => {
      const id = kostenpunkt.id || 0;
      const tableRow = document.createElement('tr');
      tableRow.setAttribute('data-kostenpunkt', id.toString());
      tableBody.appendChild(tableRow);
      tableRow.innerHTML = `
            <td>${kostenpunkt.date?.toLocaleDateString('de')}</td>
            <td>${kostenpunkt.type?.name}</td>
            <td class="betrag">${currencyFormat.format(kostenpunkt.value)}</td>
            <td><button class="delete-btn" title="Löschen">❌</button></td>
      `;
      tableRow
        .querySelector(`.delete-btn`)
        ?.addEventListener('click', () => {
          if (options.onRemove(id)) {
            tableRow.parentNode?.removeChild(tableRow);
          }
        });
    }
  }
}

export {
  KostenpunktTableHandle,
  initializeKostenpunktTable
}