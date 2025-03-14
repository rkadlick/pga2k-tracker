
// Theme configuration for easy customization
export const theme = {
	colors: {
	  primary: 'blue',    // Main brand color
	  secondary: 'green',  // Secondary color
	  accent: 'amber',     // Accent color
	  success: 'green',    // Success color
	  error: 'red',        // Error color
	  warning: 'yellow',   // Warning color
	  info: 'blue',        // Info color
	  //  use these in Tailwind classes like:
	  // bg-primary-500, text-secondary-700, etc.
	},
	
	// Helper function to get Tailwind color classes
	getClass: (type: 'bg' | 'text' | 'border', color: keyof typeof theme.colors, shade: number = 500) => {
	  return `${type}-${theme.colors[color]}-${shade}`;
	}
  };
  