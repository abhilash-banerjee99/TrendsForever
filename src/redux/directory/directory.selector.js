import { createSelector } from 'reselect';

// Selector
const selectDirectory = state => state.directory;

// Reselect function
export const selectDirectorySections = createSelector(
  [selectDirectory],
  directory => directory.sections
);