/* OpenAIP Autonomous Image Enhancer */
(() => {
  // CONFIGURATION (Only edit these values)
  const SETTINGS = {
    API_KEY: 'b9c9b596a4689fe039d69455d484e178',
    IMAGE_TARGETS: {
      hero: {
        selector: '.hero',
        query: 'luxury private jet sunset',
        fallback: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b'
      },
      fleet: [
        { 
          selector: '.fleet-slide:nth-child(1) img', 
          query: 'Gulfstream G650 exterior',
          fallback: 'https://example.com/g650.jpg' 
        },
        { 
          selector: '.fleet-slide:nth-child(2) img',
          query: 'Bombardier Global 7500 exterior',
          fallback: 'https://example.com/global7500.jpg'
        },
        { 
          selector: '.fleet-slide:nth-child(3) img',
          query: 'Cessna Citation X exterior',
          fallback: 'https://example.com/citationx.jpg'
        }
      ]
    }
  };

  // Image Enhancement Engine
  const enhanceImages = async () => {
    const fetchOpenAIPImage = async (query) => {
      try {
        const res = await fetch(
          `https://api.core.openaip.net/api/media/search?query=${encodeURIComponent(query)}&size=large&apiKey=${SETTINGS.API_KEY}`
        );
        const data = await res.json();
        return data.results?.[0]?.url;
      } catch {
        return null;
      }
    };

    // Enhance Hero Background
    if (SETTINGS.IMAGE_TARGETS.hero) {
      const hero = document.querySelector(SETTINGS.IMAGE_TARGETS.hero.selector);
      if (hero) {
        const originalBg = window.getComputedStyle(hero).backgroundImage;
        const newUrl = await fetchOpenAIPImage(SETTINGS.IMAGE_TARGETS.hero.query);
        if (newUrl) {
          hero.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${newUrl})`;
          // Fallback system
          new Image().src = newUrl;
          new Image().onerror = () => {
            hero.style.backgroundImage = originalBg;
          };
        }
      }
    }

    // Enhance Fleet Images
    if (SETTINGS.IMAGE_TARGETS.fleet) {
      SETTINGS.IMAGE_TARGETS.fleet.forEach(async (target) => {
        const img = document.querySelector(target.selector);
        if (img) {
          const originalSrc = img.src;
          const newUrl = await fetchOpenAIPImage(target.query);
          if (newUrl) {
            img.src = newUrl;
            img.onerror = () => { img.src = originalSrc || target.fallback };
          }
        }
      });
    }
  };

  // Run when page fully loads
  if (document.readyState === 'complete') {
    setTimeout(enhanceImages, 500); // Small delay for stability
  } else {
    window.addEventListener('load', () => setTimeout(enhanceImages, 500));
  }
})();