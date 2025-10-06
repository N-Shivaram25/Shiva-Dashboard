import { WellnessSection } from '../WellnessSection';
import { useState } from 'react';

export default function WellnessSectionExample() {
  const [logs, setLogs] = useState([
    { id: '1', activity: '30 minutes yoga' },
    { id: '2', activity: 'Drank 8 glasses of water' },
  ]);

  const handleAdd = (activity: string) => {
    setLogs([...logs, { id: Date.now().toString(), activity }]);
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  return <WellnessSection logs={logs} onAddLog={handleAdd} onDeleteLog={handleDelete} />;
}
