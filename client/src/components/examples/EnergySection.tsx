import { EnergySection } from '../EnergySection';
import { useState } from 'react';

export default function EnergySectionExample() {
  const [logs, setLogs] = useState([
    { id: '1', activity: '3 hours screen time', impact: 'negative' as const },
    { id: '2', activity: '20 minute eye rest', impact: 'positive' as const },
  ]);

  const handleAdd = (activity: string, impact: "positive" | "neutral" | "negative") => {
    setLogs([...logs, { id: Date.now().toString(), activity, impact }]);
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  return <EnergySection logs={logs} onAddLog={handleAdd} onDeleteLog={handleDelete} />;
}
