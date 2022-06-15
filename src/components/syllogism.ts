

export enum Quantifier {
  UNIVERSAL = 1,
  PARTICULAR,
};

export enum Quality {
  AFFITMATIVE = 1,
  NEGATIVE,
};


export enum TERM_ROLE {
  MAJOR = 1,
  MINOR,
  MIDDLE,
}


export type Figure = 1 | 2 | 3 | 4
export type PropositionType = 'A' | 'E' | 'I' | 'O'
export type Mood = `${PropositionType}${PropositionType}${PropositionType}`


export interface Proposition {
  quantifier: Quantifier
  quality: Quality
  subject: string
  predicate: string
}


export const getQuantifier = (p: PropositionType): Quantifier => {
  return (p === 'A' || p === 'E') ? Quantifier.UNIVERSAL : Quantifier.PARTICULAR
}

export const getQuality = (p: PropositionType): Quality => {
  return (p === 'A' || p === 'I') ? Quality.AFFITMATIVE : Quality.NEGATIVE
}
