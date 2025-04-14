export const getName = (field: string | { name: string; } | undefined) => {
	if (!field) return '';
	return typeof field === 'string' ? field : field.name;
  };