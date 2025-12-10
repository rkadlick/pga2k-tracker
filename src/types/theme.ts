export interface Theme {
	colors: {
		// Main colors
		primary: Record<number, string>;
		secondary: Record<number, string>;
		accent: Record<number, string>;
		// Semantic colors
		success: string;
		error: string;
		warning: string;
		info: string;
		// Background colors
		background: {
			light: string;
			dark: string;
		};
		// Text colors
		text: {
			light: {
				primary: string;
				secondary: string;
			};
			dark: {
				primary: string;
				secondary: string;
			};
		}
	};

	spacing: Record<string, string>;

	typography: {
		fonts: {
			sans: string;
			mono: string;
		};
		sizes: Record<string, string>;
	};

	// Helper functions
	getColorClass: (type: 'bg' | 'text' | 'border', color: keyof Theme['colors'], shade?: number) => string;

	// Common component styles
	components: {
		card: string;
		input: string;
		button: {
			base: string;
			primary: string;
			secondary: string;
			accent: string;
		};
	};
}