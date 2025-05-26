const fetch = require('node-fetch');

exports.handler = async (event) => {
  const query = event.queryStringParameters?.query || 'luxury jet';
  
  try {
    const response = await fetch(`https://api.core.openaip.net/api/media/search?query=${encodeURIComponent(query)}&size=large`, {
      headers: {
        'x-openaip-api-key': b9c9b596a4689fe039d69455d484e178, 
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    
    // Filter for highest quality images
    const bestImages = data.results
      ?.filter(img => img.width >= 1920 && img.height >= 1080)
      ?.sort((a, b) => (b.width * b.height) - (a.width * a.height)) || [];

    return {
      statusCode: 200,
      body: JSON.stringify(bestImages.slice(0, 3)), // Return top 3
      headers: {
        'Cache-Control': 'public, max-age=86400', // 24 hour cache
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Fancy image service unavailable" }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    };
  }
};