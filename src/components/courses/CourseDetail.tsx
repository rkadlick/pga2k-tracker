import { useState } from 'react';
import { CourseDetailProps, Hole, HoleTableProps } from '@/types';
import HoleForm from './HoleForm';

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
      <div className="card animate-fade-in">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-[--foreground]">{course.name}</h2>
            
            {!isAddingHole && (
              <button
                onClick={handleAddHole}
                className="inline-flex items-center space-x-2 card-action"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Hole</span>
              </button>
            )}
          </div>
          
          {isAddingHole && (
            <div className="mt-6 card bg-[--background]/50">
              <div className="p-4">
                <h4 className="text-lg font-medium mb-4 text-[--foreground]">Add New Hole</h4>
                <HoleForm
                  courseId={course.id}
                  onSubmit={handleHoleSubmit}
                  onCancel={() => setIsAddingHole(false)}
                />
              </div>
            </div>
          )}

          {holes.length === 0 ? (
            <div className="mt-6 text-center p-8 bg-[--background]/50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 text-[--muted]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-[--muted] mb-4">No holes added yet.</p>
              <button onClick={handleAddHole} className="inline-flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Your First Hole</span>
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {frontNine.length > 0 && (
                <div className="card bg-[--background]/50">
                  <div className="p-4">
                    <h4 className="text-lg font-medium mb-4 text-[--foreground]">Front Nine</h4>
                    <HoleTable
                      holes={frontNine}
                      onEdit={onEditHole}
                      onDelete={handleDeleteClick}
                      confirmDelete={confirmDelete}
                      onConfirmDelete={handleConfirmDelete}
                      onCancelDelete={() => setConfirmDelete(null)}
                    />
                  </div>
                </div>
              )}
              
              {backNine.length > 0 && (
                <div className="card bg-[--background]/50">
                  <div className="p-4">
                    <h4 className="text-lg font-medium mb-4 text-[--foreground]">Back Nine</h4>
                    <HoleTable
                      holes={backNine}
                      onEdit={onEditHole}
                      onDelete={handleDeleteClick}
                      confirmDelete={confirmDelete}
                      onConfirmDelete={handleConfirmDelete}
                      onCancelDelete={() => setConfirmDelete(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
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
        <tbody className="divide-y divide-[--border]">
          {holes.map((hole) => (
            <tr key={hole.id} className="hover:bg-[--primary]/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-[--foreground]">
                {hole.hole_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[--foreground]">
                {hole.par}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[--foreground]">
                {hole.distance ? `${hole.distance} yards` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(hole)}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                             bg-[--primary]/10 text-[--primary] hover:bg-[--primary]/20
                             transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  
                  {confirmDelete === hole.id ? (
                    <>
                      <button
                        onClick={() => onConfirmDelete(hole.id)}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                 bg-rose-500/10 text-rose-600 dark:text-rose-400
                                 hover:bg-rose-500/20 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M5 13l4 4L19 7" />
                        </svg>
                        Confirm
                      </button>
                      <button
                        onClick={onCancelDelete}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                                 bg-[--primary]/5 text-[--muted] hover:text-[--foreground]
                                 hover:bg-[--primary]/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onDelete(hole.id)}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm
                               bg-rose-500/10 text-rose-600 dark:text-rose-400
                               hover:bg-rose-500/20 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
