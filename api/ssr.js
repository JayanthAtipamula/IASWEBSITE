const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const url = req.url;

  try {
    // Read the built HTML template (renamed to prevent static serving)
    const templatePath = path.resolve(process.cwd(), 'dist/client/_template.html');
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace the SSR outlet with empty root div for client-side rendering
    // Since we're not doing full SSR yet, React will render everything client-side
    template = template.replace('<!--ssr-outlet-->', '');
    
    // For different routes, we can customize meta tags
    if (url === '/' || url === '') {
      // Homepage - keep existing meta tags
      console.log('Serving homepage');
    } else if (url.includes('/courses')) {
      // Courses page
      template = template.replace(
        '<title>Epitome IAS Academy - Best UPSC Coaching in Hyderabad</title>',
        '<title>UPSC Courses - Epitome IAS Academy</title>'
      );
      template = template.replace(
        '<meta name="description" content="Epitome IAS Academy provides comprehensive UPSC/IAS coaching in Hyderabad. Expert faculty, quality study materials, and personalized mentoring for civil services exam preparation." />',
        '<meta name="description" content="Explore comprehensive UPSC courses at Epitome IAS Academy. Prelims, Mains, Interview preparation with expert guidance." />'
      );
    } else if (url.includes('/current-affairs')) {
      // Current Affairs page
      template = template.replace(
        '<title>Epitome IAS Academy - Best UPSC Coaching in Hyderabad</title>',
        '<title>Current Affairs - Epitome IAS Academy</title>'
      );
      template = template.replace(
        '<meta name="description" content="Epitome IAS Academy provides comprehensive UPSC/IAS coaching in Hyderabad. Expert faculty, quality study materials, and personalized mentoring for civil services exam preparation." />',
        '<meta name="description" content="Stay updated with latest current affairs for UPSC preparation. Daily, weekly, and monthly current affairs coverage." />'
      );
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).send(template);
    
  } catch (error) {
    console.error('SSR Error:', error);
    
    // Fallback HTML with proper asset paths
    const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Epitome IAS Academy - Best UPSC Coaching in Hyderabad</title>
    <meta name="description" content="Epitome IAS Academy provides comprehensive UPSC/IAS coaching in Hyderabad. Expert faculty, quality study materials, and personalized mentoring for civil services exam preparation." />
    <link rel="icon" type="image/png" href="/favicon.png" />
</head>
<body>
    <div id="root"></div>
    <script>
      console.log('Loading fallback content...');
      // This will be handled by client-side rendering when assets load
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(fallbackHtml);
  }
};