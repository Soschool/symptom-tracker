import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SymptomTracker = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('trackerEntries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'breakfast',
    foods: '',
    symptoms: {
      itching: false,
      bloating: false,
      temperatureChanges: false,
      fatigue: false,
      muscleWeakness: false,
      numbness: false,
      vision: false,
      balance: false
    },
    symptomNotes: '',
    severity: {
      itching: '0',
      bloating: '0',
      temperatureChanges: '0',
      fatigue: '0',
      muscleWeakness: '0',
      numbness: '0',
      vision: '0',
      balance: '0'
    }
  });

  useEffect(() => {
    localStorage.setItem('trackerEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEntries([...entries, newEntry]);
    setNewEntry({
      ...newEntry,
      foods: '',
      symptomNotes: '',
      symptoms: {
        itching: false,
        bloating: false,
        temperatureChanges: false,
        fatigue: false,
        muscleWeakness: false,
        numbness: false,
        vision: false,
        balance: false
      },
      severity: {
        itching: '0',
        bloating: '0',
        temperatureChanges: '0',
        fatigue: '0',
        muscleWeakness: '0',
        numbness: '0',
        vision: '0',
        balance: '0'
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleSymptomToggle = (symptom) => {
    setNewEntry({
      ...newEntry,
      symptoms: {
        ...newEntry.symptoms,
        [symptom]: !newEntry.symptoms[symptom]
      }
    });
  };

  const handleSeverityChange = (symptom, value) => {
    setNewEntry({
      ...newEntry,
      severity: {
        ...newEntry.severity,
        [symptom]: value
      }
    });
  };

  const exportData = () => {
    const csv = entries.map(entry => {
      const symptoms = Object.entries(entry.symptoms)
        .map(([symptom, present]) => `${symptom}:${present}`)
        .join(';');
      const severities = Object.entries(entry.severity)
        .map(([symptom, level]) => `${symptom}:${level}`)
        .join(';');
      return `${entry.date},${entry.timeOfDay},"${entry.foods}","${symptoms}","${severities}","${entry.symptomNotes}"`;
    }).join('\n');
    
    const blob = new Blob([`Date,Meal,Foods,Symptoms,Severity,Notes\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'symptom-tracker-export.csv';
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Food & Symptom Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newEntry.date}
                  onChange={handleChange}
                  className="w-full p-4 border rounded text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meal</label>
                <select
                  name="timeOfDay"
                  value={newEntry.timeOfDay}
                  onChange={handleChange}
                  className="w-full p-4 border rounded text-lg"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="morningSnack">Morning Snack</option>
                  <option value="lunch">Lunch</option>
                  <option value="afternoonSnack">Afternoon Snack</option>
                  <option value="dinner">Dinner</option>
                  <option value="eveningSnack">Evening Snack</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Foods Eaten</label>
              <textarea
                name="foods"
                value={newEntry.foods}
                onChange={handleChange}
                className="w-full p-4 border rounded text-lg"
                placeholder="List the foods you ate..."
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Symptoms Present</label>
              <div className="space-y-3">
                {Object.entries(newEntry.symptoms).map(([symptom, checked]) => (
                  <div key={symptom} className="border rounded p-3">
                    <button
                      type="button"
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`w-full p-3 text-left text-lg rounded ${
                        checked ? 'bg-blue-100 border-blue-500' : 'bg-gray-50'
                      }`}
                    >
                      <span className="capitalize">
                        {symptom.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </button>
                    {checked && (
                      <div className="mt-2">
                        <select
                          value={newEntry.severity[symptom]}
                          onChange={(e) => handleSeverityChange(symptom, e.target.value)}
                          className="w-full p-3 text-lg border rounded"
                        >
                          <option value="0">Select Severity</option>
                          <option value="1">1 - Mild</option>
                          <option value="2">2 - Moderate</option>
                          <option value="3">3 - Severe</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea
                name="symptomNotes"
                value={newEntry.symptomNotes}
                onChange={handleChange}
                className="w-full p-4 border rounded text-lg"
                placeholder="Any additional symptoms or notes..."
                rows="2"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white p-4 rounded hover:bg-blue-600 text-lg font-medium"
              >
                Add Entry
              </button>
              <button
                type="button"
                onClick={exportData}
                className="bg-green-500 text-white p-4 rounded hover:bg-green-600 text-lg font-medium"
              >
                Export Data
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.slice().reverse().map((entry, index) => (
              <div key={index} className="p-4 border rounded">
                <div className="font-medium">
                  {entry.date} - {entry.timeOfDay.charAt(0).toUpperCase() + entry.timeOfDay.slice(1)}
                </div>
                <div className="mt-2">
                  <strong>Foods:</strong> {entry.foods}
                </div>
                <div className="mt-2">
                  <strong>Active Symptoms:</strong>
                  <ul className="list-disc ml-5">
                    {Object.entries(entry.symptoms)
                      .filter(([_, present]) => present)
                      .map(([symptom, _]) => (
                        <li key={symptom}>
                          {symptom.replace(/([A-Z])/g, ' $1').trim()} - 
                          Severity: {entry.severity[symptom]}/3
                        </li>
                      ))}
                  </ul>
                </div>
                {entry.symptomNotes && (
                  <div className="mt-2">
                    <strong>Notes:</strong> {entry.symptomNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomTracker;
