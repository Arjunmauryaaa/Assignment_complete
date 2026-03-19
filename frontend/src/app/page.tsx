'use client';

import { useEffect, useState } from 'react';
import { projectService } from '@/services/api';
import ProjectCard from '@/components/ProjectCard';
import { Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getAll(page);
      setProjects(res.data.data);
      setTotalPages(res.data.pages);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectService.create(newProject);
      toast.success('Project created successfully');
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.delete(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your active projects and track progress.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Create Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-slate-400">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary p-2"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-slate-400 mb-4">No projects found. Create your first project to get started!</p>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-secondary mx-auto"
          >
            Create your first project
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-md p-8 rounded-2xl relative animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newProject.name}
                    onChange={e => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Enter project name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea 
                    rows={4}
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                    placeholder="Briefly describe the project..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
