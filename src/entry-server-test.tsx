import { renderToString } from 'react-dom/server';

export function render(url: string) {
  const html = `
    <div>
      <h1>SSR Test Page</h1>
      <p>URL: ${url}</p>
      <p>This is a test to see if SSR is working</p>
      <div id="root">
        <h2>Blog Post Test</h2>
        <p>If you see this, SSR is working!</p>
      </div>
    </div>
  `;
  
  return { html };
}
