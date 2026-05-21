export type MedusaStep = 'rules' | 'caller' | 'countdown' | 'report' | 'results' | 'end';

export type MedusaPair = { a: number; b: number };

export type MedusaRoundHistory = {
  callerIdx: number;
  pairs: MedusaPair[];
};
