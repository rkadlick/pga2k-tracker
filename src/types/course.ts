// src/types/course.ts

import { BaseRecord } from './base'

/**
 * A golf course record as returned by the API.
 */
export interface Course extends BaseRecord {
  name: string
  front_par?: number
  back_par?: number
  front_distance?: number
  back_distance?: number
  total_par?: number
  total_distance?: number
  wins?: number
  losses?: number
}

/**
 * A single hole on a course, as returned by the API.
 */
export interface Hole extends BaseRecord {
  course_id: string
  hole_number: number
  par: number
  distance: number
}

/**
 * If your API returns a Course *with* its holes populated,
 * you can use:
 */
export interface CourseDetail extends Course {
  holes: Hole[]
}

/**
 * Payload to create a new course (server sets id/created_at/updated_at).
 */
export type CourseCreateData = Omit<CourseDetail, keyof BaseRecord>

/**
 * Payload to update an existing course.
 */
export type CourseUpdateData =
  Partial<Omit<CourseDetail, keyof BaseRecord>> &
  Pick<CourseDetail, 'id'>

/**
 * Payload to create a new hole.
 */
export type HoleCreateData = Omit<Hole, keyof BaseRecord>

/**
 * Payload to update an existing hole.
 */
export type HoleUpdateData =
  Partial<Omit<Hole, keyof BaseRecord>> &
  Pick<Hole, 'id'>
