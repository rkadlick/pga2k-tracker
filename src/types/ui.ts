export interface NavLinkProps {
	href: string;
	label: string;
	pathname: string | null;
  }

  export interface MobileNavLinkProps extends NavLinkProps {
	onClick: () => void;
  }

  export interface Column {
	id: string;
	label: string;
	className?: string;
  }
  export type RowType = 'par' | 'distance' | 'score' | 'match' | 'custom';
  export interface Row {
	id: string;
	type: RowType;
	label: string;
	values: (string | number | null | undefined)[];
	total?: number | string;
	className?: string;
	onChange?: (rowId: string, index: number, value: string) => void;
  }

  export interface ScorecardProps {
	title?: string;
	columns: Column[];
	rows: Row[];
	className?: string;
  }

  export interface FeatureCardProps {
	title: string;
	description: string;
	link: string;
	icon: React.ReactNode;
  }