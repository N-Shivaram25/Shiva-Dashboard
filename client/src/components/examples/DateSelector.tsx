import { DateSelector } from '../DateSelector';
import { useState } from 'react';

export default function DateSelectorExample() {
  const [date, setDate] = useState(new Date());
  
  return <DateSelector selectedDate={date} onDateChange={setDate} />;
}
