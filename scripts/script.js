// dynamic heading
const dynamicText = document.getElementById("dynamic-heading");
const words = ["Web Developer.", "Programmer.", "Web Designer."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);

    dynamicText.textContent = currentChar;

    if (!isDeleting && charIndex < currentWord.length) {
        
        charIndex++;
        setTimeout(typeEffect, 50);
    } else if (isDeleting && charIndex > 0) {
        
        charIndex--;
        setTimeout(typeEffect, 50);
    } else {
        
        isDeleting = !isDeleting;
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
        setTimeout(typeEffect, 1200);
    }
};

typeEffect();




