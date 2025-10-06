import { CommunicationSection } from '../CommunicationSection';
import { useState } from 'react';

export default function CommunicationSectionExample() {
  const [communications, setCommunications] = useState([
    { id: '1', task: 'Email team about project update', completed: false },
    { id: '2', task: 'Schedule meeting with client', completed: true },
  ]);

  const handleAdd = (task: string) => {
    setCommunications([...communications, { id: Date.now().toString(), task, completed: false }]);
  };

  const handleToggle = (id: string) => {
    setCommunications(communications.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const handleDelete = (id: string) => {
    setCommunications(communications.filter(c => c.id !== id));
  };

  return <CommunicationSection communications={communications} onAddCommunication={handleAdd} onToggleCommunication={handleToggle} onDeleteCommunication={handleDelete} />;
}
