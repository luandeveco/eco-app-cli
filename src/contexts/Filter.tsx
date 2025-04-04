import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FilterContextProps } from './interfaces/FilterContextProps';
import { Movement } from '../database/entities/Movement';

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [statusSelected, setStatusSelected] = useState<number>(0);
  const [neighborhoodSelected, setNeighborhoodSelected] = useState<string>('');
  const [municipalitySelected, setMunicipalitySelected] = useState<string>('');
  const [movement, setMovement] = useState([{} as Movement]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [counties, setcounties] = useState([]);


  return (
    <FilterContext.Provider value={{
      statusSelected,
      neighborhoodSelected,
      municipalitySelected,
      neighborhoods,
      movement,
      counties,
      setNeighborhoods,
      setMovement,
      setStatusSelected,
      setcounties,
      setNeighborhoodSelected,
      setMunicipalitySelected
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};
