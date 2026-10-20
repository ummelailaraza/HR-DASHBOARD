'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Badge from '@/components/Badge';
import Modal from '@/components/Modal';
import Avatar from '@/components/Avatar';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getRolePermissions } from '@/lib/permissions';
import { useToast } from '@/context/ToastContext';
import { TaskItem, Employee } from '@/lib/types';
import {
  CheckSquare,
  Plus,
  Kanban,
  ListFilter,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  User,
  Sliders,
  ArrowRight,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';

const COLUMNS: { id: TaskItem['status']; title: string; color: string; bg: string }[] = [
  { id: 'Todo', title: 'To Do / Backlog', color: 'border-slate-300 dark:border-slate-700', bg: 'bg-slate-50 dark:bg-slate-900/40' },
  { id: 'In Progress', title: 'In Progress', color: 'border-blue-400 dark:border-blue-700', bg: 'bg-blue-50/40 dark:bg-blue-950/20' },
  { id: 'Review', title: 'Under Review / QA', color: 'border-purple-400 dark:border-purple-700', bg: 'bg-purple-50/40 dark:bg-purple-950/20' },
  { id: 'Done', title: 'Completed', color: 'border-emerald-400 dark:border-emerald-700', bg: 'bg-emerald-50/40 dark:bg-emerald-950/20' },
];

export default function TasksPage() {
  const { user } = useAuth();
  const perms = getRolePermissions(user?.role);
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'mine'>(user?.role === 'Employee' ? 'mine' : 'all');

  // New task form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskItem['priority']>('High');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  const loadData = async () => {
    const [t, e] = await Promise.all([api.getTasks(), api.getEmployees()]);
    setTasks(t);
    setEmployees(e);
    if (e.length > 0 && !assigneeId) {
      setAssigneeId(e[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: TaskItem['status'], taskTitle: string) => {
    const progress = newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? 50 : newStatus === 'Review' ? 85 : 0;
    await api.updateTaskStatus(taskId, newStatus, progress);
    showToast(`"${taskTitle.substring(0, 25)}..." moved to ${newStatus}`, 'info');
    loadData();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetAssigneeId = perms.canAssignTasksToAll
      ? (assigneeId || employees[0]?.id)
      : (user?.id || assigneeId || employees[0]?.id);

    await api.createTask({
      title,
      description: desc,
      assigneeId: targetAssigneeId,
      priority,
      status: 'Todo',
      dueDate,
      progress: 0,
    });

    showToast(
      perms.canAssignTasksToAll
        ? 'Task assigned to team member'
        : 'Task logged to your task list',
      'success'
    );
    setTitle('');
    setDesc('');
    setIsCreateOpen(false);
    loadData();
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchesScope =
      scopeFilter === 'all' ||
      (user && (t.assigneeId === user.id || t.assigneeName.toLowerCase() === user.name.toLowerCase()));
    return matchesPriority && matchesScope;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <Header
        title={user?.role === 'Employee' ? 'My Tasks & Execution' : 'Task Assignment & Execution'}
        subtitle={
          user?.role === 'Employee'
            ? 'Manage your assigned deliverables and update task progress'
            : 'Manage deliverables, project milestones and team workload'
        }
        onClockAction={loadData}
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Control Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* View Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Scope Filter for Tasks */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setScopeFilter('mine')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  scopeFilter === 'mine'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>My Tasks</span>
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  scopeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <span>All Team Tasks</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{perms.canAssignTasksToAll ? 'Create & Assign Task' : 'Create My Task'}</span>
          </button>
        </div>

        {/* KANBAN BOARD VIEW */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);
              return (
                <div
                  key={col.id}
                  className={`rounded-3xl border ${col.color} ${col.bg} p-4 flex flex-col gap-3 min-h-[480px] transition-all`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                      {col.title}
                    </h3>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks Cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colTasks.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        No tasks in this lane
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-dark-card hover:-translate-y-0.5 transition-all space-y-3 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {task.title}
                            </h4>
                            <Badge status={task.priority} />
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>

                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                              <span>Progress</span>
                              <span className="font-mono">{task.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Assignee & Due Date */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Avatar
                                src={task.assigneeAvatar}
                                name={task.assigneeName}
                                gender={task.assigneeGender}
                                size="xs"
                              />
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[90px]">
                                {task.assigneeName.split(' ')[0]}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                              {task.dueDate}
                            </span>
                          </div>

                          {/* Quick Status Shift Controls */}
                          <div className="pt-1 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                            <span>Move to:</span>
                            <div className="flex gap-1">
                              {COLUMNS.filter((c) => c.id !== task.status).map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => handleStatusChange(task.id, c.id, task.title)}
                                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-700 dark:hover:text-blue-300 text-slate-600 dark:text-slate-400 transition-colors font-bold text-[10px]"
                                  title={`Move to ${c.title}`}
                                >
                                  {c.id.split(' ')[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200/90 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-6">Deliverable Title</th>
                    <th className="py-4 px-4">Assignee</th>
                    <th className="py-4 px-4">Priority</th>
                    <th className="py-4 px-4">Progress</th>
                    <th className="py-4 px-4">Due Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-6">
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{task.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">{task.description}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={task.assigneeAvatar}
                            name={task.assigneeName}
                            gender={task.assigneeGender}
                            size="xs"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{task.assigneeName}</p>
                            <p className="text-[10px] text-slate-400">{task.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={task.priority} />
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden inline-block mr-2 align-middle">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="font-bold">{task.progress}%</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {task.dueDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={task.status} />
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as any, task.title)}
                          className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        >
                          <option value="Todo">Todo</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Task Creation Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Assign Corporate Task"
        subtitle="Specify deliverables, delegate to team member, and enforce accountability"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="e.g. Audit Employee Tax Deductions under FBR SRO 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assignee</label>
              {perms.canAssignTasksToAll ? (
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.department})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium flex items-center justify-between">
                  <span>{user?.name} (Self / Squad Task)</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/50">Self</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Instructions</label>
            <textarea
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Include scope, acceptance criteria, dependencies..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30"
            >
              Assign Deliverable
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
