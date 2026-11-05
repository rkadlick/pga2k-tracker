import { Course, Hole } from '@/types';
import { sumIfComplete } from '@/utils/formatters';
import courses from './data/snapshot/courses.json';
import holes from './data/snapshot/holes.json';

// Courses entered before their real scorecards were available have filler values:
// every unknown hole is 1 or 3 yards, and some courses are also all par 3.
// The snapshot keeps those values as exported; they are hidden here.
const FILLER_MAX_YARDS = 3;

function getDisplayHoles(courseId: string): Hole[] {
  const courseHoles = holes
    .filter(hole => hole.course_id === courseId)
    .sort((a, b) => a.hole_number - b.hole_number);
  const hasFillerPars = courseHoles.every(hole => hole.par === 3 && hole.distance === 3);

  return courseHoles.map(hole => ({
    ...hole,
    par: hasFillerPars ? null : hole.par,
    distance: hole.distance <= FILLER_MAX_YARDS ? null : hole.distance
  })) as Hole[];
}

function toDisplayCourse(course: (typeof courses)[number]): Course {
  const courseHoles = getDisplayHoles(course.id);
  const front = courseHoles.filter(hole => hole.hole_number <= 9);
  const back = courseHoles.filter(hole => hole.hole_number > 9);

  return {
    ...course,
    front_par: sumIfComplete(front.map(hole => hole.par)),
    back_par: sumIfComplete(back.map(hole => hole.par)),
    total_par: sumIfComplete(courseHoles.map(hole => hole.par)),
    front_distance: sumIfComplete(front.map(hole => hole.distance)),
    back_distance: sumIfComplete(back.map(hole => hole.distance)),
    total_distance: sumIfComplete(courseHoles.map(hole => hole.distance))
  };
}

export async function getCourses(): Promise<Course[]> {
  return courses
    .map(toDisplayCourse)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCourseWithHoles(id: string): Promise<Course & { holes: Hole[] }> {
  const course = courses.find(course => course.id === id);
  if (!course) throw new Error('Course not found');

  return {
    ...toDisplayCourse(course),
    holes: getDisplayHoles(id)
  };
}
