import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { PresentationEditor } from './components/PresentationEditor';
import { WizardModal } from './components/WizardModal';
import type { Property } from './mockData';

function App() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <>
      {selectedProperty ? (
        <PresentationEditor 
          property={selectedProperty} 
          onBack={() => setSelectedProperty(null)} 
        />
      ) : (
        <Dashboard onSelectProperty={setSelectedProperty} />
      )}
      
      {/* Global Wizard Modal */}
      <WizardModal />
    </>
  );
}

export default App;
