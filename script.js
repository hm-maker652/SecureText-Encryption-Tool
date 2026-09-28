const inputText = document.getElementById("inputText");
const algorithm = document.getElementById("algorithm");
const keySection = document.getElementById("keySection");
const key = document.getElementById("key");
const keyLabel = document.getElementById("keyLabel");
const keyHint = document.getElementById("keyHint");
const result = document.getElementById("result");
const status = document.getElementById("status");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const hashBtn = document.getElementById("hashBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");


// STATUS FUNCTIONS

function showError(message) {
    status.textContent = message;
    status.className = "error";
}

function showSuccess(message) {
    status.textContent = message;
    status.className = "success";
}

function showInfo(message) {
    status.textContent = message;
    status.className = "info";
}

function clearStatus() {
    status.textContent = "";
    status.className = "";
}


// BUTTON SELECTION

function selectButton(selectedButton) {
    encryptBtn.classList.remove("selected");
    decryptBtn.classList.remove("selected");
    hashBtn.classList.remove("selected");
    copyBtn.classList.remove("selected");
    clearBtn.classList.remove("selected");

    selectedButton.classList.add("selected");
}


// KEY FIELD

algorithm.addEventListener("change", function () {

    const selected = algorithm.value;

    key.value = "";
    clearStatus();

   if (selected === "") {
    keySection.style.display = "none";
    return;
}

if (selected === "base64") {
    keySection.style.display = "none";
    return;
}

keySection.style.display = "block";


    if (selected === "caesar") {

        keyLabel.textContent = "Shift";
        key.placeholder = "Example: 3";
        keyHint.textContent = "Enter a number such as 3 or 5.";
    }


    else if (selected === "vigenere") {

        keyLabel.textContent = "Key";
        key.placeholder = "Example: SECRET";
        keyHint.textContent = "Use letters only, for example SECRET.";
    }


    else if (selected === "vernam") {

        keyLabel.textContent = "Key";
        key.placeholder = "Same length as text";
        keyHint.textContent =
            "Use letters only. The key must have the same number of letters as the plaintext.";
    }


    else if (selected === "railfence") {

        keyLabel.textContent = "Number of Rails";
        key.placeholder = "Example: 3";
        keyHint.textContent =
            "Enter the number of rails, for example 3.";
    }




    else if (selected === "aes") {

        keyLabel.textContent = "AES Password";
        key.placeholder = "Enter password";
        keyHint.textContent = "Enter a password for AES encryption.";
    }
});


// CAESAR

function caesarEncrypt(text, shift) {

    shift = shift % 26;

    let output = "";

    for (let i = 0; i < text.length; i++) {

        let char = text[i];
        let code = text.charCodeAt(i);

        if (code >= 65 && code <= 90) {

            let newCode =
                ((code - 65 + shift + 26) % 26) + 65;

            output += String.fromCharCode(newCode);
        }

        else if (code >= 97 && code <= 122) {

            let newCode =
                ((code - 97 + shift + 26) % 26) + 97;

            output += String.fromCharCode(newCode);
        }

        else {

            output += char;
        }
    }

    return output;
}


function caesarDecrypt(text, shift) {

    return caesarEncrypt(text, -shift);
}


// VIGENERE

function vigenereEncrypt(text, secretKey) {

    secretKey = secretKey.toUpperCase();

    let output = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {

        let char = text[i];
        let code = text.charCodeAt(i);

        if (
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122)
        ) {

            let shift =
                secretKey.charCodeAt(keyIndex % secretKey.length) - 65;

            if (code >= 65 && code <= 90) {

                let newCode =
                    ((code - 65 + shift) % 26) + 65;

                output += String.fromCharCode(newCode);
            }

            else {

                let newCode =
                    ((code - 97 + shift) % 26) + 97;

                output += String.fromCharCode(newCode);
            }

            keyIndex++;
        }

        else {

            output += char;
        }
    }

    return output;
}


function vigenereDecrypt(text, secretKey) {

    secretKey = secretKey.toUpperCase();

    let output = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {

        let char = text[i];
        let code = text.charCodeAt(i);

        if (
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122)
        ) {

            let shift =
                secretKey.charCodeAt(keyIndex % secretKey.length) - 65;

            if (code >= 65 && code <= 90) {

                let newCode =
                    ((code - 65 - shift + 26) % 26) + 65;

                output += String.fromCharCode(newCode);
            }

            else {

                let newCode =
                    ((code - 97 - shift + 26) % 26) + 97;

                output += String.fromCharCode(newCode);
            }

            keyIndex++;
        }

        else {

            output += char;
        }
    }

    return output;
}


// VERNAM CIPHER

function vernamEncrypt(text, secretKey) {

    text = text.toUpperCase();
    secretKey = secretKey.toUpperCase();

    let output = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {

        let char = text[i];

        // Keep spaces unchanged
        if (char === " ") {

            output += " ";
            keyIndex++;
            continue;
        }

        let plainNumber = text.charCodeAt(i) - 65;
        let keyNumber = secretKey.charCodeAt(keyIndex) - 65;

        let cipherNumber =
            (plainNumber + keyNumber) % 26;

        output += String.fromCharCode(cipherNumber + 65);

        keyIndex++;
    }

    return output;
}


function vernamDecrypt(text, secretKey) {

    text = text.toUpperCase();
    secretKey = secretKey.toUpperCase();

    let output = "";
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {

        let char = text[i];

        // Keep spaces unchanged
        if (char === " ") {

            output += " ";
            keyIndex++;
            continue;
        }

        let cipherNumber = text.charCodeAt(i) - 65;
        let keyNumber = secretKey.charCodeAt(keyIndex) - 65;

        let plainNumber =
            (cipherNumber - keyNumber + 26) % 26;

        output += String.fromCharCode(plainNumber + 65);

        keyIndex++;
    }

    return output;
}


// RAIL FENCE

function railFenceEncrypt(text, rails) {

    if (rails <= 1) return text;

    let fence = [];

    for (let i = 0; i < rails; i++) {

        fence.push([]);
    }

    let rail = 0;
    let direction = 1;

    for (let char of text) {

        fence[rail].push(char);

        if (rail === 0) {

            direction = 1;
        }

        else if (rail === rails - 1) {

            direction = -1;
        }

        rail += direction;
    }

    return fence.flat().join("");
}


function railFenceDecrypt(cipherText, rails) {

    if (rails <= 1) return cipherText;

    let pattern = [];

    let rail = 0;
    let direction = 1;

    for (let i = 0; i < cipherText.length; i++) {

        pattern.push(rail);

        if (rail === 0) {

            direction = 1;
        }

        else if (rail === rails - 1) {

            direction = -1;
        }

        rail += direction;
    }

    let counts =
        new Array(rails).fill(0);

    for (let r of pattern) {

        counts[r]++;
    }

    let railsArray = [];

    let position = 0;

    for (let i = 0; i < rails; i++) {

        railsArray[i] =
            cipherText.slice(
                position,
                position + counts[i]
            );

        position += counts[i];
    }

    let indexes =
        new Array(rails).fill(0);

    let output = "";

    for (let r of pattern) {

        output +=
            railsArray[r][indexes[r]];

        indexes[r]++;
    }

    return output;
}


// BASE64

function base64Encrypt(text) {

    return btoa(
        unescape(
            encodeURIComponent(text)
        )
    );
}


function base64Decrypt(text) {

    try {

        return decodeURIComponent(
            escape(
                atob(text)
            )
        );

    }

    catch (error) {

        throw new Error(
            "Invalid Base64 text."
        );
    }
}


// AES

function aesEncrypt(text, password) {

    return CryptoJS.AES
        .encrypt(text, password)
        .toString();
}


function aesDecrypt(cipherText, password) {

    try {

        const decrypted =
            CryptoJS.AES.decrypt(
                cipherText,
                password
            );

        const originalText =
            decrypted.toString(
                CryptoJS.enc.Utf8
            );

        if (!originalText) {

            throw new Error(
                "Wrong AES password or invalid encrypted text."
            );
        }

        return originalText;
    }

    catch (error) {

        throw new Error(
            "Unable to decrypt. Check the AES password and encrypted text."
        );
    }
}


// VALIDATION

function validateInput(isDecrypt = false) {

    const text = inputText.value.trim();

    const selected =
        algorithm.value;

    const secretKey =
        key.value.trim();


    if (text === "") {

        showError(
            "Error: Please enter some text."
        );

        return false;
    }


    if (selected === "") {

        showError(
            "Error: Please select an encryption method."
        );

        return false;
    }


    // Base64 does not need a key
    if (
        selected !== "base64" &&
        secretKey === ""
    ) {

        showError(
            "Error: Please enter a key."
        );

        return false;
    }


    // Caesar and Rail Fence
    if (
        selected === "caesar" ||
        selected === "railfence"
    ) {

        if (isNaN(Number(secretKey))) {

            showError(
                "Error: Please enter a valid number."
            );

            return false;
        }


        if (Number(secretKey) <= 0) {

            showError(
                "Error: The number must be greater than 0."
            );

            return false;
        }
    }


    // Vigenere
    if (selected === "vigenere") {

        if (!/^[a-zA-Z]+$/.test(secretKey)) {

            showError(
                "Error: Vigenère key must contain letters only."
            );

            return false;
        }
    }


    // Vernam
    if (selected === "vernam") {

        const lettersOnlyText =
            text.replace(/ /g, "");

        const lettersOnlyKey =
            secretKey.replace(/ /g, "");


        if (!/^[a-zA-Z ]+$/.test(text)) {

            showError(
                "Error: Vernam plaintext must contain letters and spaces only."
            );

            return false;
        }


        if (!/^[a-zA-Z ]+$/.test(secretKey)) {

            showError(
                "Error: Vernam key must contain letters and spaces only."
            );

            return false;
        }


        if (
            lettersOnlyText.length !==
            lettersOnlyKey.length
        ) {

            showError(
                "Error: Vernam key must have the same number of letters as the plaintext."
            );

            return false;
        }
    }


    return true;
}


// ENCRYPT

encryptBtn.addEventListener("click", function () {

    selectButton(encryptBtn);

    clearStatus();


    const selected =
        algorithm.value;


    if (!validateInput(false)) {

        return;
    }


    const text =
        inputText.value;

    const secretKey =
        key.value;


    try {

        let encrypted;


        if (selected === "caesar") {

            encrypted =
                caesarEncrypt(
                    text,
                    Number(secretKey)
                );
        }


        else if (selected === "vigenere") {

            encrypted =
                vigenereEncrypt(
                    text,
                    secretKey
                );
        }


        else if (selected === "vernam") {

            encrypted =
                vernamEncrypt(
                    text,
                    secretKey
                );
        }


        else if (selected === "railfence") {

            encrypted =
                railFenceEncrypt(
                    text,
                    Number(secretKey)
                );
        }


        else if (selected === "base64") {

            encrypted =
                base64Encrypt(text);
        }


        else if (selected === "aes") {

            encrypted =
                aesEncrypt(
                    text,
                    secretKey
                );
        }


        result.value =
            encrypted;


        showSuccess(
            "Text encrypted successfully."
        );
    }


    catch (error) {

        showError(
            "Error: " + error.message
        );
    }
});


// DECRYPT

decryptBtn.addEventListener("click", function () {

    selectButton(decryptBtn);

    clearStatus();


    if (!validateInput(true)) {

        return;
    }


    const text =
        inputText.value;

    const selected =
        algorithm.value;

    const secretKey =
        key.value;


    try {

        let decrypted;


        if (selected === "caesar") {

            decrypted =
                caesarDecrypt(
                    text,
                    Number(secretKey)
                );
        }


        else if (selected === "vigenere") {

            decrypted =
                vigenereDecrypt(
                    text,
                    secretKey
                );
        }


        else if (selected === "vernam") {

            decrypted =
                vernamDecrypt(
                    text,
                    secretKey
                );
        }


        else if (selected === "railfence") {

            decrypted =
                railFenceDecrypt(
                    text,
                    Number(secretKey)
                );
        }


        else if (selected === "base64") {

            decrypted =
                base64Decrypt(text);
        }


        else if (selected === "aes") {

            decrypted =
                aesDecrypt(
                    text,
                    secretKey
                );
        }


        result.value =
            decrypted;


        showSuccess(
            "Text decrypted successfully."
        );
    }


    catch (error) {

        showError(
            "Error: " + error.message
        );
    }
});


// SHA-256

hashBtn.addEventListener("click", function () {

    selectButton(hashBtn);

    clearStatus();


    const text =
        inputText.value;


    if (text.trim() === "") {

        showError(
            "Error: Please enter text to hash."
        );

        return;
    }


    const hash =
        CryptoJS.SHA256(text)
            .toString(
                CryptoJS.enc.Hex
            );


    result.value =
        hash;


    showSuccess(
        "SHA-256 hash generated successfully."
    );
});


// COPY

copyBtn.addEventListener("click", function () {

    selectButton(copyBtn);

    clearStatus();


    if (result.value.trim() === "") {

        showError(
            "Error: There is no result to copy."
        );

        return;
    }


    navigator.clipboard
        .writeText(result.value)

        .then(function () {

            showSuccess(
                "Result copied to clipboard."
            );
        })

        .catch(function () {

            showError(
                "Error: Could not copy the result."
            );
        });
});


// CLEAR

clearBtn.addEventListener("click", function () {

    selectButton(clearBtn);


    inputText.value = "";

    result.value = "";

    key.value = "";

    algorithm.value = "";

    keySection.style.display = "none";

    clearStatus();
});
