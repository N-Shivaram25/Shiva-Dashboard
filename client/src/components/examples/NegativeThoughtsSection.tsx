import { NegativeThoughtsSection } from '../NegativeThoughtsSection';
import { useState } from 'react';

export default function NegativeThoughtsSectionExample() {
  const [thoughts, setThoughts] = useState([
    { id: '1', thought: 'I am worried about the upcoming deadline' },
  ]);

  const handleAdd = (thought: string) => {
    setThoughts([...thoughts, { id: Date.now().toString(), thought }]);
  };

  const handleDelete = (id: string) => {
    setThoughts(thoughts.filter(t => t.id !== id));
  };

  return <NegativeThoughtsSection thoughts={thoughts} onAddThought={handleAdd} onDeleteThought={handleDelete} />;
}
