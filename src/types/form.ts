// Shared form-related types

// Hole data used in course forms and APIs; allows nulls while editing.
export interface HoleData {
  id?: string;
  hole_number: number;
  par: number | null;
  distance: number | null;
  course_id?: string;
}

export interface CourseFormValues {
  courseName: string;
  holes: HoleData[];
}

