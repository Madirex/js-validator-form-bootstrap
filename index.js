/**
 * Abre el Modal con los datos al darle al botón Submit
 */
$('#modalForm').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

/**
 * Evento submit que valida el formulario
 */
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    validateForm();
});

/**
 * Valida un campo
 * @param {*} fieldId Id del campo 
 * @param {*} errorId Id del error
 * @param {*} errorCondition Condición de error
 * @returns ¿Validado?
 */
function validateField(fieldId, errorId, errorCondition) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);

    if (field.disabled) {
        errorCondition = false;
    }

    if (errorCondition) {
        error.style.display = "block";
        field.classList.add("error-input");
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
        return false;
    } else {
        error.style.display = "none";
        field.classList.remove("error-input");
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
        return true;
    }
}

/**
 * Función que se ejecuta al cambiar el input
 * @param {*} fieldId Id del campo
 * @param {*} errorId Id del error
 */
function inputOnChange(fieldId, errorId) {
    if (document.getElementById(errorId).style.display != 'none') {
        validateFieldByType(fieldId, errorId);
    }
}

/**
 * Abre el Modal de Bootstrap con los campos rellenados del formulario en el caso de que el formulario sea válido
 * @param {*} isValid ¿Formulario válido?
 * @param {*} formData Datos del formulario en formato String
 */
function openModalWithFormData(isValid, formData) {
    let modalMessage = '';
    if (isValid) {
        modalMessage = '<p>Formulario válido. ¡Enviado con éxito!</p><p>' + formData + '</p>';
    } else {
        modalMessage = 'Datos inválidos. Por favor, corrige los errores.';
    }
    document.getElementById('modal-message').innerHTML = modalMessage;
    $('#modalForm').modal('show'); // Abre el modal
}

/**
 * Obtiene todos los ID de un grupo de Radio Button y los retorna
 * @param {*} containerId ID del contenedor del grupo de radio buttons
 * @returns Todos los ID de los Radio Button del grupo
 */
function getIdsByRadioButtonGroupContainer(containerId) {
    let container = document.getElementById(containerId);
    let formCheckElements = container.querySelectorAll('.form-check');
    let ids = [];
    formCheckElements.forEach(function (formCheck) {
        let inputInsideFormCheck = formCheck.querySelector('input');
        if (inputInsideFormCheck) {
            ids.push(inputInsideFormCheck.id);
        }
    });
    return ids;
}

/**
 * Parsea un String de fecha en formato española (dd/mm/aaaa) a Date
 * @param {*} date fecha en formato (dd/mm/aaaa)
 * @returns Date
 */
function parseSpainDateStrToDate(date) {
    let [day, month, year] = date.split('/').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Comprueba si el elemento select tiene seleccionado el valor none
 * @param {*} element elemento
 * @returns ¿none seleccionado?
 */
function selectIsNotSelectedNone(element) {
    return element.options[element.selectedIndex].value !== "none";
}

/**
 * Sistema de validación
 * @param {*} fieldId Id del campo a validar
 * @param {*} errorId Id del campo de error
 * @returns validación
 */
function validateFieldByType(fieldId, errorId) {
    const element = document.getElementById(fieldId);
    switch (fieldId) {
        // validación de campos
        case 'sendDate':
            return validateField(fieldId, errorId, !isValidDateAfterTodayOrToday(parseSpainDateStrToDate(element.value)) || !isValidSpainDateFormat(element.value));
        case 'company':
            return validateField(fieldId, errorId, element.value.length < 2 || element.value.length > 100);
        case 'email':
            return validateField(fieldId, errorId, !isValidMail(element.value));
        case 'country':
            return validateField(fieldId, errorId, element.value.length < 2 || element.value.length > 50);
        case 'instagram':
            return validateField(fieldId, errorId, !isValidInstagram(element.value));
        case 'currentOrigin':
            return validateField(fieldId, errorId, !validateCurrentOrigin(element));
        case 'sendType':
            return validateField(fieldId, errorId, !isValidCountry(fieldId));
        default:
            return true;
    }
}

/**
 * Se encarga de validar el formulario y hacer saltar el modal de respuesta tras el envío
 * @returns ¿formulario válido?
 */
function validateForm() {
    const fields = [
        'company',
        'email',
        'country',
        'instagram',
        'sendDate',
        'currentOrigin',
        'sendType'
    ];

    let isValid = true;
    let formData = "<h2>Datos:</h2>";

    fields.forEach(fieldId => {
        isValid = validateFieldByType(fieldId, `error-${fieldId}`) && isValid;
        if (isValid) {
            switch (fieldId) {
                case 'sendType':
                    formData = "<p>" + formData + 'Tipo de envío: ';
                    if (document.getElementById('national').checked) {
                        formData = formData + 'Nacional' + "</p>";
                    } else {
                        formData = formData + 'Extranjero' + "</p>";
                    }
                    break;
                case 'country':
                    if (!document.getElementById('national').checked){
                        formData = "<p>" + formData  + "</p><p>" + "País" + ': ' + document.getElementById(fieldId).value + "</p>";
                    }
                    break;
                case 'currentOrigin':
                    if (document.getElementById('client').checked){
                        formData = "<p>" + formData  + "</p><p>" + "Origen" + ': ' + document.getElementById(fieldId).value + "</p>";
                    }
                    break;
                case 'sendDate':
                    formData = "<p>" + formData  + "</p><p>" + "Fecha de envío" + ': ' + document.getElementById(fieldId).value + "</p>";
                    break;
                case 'company':
                    formData = "<p>" + formData  + "</p><p>" + "Compañía" + ': ' + document.getElementById(fieldId).value + "</p>";
                    break;
                default:
                    formData = "<p>" + formData  + "</p><p>" + fieldId + ': ' + document.getElementById(fieldId).value + "</p>";
            }
        }
    });

    let totalShipmentsValue = document.getElementById('totalShipments').value;
    let totalWeightValue = document.getElementById('totalWeight').value;
    let totalAmountSpainValue = document.getElementById('totalAmountSpain').value;
    let totalAmountEuropeValue = document.getElementById('totalAmountEurope').value;
    let totalAmountAmericaValue = document.getElementById('totalAmountAmerica').value;
    let totalAmountValue = document.getElementById('totalAmount').value;

    if (!totalShipmentsValue == '' && totalShipmentsValue != 0){
        formData = formData + "<h2>Totales de envío</h2>";
        formData += "<p>Total envíos: " + totalShipmentsValue + "</p>";
        formData += "<p>Total Peso: " + totalWeightValue + "</p>";
        formData += "<p>Total Importe España: " + totalAmountSpainValue + "</p>";
        formData += "<p>Total Importe Europa: " + totalAmountEuropeValue + "</p>";
        formData += "<p>Total Importe América: " + totalAmountAmericaValue + "</p>";
        formData += "<p>Importe Total: " + totalAmountValue + "</p>";
    }
   
    openModalWithFormData(isValid, formData);
    return isValid;
}

/**
 * Listener que cambia el valor del input de date al iniciar la página a la fecha actual
 */
document.addEventListener('DOMContentLoaded', function() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var formattedDate = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + year;
    var sendDateInput = document.getElementById('sendDate');
    sendDateInput.value = formattedDate;
});

function calculatePrice() {
    const destination = document.getElementById('destination').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const shippingType = document.getElementById('shippingType').value;

    let price = 0;

    if (weight <= 1) {
        price = destination === 'spain' ? 6 : (destination === 'europe' ? 9 : 12);
    } else if (weight <= 2) {
        price = destination === 'spain' ? 8 : (destination === 'europe' ? 12 : 16);
    } else if (weight <= 3) {
        price = destination === 'spain' ? 10 : (destination === 'europe' ? 16 : 20);
    }else{
        price = "-";
    }

    document.getElementById('price').value = price.toFixed(2);
}

/**
 * Agrega elemento a la lista
 * @returns nada
 */
function addToSendList() {
    const destination = document.getElementById('destination').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const shippingType = document.getElementById('shippingType').value;
    const price = parseFloat(document.getElementById('price').value);

    if (!destination || isNaN(weight) || shippingType === '-' || isNaN(price)) {
        alert('Completa todos los campos antes de añadir a la lista.');
        return;
    }

    if (weight > 3){
        alert('No puede haber un peso mayor a 3.');
        return;
    }

    const table = document.getElementById('send-table');
    const newRow = table.insertRow(table.rows.length);
   

    const cell1 = newRow.insertCell(0);
    cell1.dataset.label = 'Destino';
    cell1.textContent = destination;
    if (destination == 'spain'){
        cell1.textContent = "España";
    } else if (destination == 'europe'){
        cell1.textContent = "Europa";
    } else if (destination == 'america'){
        cell1.textContent = "América";
    }

    const cell2 = newRow.insertCell(1);
    cell2.textContent = weight.toFixed(2) + ' Kg';
    cell2.dataset.label = 'Peso';

    const cell3 = newRow.insertCell(2);
    cell3.textContent = shippingType;
    cell3.dataset.label = 'Tipo de Envío';

    const cell4 = newRow.insertCell(3);
    cell4.textContent = price.toFixed(2) + ' €';
    cell4.dataset.label = 'Precio';

    const cell5 = newRow.insertCell(4);
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = function () {
        const rowIndex = newRow.rowIndex - 1;
        table.deleteRow(rowIndex);
        calculateTotals();
    };
    cell5.appendChild(deleteButton);

    calculatePrice();
    calculateTotals();
}

/**
 * Calcula los totales de la lista
 */
function calculateTotals() {
    const table = document.getElementById('send-table');
    const totalShipments = table.rows.length;
    document.getElementById('totalShipments').value = totalShipments;

    let totalWeight = 0;
    let totalAmountSpain = 0;
    let totalAmountEurope = 0;
    let totalAmountAmerica = 0;

    for (let i = 0; i < totalShipments; i++) {
        const row = table.rows[i];
        let weight = parseFloat(row.cells[1].textContent.replace(" Kg", ""));
        let price = parseFloat(row.cells[3].textContent.replace(" €", ""));
        totalWeight += weight;
        const destination = row.cells[0].textContent;
        if (destination === 'España') {
            totalAmountSpain += price;
        } else if (destination === 'Europa') {
            totalAmountEurope += price;
        } else if (destination === 'América') {
            totalAmountAmerica += price;
        }
    }

    document.getElementById('totalWeight').value = totalWeight.toFixed(2) + " Kg";
    document.getElementById('totalAmountSpain').value = totalAmountSpain.toFixed(2) + " €";
    document.getElementById('totalAmountEurope').value = totalAmountEurope.toFixed(2) + " €";
    document.getElementById('totalAmountAmerica').value = totalAmountAmerica.toFixed(2) + " €";

    const totalAmount = totalAmountSpain + totalAmountEurope + totalAmountAmerica;
    document.getElementById('totalAmount').value = totalAmount.toFixed(2) + " €";
}