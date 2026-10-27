export type FairSoft = Record<string, unknown>;
export type FairStatus = 'pass' | 'partial' | 'fail';

export interface FairIndicator {
  id: string;
  name: string;
}

export interface FairDimension {
  id: string;
  title: string;
  children: FairIndicator[];
}

export const FAIR_DIMENSIONS: FairDimension[] = [
  {
    id: 'F',
    title: 'Findability',
    children: [
      { id: 'F1', name: 'F1 · Identity Uniqueness' },
      { id: 'F2', name: 'F2 · Existence of Metadata' },
      { id: 'F3', name: 'F3 · Searchability' },
    ],
  },
  {
    id: 'A',
    title: 'Accessibility',
    children: [
      { id: 'A1', name: 'A1 · Existence of available working version' },
      // A2 (Software history trackability) no se mide: se mantiene oculto.
      { id: 'A3', name: 'A3 · Unrestricted access' },
    ],
  },
  {
    id: 'I',
    title: 'Interoperability',
    children: [
      { id: 'I1', name: 'I1 · I/O data types & formats' },
      { id: 'I2', name: 'I2 · Workflow compatibility' },
      { id: 'I3', name: 'I3 · Dependencies availability' },
    ],
  },
  {
    id: 'R',
    title: 'Reusability',
    children: [
      { id: 'R1', name: 'R1 · Usage documentation' },
      { id: 'R2', name: 'R2 · License' },
      { id: 'R3', name: 'R3 · Contribution policy' },
      { id: 'R4', name: 'R4 · Provenance' },
    ],
  },
];

// Score 0-1 de una clave (dimensión o sub-indicador), o null si no existe.
export function getRawScore(
  fairsoft: FairSoft | null | undefined,
  key: string
): number | null {
  const value = fairsoft?.[key];
  return typeof value === 'number' ? value : null;
}

export function toPercent(value: number | null): number | null {
  return value === null ? null : Math.round(value * 100);
}

// Verde desde 70%, ámbar por debajo, gris si no hay dato.
export function scoreColor(value: number | null): string {
  if (value === null) return '#d0d0d0';
  return value >= 0.7 ? '#1d9e75' : '#ffb236';
}

// pass = completo, partial = intermedio, fail = ausente o 0.
export function getStatus(value: number | null): FairStatus {
  if (value === null || value === 0) return 'fail';
  return value >= 1 ? 'pass' : 'partial';
}

export function statusColor(value: number | null): string {
  return getStatus(value) === 'fail' ? '#9e9e9e' : scoreColor(value);
}