type SimpleMalopFeature = {
  totalValues: number;
  values: Array<string> | null;
};

type ElementMalopFeature = {
  totalValues: number;
  elementValues: Array<{
    elementType: string;
    guid: string;
    name: string;
    hasSuspicions: boolean;
    hasMalops: boolean;
  }>;
  totalSuspicious: number;
  totalMalicious: number;
};

export type Malop = {
  simpleValues: {
    hasRansomwareSuspendedProcesses: SimpleMalopFeature;
    decisionFeature: SimpleMalopFeature;
    rootCauseElementCompanyProduct: SimpleMalopFeature;
    malopStartTime: SimpleMalopFeature;
    detectionType: SimpleMalopFeature;
    malopActivityTypes: SimpleMalopFeature;
    elementDisplayName: SimpleMalopFeature;
    creationTime: SimpleMalopFeature;
    isBlocked: SimpleMalopFeature;
    rootCauseElementTypes: SimpleMalopFeature;
    rootCauseElementNames: SimpleMalopFeature;
    malopLastUpdateTime: SimpleMalopFeature;
    allRansomwareProcessesSuspended: SimpleMalopFeature;
    rootCauseElementHashes: SimpleMalopFeature;
    managementStatus: SimpleMalopFeature;
    closeTime: SimpleMalopFeature;
    closerName: SimpleMalopFeature;
    customClassification: SimpleMalopFeature;
  };
  elementValues: {
    affectedUsers: ElementMalopFeature;
    affectedMachines: ElementMalopFeature;
  };
  suspicions: null; // Unclear
  filterData: {
    sortInGroupValue: string;
    groupByValue: string;
  };
  isMalicious: boolean;
  suspicionCount: number;
  guidString: string;
  labelsIds: Array<string> | null;
  malopPriority: null; // Unclear
};
