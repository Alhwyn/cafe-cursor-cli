export type CreditStatus = "available" | "redeemed" | "unknown";

export interface CreditTestCase {
  url: string;
  expected: CreditStatus;
  description?: string;
}

export const givenReferral = (url: string) => ({
  shouldBe: (status: CreditStatus, description?: string): CreditTestCase => ({
    url,
    expected: status,
    description: description ?? `${extractCode(url) ?? url} is ${status}`,
  }),
});

function extractCode(url: string): string | null {
  const match = url.match(/code=([A-Z0-9]+)/i);
  return match?.[1] ?? null;
}

export function toStatus(result: {
  available: boolean;
  redeemed?: boolean;
  unknown?: boolean;
}): CreditStatus {
  if (result.available) return "available";
  if (result.redeemed) return "redeemed";
  return "unknown";
}

export interface PersonData {
  firstName: string;
  lastName: string;
  email: string;
  linkedin?: string;
  twitter?: string;
  drink?: string;
  food?: string;
  workingOn?: string;
}

export interface PersonTestCase {
  action: "add" | "update" | "markSent";
  person: PersonData;
  existingPeople?: PersonData[];
  expected: {
    added?: boolean;
    skipped?: boolean;
    updated?: boolean;
    totalPeople?: number;
  };
}

export const addingPerson = (person: PersonData) => ({
  toEmptyStorage: () => ({
    shouldSucceed: (): PersonTestCase => ({
      action: "add",
      person,
      existingPeople: [],
      expected: { added: true, skipped: false, totalPeople: 1 },
    }),
  }),
  whenExists: (existingPeople: PersonData[]) => ({
    shouldBeSkipped: (): PersonTestCase => ({
      action: "add",
      person,
      existingPeople,
      expected: { added: false, skipped: true },
    }),
    shouldSucceed: (): PersonTestCase => ({
      action: "add",
      person,
      existingPeople,
      expected: { added: true, skipped: false, totalPeople: existingPeople.length + 1 },
    }),
  }),
});

export interface CreditData {
  url: string;
  code: string;
  amount: number;
}

export interface CreditStorageTestCase {
  action: "add" | "assign" | "getNext";
  credit?: CreditData;
  existingCredits?: Array<CreditData & { available?: boolean; assignedTo?: string }>;
  assignTo?: string;
  expected: {
    added?: boolean;
    assigned?: boolean;
    nextCredit?: CreditData | null;
    availableCount?: number;
  };
}

export const addingCredit = (credit: CreditData) => ({
  toEmptyStorage: () => ({
    shouldSucceed: (): CreditStorageTestCase => ({
      action: "add",
      credit,
      existingCredits: [],
      expected: { added: true },
    }),
  }),
  whenExists: (existingCredits: Array<CreditData & { available?: boolean }>) => ({
    shouldBeSkipped: (): CreditStorageTestCase => ({
      action: "add",
      credit,
      existingCredits,
      expected: { added: false },
    }),
    shouldSucceed: (): CreditStorageTestCase => ({
      action: "add",
      credit,
      existingCredits,
      expected: { added: true },
    }),
  }),
});

export const gettingNextAvailableCredit = () => ({
  from: (credits: Array<CreditData & { available?: boolean; assignedTo?: string }>) => ({
    shouldReturn: (expected: Partial<CreditData> | null): CreditStorageTestCase => ({
      action: "getNext",
      existingCredits: credits,
      expected: {
        nextCredit: expected as CreditData | null,
      },
    }),
  }),
  fromEmptyStorage: () => ({
    shouldReturnNull: (): CreditStorageTestCase => ({
      action: "getNext",
      existingCredits: [],
      expected: { nextCredit: null },
    }),
  }),
});

export interface TallyTestCase {
  credits: Array<CreditData & { available?: boolean; assignedTo?: string }>;
  expected: {
    total: number;
    available: number;
    count: { total: number; available: number; sent: number };
  };
}

export const tallyingCredits = (
  credits: Array<CreditData & { available?: boolean; assignedTo?: string }>
) => ({
  shouldEqual: (expected: TallyTestCase["expected"]): TallyTestCase => ({
    credits,
    expected,
  }),
});

export interface UrlExtractionTestCase {
  content: string;
  expected: string[];
}

export const extractingUrlsFrom = (content: string) => ({
  shouldFind: (urls: string[]): UrlExtractionTestCase => ({
    content,
    expected: urls,
  }),
  shouldFindNothing: (): UrlExtractionTestCase => ({
    content,
    expected: [],
  }),
});

export const referralUrl = (code: string): string =>
  `https://cursor.com/referral?code=${code}`;

export const person = (
  firstName: string,
  lastName: string,
  email: string,
  extras?: Partial<PersonData>
): PersonData => ({
  firstName,
  lastName,
  email,
  ...extras,
});

export const credit = (code: string, amount: number = 20): CreditData => ({
  url: referralUrl(code),
  code,
  amount,
});

export const scenario = (name: string) => {
  const builder = {
    given: (_desc: string) => builder,
    when: (_desc: string) => builder,
    then: (_desc: string) => builder,
    and: (_desc: string) => builder,
    build: () => ({ name }),
  };
  return builder;
};
