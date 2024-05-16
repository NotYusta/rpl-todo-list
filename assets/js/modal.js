function setDisplayAttr(modalId, value) {
    const element = document.getElementById(modalId);
    if(!element) return;

    element.style.display = value;
}

function openModal(modalId) {
   setDisplayAttr(modalId, "block");
}

function closeModal(modalId) {
    setDisplayAttr(modalId, "none");
 }
 