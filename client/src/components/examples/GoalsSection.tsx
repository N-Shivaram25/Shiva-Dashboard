import { GoalsSection } from '../GoalsSection';
import { useState } from 'react';

export default function GoalsSectionExample() {
  const [goals, setGoals] = useState([
    { id: '1', title: 'Complete project proposal', completed: false },
    { id: '2', title: 'Exercise for 30 minutes', completed: true },
  ]);

  const handleAdd = (title: string) => {
    setGoals([...goals, { id: Date.now().toString(), title, completed: false }]);
  };

  const handleToggle = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return <GoalsSection goals={goals} onAddGoal={handleAdd} onToggleGoal={handleToggle} onDeleteGoal={handleDelete} />;
}
