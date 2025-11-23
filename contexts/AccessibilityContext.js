import { createContext, useContext, useState } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const toggleAccessibility = () => {
    setAccessibilityMode(prev => !prev);
  };

  const value = {
    accessibilityMode,
    toggleAccessibility,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}