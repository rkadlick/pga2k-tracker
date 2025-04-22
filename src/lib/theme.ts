// Theme configuration
interface Theme {
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

export const theme: Theme = {
	colors: {
		// Main colors
		primary: {
			50: '#e6f1fe',
			100: '#cce3fd',
			200: '#99c7fb',
			300: '#66aaf9',
			400: '#338ef7',
			500: '#0072f5',  // Primary blue
			600: '#005bc4',
			700: '#004493',
			800: '#002e62',
			900: '#001731'
		},
		secondary: {
			50: '#e7f9ef',
			100: '#d0f4df',
			200: '#a1e9bf',
			300: '#71dda0',
			400: '#42d280',
			500: '#13c760',  // Accent green
			600: '#0f9f4d',
			700: '#0b773a',
			800: '#085026',
			900: '#042813'
		},
		accent: {
			50: '#f2e7fe',
			100: '#e5cffd',
			200: '#cb9ffb',
			300: '#b170f9',
			400: '#9740f7',
			500: '#7d10f5',  // Accent purple
			600: '#640dc4',
			700: '#4b0a93',
			800: '#320662',
			900: '#190331'
		},
		// Semantic colors
		success: '#13c760',
		error: '#f31260',
		warning: '#f5a524',
		info: '#0072f5',
		// Background colors
		background: {
			light: '#ffffff',
			dark: '#0a0a0a'
		},
		// Text colors
		text: {
			light: {
				primary: '#171717',
				secondary: '#666666'
			},
			dark: {
				primary: '#ffffff',
				secondary: '#a1a1aa'
			}
		}
	},

	spacing: {
		xs: '0.5rem',    // 8px
		sm: '0.75rem',   // 12px
		md: '1rem',      // 16px
		lg: '1.5rem',    // 24px
		xl: '2rem',      // 32px
		'2xl': '3rem',   // 48px
	},

	typography: {
		fonts: {
			sans: 'var(--font-geist-sans)',
			mono: 'var(--font-geist-mono)'
		},
		sizes: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem'
		}
	},

	// Helper functions
	getColorClass: (type: 'bg' | 'text' | 'border', color: keyof Theme['colors'], shade: number = 500) => {
		if (typeof theme.colors[color] === 'object' && !('light' in theme.colors[color])) {
			return `${type}-${String(color)}-${shade}`;
		}
		return `${type}-${String(color)}`;
	},

	// Common component styles
	components: {
		card: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
		input: 'w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-600 focus:border-transparent transition-all duration-200',
		button: {
			base: 'px-4 py-2 rounded-lg font-medium transition-all duration-200',
			primary: 'bg-primary-500 hover:bg-primary-600',
			secondary: 'bg-secondary-500 hover:bg-secondary-600',
			accent: 'bg-accent-500 hover:bg-accent-600'
		}
	}
};
  