async function loadPexelsImages(query) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = 'Loading...';
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=9`, {
            headers: { 'Authorization': 'GpWrvSZTHQrxJxl1wnNRDtaYOKXrkhdzsz8TUA1g8nJcKtimtr4QNnrh' }
        });
        if (!response.ok) throw new Error('Failed to fetch images from Pexels');
        const data = await response.json();
        gallery.innerHTML = '';
        if (!data.photos.length) {
            gallery.innerHTML = '<p>No images found.</p>';
            return;
        }
        data.photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.src.medium;
            img.alt = photo.alt;
            img.style.width = '300px';
            img.style.height = '200px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.margin = '5px';
            img.addEventListener('click', () => window.open(photo.url, '_blank'));
            img.addEventListener('error', () => {
                img.src = 'https://via.placeholder.com/300x200?text=Image+not+available';
            });
            gallery.appendChild(img);
        });
    } catch (error) {
        gallery.innerHTML = '<p>Error loading images. Please try again later.</p>';
        console.error(error);
    }
}

// Handle search form submission
document.getElementById('pexelsSearchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('pexelsQuery').value.trim();
    if (query) loadPexelsImages(query);
});

// Load default images on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPexelsImages('private jet');
});