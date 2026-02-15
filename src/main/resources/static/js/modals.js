let closeListenerAttached = false;

export function showModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');

    if (!closeListenerAttached) {
        const closeModalButton = document.getElementById('modal-close');
        closeModalButton.addEventListener('click', () => {
            hideModal();
        });
        closeListenerAttached = true;
    }
}

export function hideModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

export function setModalContent(html) {
    document.getElementById('modal-content').innerHTML = html;
}

export function getModalContent() {
    return document.getElementById('modal-content');
}
