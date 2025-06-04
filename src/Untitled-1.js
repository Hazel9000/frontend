// ...existing code...

async function loadPexelsImages(query = 'luxury jet') {
    try {
        // Adjust the URL below to match your deployment/serverless function path
        const response = await fetch(`/functions/openaip.pexelsImgSrcHandler?query=${encodeURIComponent(query)}`);
        const imgSrcs = await response.json();

        // Example: Insert images into a container with id="pexelsImages"
        const container = document.getElementById('pexelsImages');
        container.innerHTML = ''; // Clear previous images

        imgSrcs.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = query;
            img.style.width = '300px';
            img.style.margin = '10px';
            container.appendChild(img);
        });
    } catch (error) {
        console.error('Failed to load Pexels images:', error);
    }
}
/*
Note: Directly scraping or fetching images from pexels.com via client-side JavaScript is not allowed due to CORS restrictions and their API usage policy. 
You must use the official Pexels API via a backend/serverless function, as shown in your existing code.
If you want to change the query or add more features, you can modify the function call or add UI elements.

Example: Add a simple search box to change the query dynamically.
*/

const searchForm = document.createElement('form');
searchForm.innerHTML = `
    <input type="text" id="pexelsQuery" placeholder="Search Pexels images..." />
    <button type="submit">Search</button>
`;
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('pexelsQuery').value.trim();
    if (query) {
        loadPexelsImages(query);
    }
});
document.body.insertBefore(searchForm, document.getElementById('pexelsImages'));
// Call this function where appropriate, e.g. after DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadPexelsImages('private jet'); // or any query you want
});
// Ensure you have a container in your HTML to display the images
const pexelsContainer = document.createElement('div');

pexelsContainer.id = 'pexelsImages';
pexelsContainer.style.display = 'flex';
pexelsContainer.style.flexWrap = 'wrap';
document.body.appendChild(pexelsContainer);
// Call the function to load initial images
loadPexelsImages('private jet'); // Initial query to load images
// Ensure you have a container in your HTML to display the images
const pexelsContainer = document.createElement('div');
pexelsContainer.id = 'pexelsImages';
pexelsContainer.style.display = 'flex';
pexelsContainer.style.flexWrap = 'wrap';
document.body.appendChild(pexelsContainer);
// Call the function to load initial images
loadPexelsImages('private jet'); // Initial query to load images

// Ensure you have a container in your HTML to display the images
const pexelsContainer = document.createElement('div');  
pexelsContainer.id = 'pexelsImages';
pexelsContainer.style.display = 'flex';
pexelsContainer.style.flexWrap = 'wrap';
document.body.appendChild(pexelsContainer);
// Call the function to load initial images
loadPexelsImages('private jet'); // Initial query to load images

// Ensure you have a container in your HTML to display the images



