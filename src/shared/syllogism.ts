

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
  mood: PropositionType
  subject: string
  predicate: string
}

export interface Argument {
  mood: [PropositionType, PropositionType, PropositionType]
  figure: Figure
  major: string
  minor: string
  middle: string
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


export const SyllogismFallacies = [
  {
    name: 'fallacy of the undistributed middle',
    principle: 'Distribute the middle term in at least one premise',
    instance: () => {

    }
  },
  {
    name: '',
    principle: '',
    instance: () => {

    }
  },
]


// Following proposition type is subject distributed
const distributeSubject = {
  A: true,
  E: true,
  I: false,
  O: false,
} as Record<PropositionType, boolean>

// Following proposition type is predicate distributed
const distributePredicate = {
  A: false,
  E: true,
  I: false,
  O: true,
} as Record<PropositionType, boolean>

export const quantity = {
  A: Quantifier.UNIVERSAL,
  E: Quantifier.UNIVERSAL,
  I: Quantifier.PARTICULAR,
  O: Quantifier.PARTICULAR,
} as Record<PropositionType, Quantifier>

export const quality = {
  A: Quality.AFFITMATIVE,
  E: Quality.NEGATIVE,
  I: Quality.AFFITMATIVE,
  O: Quality.NEGATIVE,
} as Record<PropositionType, Quality>

// Rule 2: 检查是否命中中项不周延谬误
// 返回 true 表示存在不周延谬误
const checkUndistributeMiddle = (mood: Mood, figure: Figure) => {
  const majorType = mood[0] as PropositionType
  const minorType = mood[1] as PropositionType
  let isMiddleDistributedInMajorPremise = false
  let isMiddleDistributedInMinorPremise = false

  if ([1, 3].includes(figure)) {
    // 1 3 格的中项是大前提的主项
    isMiddleDistributedInMajorPremise = distributeSubject[majorType]
  } else {
    // 2 4 格的中项是大前提的谓项
    isMiddleDistributedInMajorPremise = distributePredicate[majorType]
  }

  if ([1, 2].includes(figure)) {
    // 1 2 格的中项是小前提的谓项
    isMiddleDistributedInMinorPremise = distributePredicate[minorType]
  } else {
    // 3 4 格的中项是小前提的主项
    isMiddleDistributedInMinorPremise = distributeSubject[minorType]
  }
  return !(isMiddleDistributedInMajorPremise || isMiddleDistributedInMinorPremise)
}

// Rule 3: 在结论中周延的词项在前提中也必须周延
// 返回 true 表示存在不当周延谬误
const checkIllicitProcess = (mood: Mood, figure: Figure) => {
  const majorPremise = mood[0] as PropositionType
  const minorPremise = mood[1] as PropositionType
  const conclusion = mood[2] as PropositionType

  if (distributePredicate[conclusion]) {
    let isDistribute = false
    // 结论中的谓词是周延的（大项），需要判断大前提中的该词项也必须周延
    if ([1, 3].includes(figure)) {
      isDistribute = distributePredicate[majorPremise]
    } else {
      isDistribute = distributeSubject[majorPremise]
    }
    if (!isDistribute) return true
  }
  if (distributeSubject[conclusion]) {
    let isDistribute = false
    if ([1, 2].includes(figure)) {
      isDistribute = distributeSubject[minorPremise]
    } else {
      isDistribute = distributePredicate[minorPremise]
    }
    if (!isDistribute) return true
  }
  return false
}

// Rule 4: 避免出现两个否定前提（fallacy of exclusive premises）
// 返回 true 表明存在谬误
const checkTwoNegativePremises = (mood: Mood, figure: Figure) => {
  const majorPremise = mood[0] as PropositionType
  const minorPremise = mood[1] as PropositionType
  return (quality[majorPremise] === Quality.NEGATIVE) && (quality[minorPremise] === Quality.NEGATIVE)
}


// Rule 5: 前提否定，则结论必须否定 fallacy of drawing an affirmative conclusion from a negative premise
// 返回 true 表明存在谬误
const checkNegativeConclusion = (mood: Mood, figure: Figure) => {
  const majorPremise = mood[0] as PropositionType
  const minorPremise = mood[1] as PropositionType
  const conclusion = mood[2] as PropositionType
  if ((quality[majorPremise] === Quality.NEGATIVE) || (quality[minorPremise] === Quality.NEGATIVE)) {
    return quality[conclusion] !== Quality.NEGATIVE
  }
  return false
}

// Rule 6: 两个全称前提得不出特称结论 existential fallacy
// 返回 true 表明违反规则
const checkExistentialFallacy = (mood: Mood, figure: Figure) => {
  const majorPremise = mood[0] as PropositionType
  const minorPremise = mood[1] as PropositionType
  const conclusion = mood[2] as PropositionType
  if (quantity[majorPremise] === Quantifier.UNIVERSAL && quantity[minorPremise] === Quantifier.UNIVERSAL) {
    return quantity[conclusion] !== Quantifier.UNIVERSAL
  }
  return false
}

export const fallacyCheck = (mood: Mood, figure: number, major: string, minor: string, middle: string): number[] => {
  return []
}

export const argumentAssert = [
  {
    fn: checkUndistributeMiddle,
    desc: '中项不周延谬误',
  },
  {
    fn: checkIllicitProcess,
    desc: '不当周延谬误',
  },
  {
    fn: checkTwoNegativePremises,
    desc: '避免出现两个否定前提',
  },
  {
    fn: checkNegativeConclusion,
    desc: '前提否定，则结论必须否定',
  },
  {
    fn: checkExistentialFallacy,
    desc: '两个全称前提得不出特称结论'
  }
]


export const runFallacyCheck = () => {
  const types = ['A', 'E', 'I', 'O']
  const figures = [1, 2, 3, 4]
  types.forEach(major => {
    types.forEach(minor => {
      types.forEach(conclusion => {
        figures.forEach(figure => {
          const mood = `${major}${minor}${conclusion}`
          let allpassed = true
          argumentAssert.forEach(({ fn, desc }) => {
            if (fn(mood as Mood, figure as Figure)) {
              allpassed = false
            }
          })
          if (allpassed) {
            console.log(mood, figure)
          }
        })
      })
    })
  })
}