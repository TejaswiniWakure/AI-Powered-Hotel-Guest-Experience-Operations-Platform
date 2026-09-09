import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LayoutList, LayoutGrid, Search, Filter, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StaffTasks() {
  const [view, setView] = useState('kanban'); // 'list' | 'kanban'

  const tasks = [];

  const columns = ['New', 'In Progress', 'Completed'];

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-primary">My Tasks</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Search tasks..." className="pl-9 pr-4 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <Button variant="outline" size="icon"><Filter size={16} /></Button>
          <div className="border border-border rounded-md flex bg-white ml-2 p-0.5">
            <button onClick={() => setView('kanban')} className={`p-1.5 rounded ${view === 'kanban' ? 'bg-secondary-bg text-primary' : 'text-text-muted'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-secondary-bg text-primary' : 'text-text-muted'}`}><LayoutList size={16} /></button>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card className="p-12 text-center flex-1 flex flex-col items-center justify-center bg-secondary-bg/30 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
            <CheckSquare size={32} className="text-primary/40" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">No tasks assigned</h3>
          <p className="text-text-muted max-w-md">You currently have no tasks assigned to you. When new requests come in for your department, they will appear here.</p>
        </Card>
      ) : view === 'kanban' ? (
        <div className="grid md:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {columns.map(col => (
            <div key={col} className="bg-secondary-bg/50 rounded-xl p-4 flex flex-col h-full border border-border">
              <h3 className="font-semibold text-primary mb-4 flex justify-between items-center">
                {col} 
                <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-border">{tasks.filter(t => t.status === col).length}</span>
              </h3>
              <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
                {tasks.filter(t => t.status === col).map(task => (
                  <Link key={task.id} to={`/staff/tasks/${task.id}`}>
                    <Card className={`p-3 cursor-pointer hover:border-primary transition-colors border-l-4 ${task.priority === 'High' ? 'border-l-critical' : task.priority === 'Medium' ? 'border-l-medium' : 'border-l-success'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={task.priority === 'High' ? 'danger' : 'outline'} className="text-[10px] py-0">{task.priority}</Badge>
                        <span className="text-[10px] text-text-muted">{task.id}</span>
                      </div>
                      <h4 className="font-bold text-primary text-sm mb-1">{task.issue}</h4>
                      <p className="text-xs text-text-muted mb-3">Room {task.room}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-medium ${task.priority === 'High' ? 'text-critical' : 'text-text-muted'}`}>SLA: {task.sla}</span>
                        <div className="w-6 h-6 rounded-full bg-secondary-bg flex items-center justify-center text-primary font-bold">R</div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-muted bg-secondary-bg uppercase border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold">Task</th>
                  <th className="px-6 py-3 font-semibold">Room</th>
                  <th className="px-6 py-3 font-semibold">Priority</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">SLA</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b border-border hover:bg-secondary-bg/50">
                    <td className="px-6 py-4 font-medium text-primary">
                      <Link to={`/staff/tasks/${task.id}`} className="hover:underline">{task.issue}</Link>
                      <div className="text-text-muted text-xs font-normal">{task.id}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{task.room}</td>
                    <td className="px-6 py-4"><Badge variant={task.priority === 'High' ? 'danger' : 'outline'}>{task.priority}</Badge></td>
                    <td className="px-6 py-4"><Badge variant={task.status === 'Completed' ? 'success' : 'secondary'}>{task.status}</Badge></td>
                    <td className="px-6 py-4 font-medium text-critical">{task.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
