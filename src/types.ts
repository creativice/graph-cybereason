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

export type Sensor = {
  sensorId: string;
  pylumId: string;
  guid: string;
  fqdn: string;
  machineName: string;
  internalIpAddress: string;
  externalIpAddress: string;
  siteName: string; // Unclear
  siteId: string; // Unclear
  ransomwareStatus: string;
  preventionStatus: string;
  isolated: boolean;
  disconnectionTime: number;
  lastPylumInfoMsgUpdateTime: number;
  status: string;
  onlineTimeMS: number;
  offlineTimeMS: number;
  staleTimeMS: number;
  archiveTimeMS: number;
  statusTimeMS: number;
  lastStatusAction: string;
  archivedOrUnarchiveComment: string;
  sensorArchivedByUser: string;
  serverName: string;
  serverId: string;
  osType: string;
  osVersionType: string;
  collectionStatus: string;
  version: string;
  firstSeenTime: number;
  upTime: number;
  cpuUsage: number;
  memoryUsage: number;
  outdated: boolean;
  amStatus: string;
  powerShellStatus: string;
  antiMalwareStatus: string;
  organization: string;
  proxyAddress: string; // Unclear
  preventionError: string; // Unclear
  exitReason: string;
  actionsInProgess: number;
  pendingActions: number; // Unclear
  lastUpgradeResult: string; // Unclear
  lastUpgradeSteps: string; // Unclear
  disconnected: boolean;
  sensorLastUpdate: number;
  fullScanStatus: string;
  quickScanStatus: string;
  lastFullScheduleScanSuccessTime: number;
  lastQuickScheduleScanSuccessTime: number;
};
