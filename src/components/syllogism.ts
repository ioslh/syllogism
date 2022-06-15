

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


export const validSyllogisms = [
  {
    form: 'AAA-1',
    name: 'Barbara',
  },
  {
    form: 'EAE-1',
    name: 'Celarent',
  },
  {
    form: 'AII-1',
    name: 'Darii',
  },
  {
    form: 'EIO-1',
    name: 'Ferio',
  },
  {
    form: 'AEE-2',
    name: 'Camestres',
  },
  {
    form: 'EAE-2',
    name: 'Cesare',
  },
  {
    form: 'AOO-2',
    name: 'Baroko',
  },
  {
    form: 'EIO-2',
    name: 'Festino',
  },
  {
    form: 'AII-3',
    name: 'Datisi',
  },
  {
    form: 'IAI-3',
    name: 'Disamis',
  },
  {
    form: 'EIO-3',
    name: 'Ferison',
  },
  {
    form: 'OAO-3',
    name: 'Bokardo',
  },
  {
    form: 'AEE-4',
    name: 'Camenes',
  },
  {
    form: 'IAI-4',
    name: 'Dimaris',
  },
  {
    form: 'EIO-4',
    name: 'Fresison',
  },
]