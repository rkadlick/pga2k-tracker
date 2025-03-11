// src/components/courses/CourseDetail.tsx
import { useState } from 'react';
import { Course, Hole } from '@/types';
import HoleForm from './HoleForm';

interface CourseDetailProps {
  course: Course;
  onUpdateHole: (holeData: Omit<Hole, 'id' | 'created_at'>) => void;
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

  const handleHoleSubmit = (holeData: Omit<Hole, 'id' | 'created_at'>) => {
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
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">{course.name}</h2>
        
        <div className="mt-6 flex justify-between items-center">
          <h3 className="text-lg font-medium">Holes</h3>
          {!isAddingHole && (
            <button
              onClick={handleAddHole}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Hole
            </button>
          )}
        </div>
        
        {isAddingHole && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <h4 className="text-lg font-medium mb-2">Add New Hole</h4>
            <HoleForm
              courseId={course.id}
              onSubmit={handleHoleSubmit}
              onCancel={() => setIsAddingHole(false)}
            />
          </div>
        )}

        {holes.length === 0 ? (
          <p className="mt-2 text-gray-500">No holes added yet. Add holes to complete the course setup.</p>
        ) : (
          <div className="mt-4 space-y-6">
            {frontNine.length > 0 && (
              <div>
                <h4 className="text-md font-medium mb-2">Front Nine</h4>
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
                <h4 className="text-md font-medium mb-2">Back Nine</h4>
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
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Hole
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Par
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Distance
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {holes.map((hole) => (
          <tr key={hole.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              {hole.hole_number}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {hole.par}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {hole.distance ? `${hole.distance} yards` : '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onEdit(hole)}
                  className="text-indigo-600 hover:text-indigo-900 px-2 py-1"
                >
                  Edit
                </button>
                
                {confirmDelete === hole.id ? (
                  <>
                    <button
                      onClick={() => onConfirmDelete(hole.id)}
                      className="text-red-600 hover:text-red-900 px-2 py-1"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={onCancelDelete}
                      className="text-gray-600 hover:text-gray-900 px-2 py-1"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onDelete(hole.id)}
                    className="text-red-600 hover:text-red-900 px-2 py-1"
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
