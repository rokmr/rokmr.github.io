function openPdfViewer(pdfPath) {
    const modal = document.getElementById('pdf-modal');
    const iframe = document.getElementById('pdf-iframe');
    
    iframe.src = pdfPath;
    modal.style.display = 'block';
    modal.classList.add('fade-in');
    
    document.body.style.overflow = 'hidden';
}

function closePdfViewer() {
    const modal = document.getElementById('pdf-modal');
    const iframe = document.getElementById('pdf-iframe');
    
    modal.classList.add('fade-out');
    
    setTimeout(() => {
        modal.style.display = 'none';
        iframe.src = '';
        modal.classList.remove('fade-out');
        modal.classList.remove('fade-in');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal when clicking outside
document.getElementById('pdf-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePdfViewer();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('pdf-modal').style.display === 'block') {
        closePdfViewer();
    }
});