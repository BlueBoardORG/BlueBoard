const colors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#ecf0f1",
    "#95a5a6",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#bdc3c7",
    "#7f8c8d",
    "#e84118",
    "#273c75",
    "#40739e",
    "#44bd32",
    "#9c88ff",
    "#78e08f",
];

const amountOfLettersInHebrew = 26;

function getLastCharInString(str) {
    return str.charAt(str.length - 1);
}

function getLetterNumber(letter) {
    const positionOfFirstLetterInUnicode = 1488;
    const letterNumber = letter.charCodeAt(0) - positionOfFirstLetterInUnicode;
    
    if (letterNumber < 0 || letterNumber > amountOfLettersInHebrew) return 0;
    return letterNumber;
}

function getColorFromNumber(number) {
    return colors[number] || colors[0];
}

export function getColorFromString(str) {
    if (typeof str !== "string") str = "";
    
    const splittedNames = str.split(' ');
    let colorNumber = amountOfLettersInHebrew;

    if (splittedNames.length >= 2) {
        const firstLetter = getLastCharInString(splittedNames[0]);
        const secondLetter = getLastCharInString(splittedNames[1]);
        const firstNumber = getLetterNumber(firstLetter);
        const secondNumber = getLetterNumber(secondLetter);
        colorNumber = Math.round(((firstNumber + secondNumber) / 2) - 1)
    }

    return getColorFromNumber(colorNumber);
}

