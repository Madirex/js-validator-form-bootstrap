/**
 * Comprueba que la fecha sea superior al día de hoy o que sea el día de hoy
 * @param {*} date fecha
 * @returns ¿Fecha superior al día de hoy?
 */
function isValidDateAfterTodayOrToday(date) {
    const currentDate = new Date();
    const checkDate = new Date(date);

    if (isNaN(checkDate.getTime())) {
        return false;
    }

    currentDate.setHours(0, 0, 0, 0);
    return checkDate >= currentDate;
}

/**
 * Comprueba que el formato sea del formato tipo fecha de España válido
 * formato: (dd/mm/aaaa)
 * Primero comprueba que el patrón sea el adecuado. Después se extrae el día, el mes y el año y se comprueba que sean válidos
 * @param {*} date fecha 
 * @returns ¿fecha española válida?
 */
function isValidSpainDateFormat(date) {
    if (!date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return false;
    }
    let [day, month, year] = date.split('/').map(Number);
    let isValidDate = (year > 0 && month > 0 && month <= 12 && day > 0 && day <= new Date(year, month, 0).getDate());
    return isValidDate;
}

/**
 * Validación de correo válido y que no sea superior a 100 caracteres
 * @param {*} email email
 * @returns ¿Correo válido?
 */
function isValidMail(email) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (regex.test(email)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Validación de Instagram válida
 * Debe de comenzar con un @
 * No puede contener caracteres especiales que no sean números puntos o guiones bajos (ya que sería una cuenta inválida)
 * El nombre sin @ Debe de contener al menos un caracter
 * @param {*} instagram instagram
 * @returns ¿Correo válido?
 */
function isValidInstagram(instagram) {
    if (instagram.charAt(0) != '@') {
        return false;
    }
    let instagramWithoutStartSign = instagram.substring(1);
    let formatWithoutSpecialChars = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/;
    if (instagramWithoutStartSign == ''){
        return false;
    }
    return !formatWithoutSpecialChars.test(instagramWithoutStartSign);
}

/**
 * Comprueba si el origen es válido
 * solo si la casilla de cliente está seleccionada
 * @returns ¿válido?
 */
function validateCurrentOrigin(element){
    if (!document.getElementById("client").checked){
        element.disabled = true;
        return true;
    }
    element.disabled = false;

    return selectIsNotSelectedNone(element);
}

/**
 * Valida el campo País
 * @param {*} fieldId ID del país
 * @returns ¿válido?
 */
function isValidCountry(fieldId){
    if(document.getElementById("foreigner").checked){
        document.getElementById("country").disabled = false;
        document.getElementById("countryContainer").style.display = 'block';
    }else{
        document.getElementById("country").disabled = true;
        document.getElementById("countryContainer").style.display = 'none';
    }
    return !getIdsByRadioButtonGroupContainer(fieldId).every(function (option) { return !document.getElementById(option).checked;});
}