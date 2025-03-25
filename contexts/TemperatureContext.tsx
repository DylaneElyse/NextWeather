import React, { createContext, useContext, useState } from 'react';

type TemperatureContextType = {
  temperatureUnit: boolean;
  temperatureUnitLetter: string;
  toggleTemperatureUnit: () => void;
};

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export const TemperatureProvider = ({ children }: { children: React.ReactNode }) => {
  const [temperatureUnit, setTemperatureUnit] = useState<boolean>(true);
  const [temperatureUnitLetter, setTemperatureUnitLetter] = useState<string>("°C");

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(!temperatureUnit);
    setTemperatureUnitLetter(temperatureUnit ? "°F" : "°C");
  };

  return (
    <TemperatureContext.Provider value={{ temperatureUnit, temperatureUnitLetter, toggleTemperatureUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
};

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};