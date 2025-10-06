import { EntertainmentSection } from '../EntertainmentSection';
import { useState } from 'react';

export default function EntertainmentSectionExample() {
  const [entertainment, setEntertainment] = useState([
    { id: '1', activity: 'Watch documentary', completed: false },
    { id: '2', activity: 'Play guitar for 20 minutes', completed: true },
  ]);

  const handleAdd = (activity: string) => {
    setEntertainment([...entertainment, { id: Date.now().toString(), activity, completed: false }]);
  };

  const handleToggle = (id: string) => {
    setEntertainment(entertainment.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const handleDelete = (id: string) => {
    setEntertainment(entertainment.filter(e => e.id !== id));
  };

  return <EntertainmentSection entertainment={entertainment} onAddEntertainment={handleAdd} onToggleEntertainment={handleToggle} onDeleteEntertainment={handleDelete} />;
}
