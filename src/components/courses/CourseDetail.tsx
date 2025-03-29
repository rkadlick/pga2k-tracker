import { useState } from 'react';
import { Course, Hole } from '@/types';
import HoleForm from './HoleForm';

interface CourseDetailProps {
  course: Course;
  onUpdateHole: (holeData: Pick<Hole, 'course_id' | 'hole_number' | 'par' | 'distance'>) => void;
  onEditHole: (hole: Hole) => void;
  onDeleteHole: (id: string) => void;
}

export default function CourseDetail({
  course,
  onUpdateHole,
  onEditHole,
  onDeleteHole
}: CourseDetailProps) {
  const [isAddingHole, setIsAddingHole] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const holes = course.holes || [];
  const frontNine = holes.filter(hole => hole.hole_number <= 9);
  const backNine = holes.filter(hole => hole.hole_number > 9);

  const handleAddHole = () => {
    setIsAddingHole(true);
  };

  const handleHoleSubmit = (holeData: Pick<Hole, 'course_id' | 'hole_number' | 'par' | 'distance'>) => {
    onUpdateHole(holeData);
    setIsAddingHole(false);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = (id: string) => {
    onDeleteHole(id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[--card-bg] border border-[--border] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[--foreground] mb-4">{course.name}</h2>
        
        <div className="mt-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-[--foreground]">Holes</h3>
          {!isAddingHole && (
            <button
              onClick={handleAddHole}
              className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[--primary] hover:bg-[--primary-hover] focus:outline-none focus:ring-2 focus:ring-[--primary]"
            >
              Add Hole
            </button>
          )}
        </div>
        
        {isAddingHole && (
          <div className="mt-4 p-4 border border-[--border] rounded-lg bg-[--input-bg]">
            <h4 className="text-lg font-medium mb-2 text-[--foreground]">Add New Hole</h4>
            <HoleForm
              courseId={course.id}
              onSubmit={handleHoleSubmit}
              onCancel={() => setIsAddingHole(false)}
            />
          </div>
        )}

        {holes.length === 0 ? (
          <p className="mt-2 text-[--muted]">No holes added yet. Add holes to complete the course setup.</p>
        ) : (
          <div className="mt-4 space-y-6">
            {frontNine.length > 0 && (
              <div>
                <h4 className="text-md font-medium mb-2 text-[--foreground]">Front Nine</h4>
                <HoleTable
                  holes={frontNine}
                  onEdit={onEditHole}
                  onDelete={handleDeleteClick}
                  confirmDelete={confirmDelete}
                  onConfirmDelete={handleConfirmDelete}
                  onCancelDelete={() => setConfirmDelete(null)}
                />
              </div>
            )}
            
            {backNine.length > 0 && (
              <div>
                <h4 className="text-md font-medium mb-2 text-[--foreground]">Back Nine</h4>
                <HoleTable
                  holes={backNine}
                  onEdit={onEditHole}
                  onDelete={handleDeleteClick}
                  confirmDelete={confirmDelete}
                  onConfirmDelete={handleConfirmDelete}
                  onCancelDelete={() => setConfirmDelete(null)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface HoleTableProps {
  holes: Hole[];
  onEdit: (hole: Hole) => void;
  onDelete: (id: string) => void;
  confirmDelete: string | null;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}

function HoleTable({
  holes,
  onEdit,
  onDelete,
  confirmDelete,
  onConfirmDelete,
  onCancelDelete
}: HoleTableProps) {
  return (
    <table className="min-w-full divide-y divide-[--border]">
      <thead className="bg-[--card-bg]">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">
            Hole
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">
            Par
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-[--muted] uppercase tracking-wider">
            Distance
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-[--muted] uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-[--input-bg] divide-y divide-[--border]">
        {holes.map((hole) => (
          <tr key={hole.id} className="hover:bg-[--hover-bg]">
            <td className="px-6 py-4 whitespace-nowrap text-[--foreground]">
              {hole.hole_number}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-[--foreground]">
              {hole.par}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-[--foreground]">
              {hole.distance ? `${hole.distance} yards` : '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(hole)}
                  className="text-[--primary] hover:text-[--primary-hover] px-2 py-1"
                >
                  Edit
                </button>
                
                {confirmDelete === hole.id ? (
                  <>
                    <button
                      onClick={() => onConfirmDelete(hole.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-2 py-1"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={onCancelDelete}
                      className="text-[--muted] hover:text-[--foreground] px-2 py-1"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onDelete(hole.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-2 py-1"
                  >
                    Delete
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
