'use client';

import { useEffect, useState, use } from 'react';
import { projectService, taskService } from '@/services/api';
import { 
  Plus, Loader2, ChevronLeft, Calendar, 
  Clock, CheckCircle2, AlertCircle, Trash2, 
  Edit3, Filter, ArrowUpDown 
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDate, cn } from '@/lib/utils';

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: ''
  });

  // Filters and Sorting
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('due_date');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id, statusFilter, sortBy, sortOrder)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, statusFilter, sortBy, sortOrder]);

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, taskForm);
        toast.success('Task updated');
      } else {
        await taskService.create(id, taskForm);
        toast.success('Task added');
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save task');
    }
  };

  const handleEditClick = (task: any) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
    });
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskService.delete(taskId);
      toast.success('Task deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (loading && !project) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{project?.name}</h1>
          <p className="text-slate-400 max-w-2xl">{project?.description || 'No description provided.'}</p>
        </div>
        <button 
          onClick={() => {
            setEditingTask(null);
            setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '' });
            setShowTaskModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Filters and Sorting */}
      <div className="glass p-4 rounded-xl border border-slate-700/50 mb-8 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="!mb-0 bg-transparent border-none text-sm font-medium"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="!mb-0 bg-transparent border-none text-sm font-medium"
          >
            <option value="due_date">Sort by Due Date</option>
            <option value="title">Sort by Title</option>
            <option value="priority">Sort by Priority</option>
            <option value="created_at">Sort by Created at</option>
          </select>
          <button 
            onClick={() => setSortOrder(o => o === 'ASC' ? 'DESC' : 'ASC')}
            className="text-xs text-blue-400 font-bold hover:underline"
          >
            {sortOrder}
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task: any) => (
            <div key={task.id} className="glass p-6 rounded-xl border border-slate-700/50 group flex flex-col md:flex-row justify-between gap-6 transition-all hover:bg-slate-800/40">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  <span className={cn(
                    "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border",
                    getPriorityColor(task.priority)
                  )}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{task.description || 'No description.'}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due {formatDate(task.due_date)}</span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 font-medium",
                    task.status === 'done' ? 'text-green-400' : task.status === 'in-progress' ? 'text-blue-400' : 'text-slate-400'
                  )}>
                    {task.status === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> : task.status === 'in-progress' ? <Clock className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span className="capitalize">{task.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditClick(task)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500">No tasks found for this project.</p>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-xl p-8 rounded-2xl relative animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleTaskSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input 
                    type="text" 
                    required 
                    value={taskForm.title}
                    onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                    placeholder="Task title..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={taskForm.description}
                    onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                    placeholder="Task details..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select 
                    value={taskForm.status}
                    onChange={e => setTaskForm({...taskForm, status: e.target.value})}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select 
                    value={taskForm.priority}
                    onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={taskForm.due_date}
                    onChange={e => setTaskForm({...taskForm, due_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
