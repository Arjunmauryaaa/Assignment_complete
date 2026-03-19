import Link from 'next/link';
import { Calendar, MoreVertical, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    created_at: string;
  };
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="glass p-6 rounded-xl border border-slate-700/50 card-hover group relative">
      <button 
        onClick={() => onDelete(project.id)}
        className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      
      <Link href={`/projects/${project.id}`} className="block">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
          {project.description || 'No description provided.'}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3 h-3" />
          <span>Created on {formatDate(project.created_at)}</span>
        </div>
      </Link>
    </div>
  );
}
