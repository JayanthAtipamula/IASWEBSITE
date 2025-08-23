const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const url = req.url;

  try {
    // Read the built HTML template
    const templatePath = path.resolve(process.cwd(), 'dist/client/index.html');
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // For now, just serve the static HTML with proper meta tags
    // This ensures the page loads and we can add proper SSR later
    if (url === '/' || url === '') {
      // Add some basic meta tags for the homepage
      template = template.replace(
        '<title>Epitome IAS Academy - Best UPSC Coaching in Hyderabad</title>',
        `<title>Epitome IAS Academy - Best UPSC Coaching in Hyderabad</title>
        <meta name="description" content="Join Epitome IAS Academy for comprehensive UPSC preparation with expert faculty and proven results." />
        <meta property="og:title" content="Epitome IAS Academy - Best UPSC Coaching in Hyderabad" />
        <meta property="og:description" content="Join Epitome IAS Academy for comprehensive UPSC preparation with expert faculty and proven results." />
        <meta property="og:url" content="https://epitomeias.in/" />`
      );
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).send(template);
    
  } catch (error) {
    console.error('SSR Error:', error);
    
    // Fallback HTML
    const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Epitome IAS Academy - Best UPSC Coaching in Hyderabad</title>
    <meta name="description" content="Epitome IAS Academy provides comprehensive UPSC/IAS coaching in Hyderabad. Expert faculty, quality study materials, and personalized mentoring for civil services exam preparation." />
</head>
<body>
    <div id="root"></div>
    <script type="module" crossorigin src="/assets/index.js"></script>
    <link rel="stylesheet" href="/assets/index.css">
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(fallbackHtml);
  }
};