import { computed } from 'vue'
import { language } from '@/shared/translate'

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
    key: 'UNDISTRIBUTE_MIDDLE',
  },
  {
    fn: checkIllicitProcess,
    key: 'ILLICIT_PROCESS',
  },
  {
    fn: checkTwoNegativePremises,
    key: 'TWO_NEGATIVE',
  },
  {
    fn: checkNegativeConclusion,
    key: 'NEGATIVE_CONCLUSION',
  },
  {
    fn: checkExistentialFallacy,
    key: 'EXISTENTIAL'
  }
]


export const fallacyExplains = computed<Record<string, { name: string, detail: string }>>(() => {
  return {
    UNDISTRIBUTE_MIDDLE: {
      name: language.value === 'zh' ? '中项不周延谬误' : 'fallacy of the undistributed middle',
      detail: language.value === 'zh'
        ? '中项至少在一个前提中周延；如果中项在两个前提中都不周延，推出结论所需要的词项关联就不能建立。'
        : 'Distribute the middle term in at least one premise. If the middle term is not distributed in at least one premise, the connection required by the conclusion cannot be made.',
    },
    ILLICIT_PROCESS: {
      name: language.value === 'zh' ? '不当周延谬误' : 'fallacy of illicit process',
      detail: language.value === 'zh'
        ? '在结论中周延的项在前提中也必须周延。述及一个类的全部对象，比述及其中某些对象要断定更多。所以如果三段论前提中不周延的项在结论中周延，也就是结论断定了比前提更多的东西，结论超出了前提。'
        : `To refer to all members of a class is to say more about that class than is said when
        only some of its members are referred to. Therefore, when the conclusion of a syllogism
        distributes a term that was undistributed in the premises, it says more about
        that term than the premises did.`,
    },
    TWO_NEGATIVE: {
      name: language.value === 'zh' ? '排斥前提谬误' : 'fallacy of exclusive premises',
      detail: language.value === 'zh'
        ? '避免出现两个否定前提。任何否定命题都否认类的包含关系，断定一个类的部分或者全部被排除在另一类的全体之外。但是，有两个断定这种排斥性的前提不能得出结论中的联系，因此不可能是有效的论证。'
        : `Any negative proposition (E or O) denies class inclusion; it asserts that some or all of
        one class is excluded from the whole of the other class. Two premises asserting
        such exclusion cannot yield the linkage that the conclusion asserts, and therefore
        cannot yield a valid argument.`,
    },
    NEGATIVE_CONCLUSION: {
      name: language.value === 'zh' ? '从否定推肯定谬误' : 'fallacy of drawing an affirmative conclusion from a negative premise',
      detail: language.value === 'zh'
        ? '如果结论是肯定的，也就是说，如果它断定两个类的一个完全或部分地包含在另一个之中，那么，前提必须断定这样的第三个类存在才能推出结论，即第三个类必须包含第一个并且被第二个包含，而类之间的这种包含关系只能由肯定命题表示。所以，肯定的结论只能由两个肯定的前提得到。'
        : `If the conclusion is affirmative—that is, if it asserts that one of the two classes, S or P,
        is wholly or partly contained in the other—it can only be inferred from premises that assert
        the existence of a third class that contains the first and is itself contained in the
        second. However, class inclusion can be stated only by affirmative propositions.
        Therefore, an affirmative conclusion can follow validly only from two affirmative premises.`,
    },
    EXISTENTIAL: {
      name: language.value === 'zh' ? '存在谬误' : 'existential fallacy',
      detail: language.value === 'zh'
        ? '在直言三段论的布尔解释中，全程命题没有存在含义，但特称命题却有存在含义。避免从没有存在含义的前提得出有存在含义的结论。'
        : `In the Boolean interpretation of categorical propositions, universal propositions
        (A and E) have no existential import, but particular propositions (I and O) do have
        such import.`,
    }
  }
})


// export const runFallacyCheck = () => {
//   const types = ['A', 'E', 'I', 'O']
//   const figures = [1, 2, 3, 4]
//   types.forEach(major => {
//     types.forEach(minor => {
//       types.forEach(conclusion => {
//         figures.forEach(figure => {
//           const mood = `${major}${minor}${conclusion}`
//           let allpassed = true
//           argumentAssert.forEach(({ fn, desc }) => {
//             if (fn(mood as Mood, figure as Figure)) {
//               allpassed = false
//             }
//           })
//           if (allpassed) {
//             console.log(mood, figure)
//           }
//         })
//       })
//     })
//   })
// }