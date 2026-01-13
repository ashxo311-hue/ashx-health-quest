
import { FamilyMember, DailyStats } from './types';

export const DEFAULT_GOAL_STEPS = 3000;
export const DEFAULT_GOAL_WATER_ML = 4000; // 4 Liters

export const MOCK_FAMILY: FamilyMember[] = [
  { id: '1', name: 'Dad', avatar: 'https://picsum.photos/seed/dad/100', xp: 45, weeklyXP: 4 },
  { id: '2', name: 'Mom', avatar: 'https://picsum.photos/seed/mom/100', xp: 52, weeklyXP: 6 },
  { id: '3', name: 'Sister', avatar: 'https://picsum.photos/seed/sis/100', xp: 38, weeklyXP: 3 },
  { id: '4', name: 'Rithwik', avatar: 'https://picsum.photos/seed/rithwik/100', xp: 41, weeklyXP: 5 },
  { id: '5', name: 'Monish', avatar: 'https://picsum.photos/seed/monish/100', xp: 20, weeklyXP: 1 },
  { id: '6', name: 'Goutham', avatar: 'https://picsum.photos/seed/goutham/100', xp: 33, weeklyXP: 4 },
];

export const INITIAL_STATS: DailyStats = {
  steps: 1250,
  waterMl: 1500,
  date: new Date().toISOString().split('T')[0],
  goalSteps: DEFAULT_GOAL_STEPS,
  goalWaterMl: DEFAULT_GOAL_WATER_ML,
};
