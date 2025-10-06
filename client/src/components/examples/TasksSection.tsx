import { TasksSection } from '../TasksSection';
import { useState } from 'react';

export default function TasksSectionExample() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Review code changes', completed: false },
    { id: '2', title: 'Update documentation', completed: false },
  ]);

  const handleAdd = (title: string) => {
    setTasks([...tasks, { id: Date.now().toString(), title, completed: false }]);
  };

  const handleToggle = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return <TasksSection tasks={tasks} onAddTask={handleAdd} onToggleTask={handleToggle} onDeleteTask={handleDelete} />;
}
