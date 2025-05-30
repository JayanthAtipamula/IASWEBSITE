import { initToolbar } from '@stagewise/toolbar';

// Define your toolbar configuration
const stagewiseConfig = {
  plugins: [
    {
      name: 'example-plugin',
      description: 'Adds additional context for your components',
      shortInfoForPrompt: () => {
        return "Context information about the selected element";
      },
      mcp: null,
      actions: [
        {
          name: 'Example Action',
          description: 'Demonstrates a custom action',
          execute: () => {
            window.alert('This is a custom action!');
          },
        },
      ],
    },
  ],
};

// Initialize the toolbar when your app starts
export function setupStagewise() {
  // Only initialize once and only in development mode
  if (import.meta.env.MODE === 'development') {
    initToolbar(stagewiseConfig);
  }
}
