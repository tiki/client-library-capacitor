interface PostLicenseRequest {
    ptr: string;
    tags: string[];
    uses: Use[];
    terms: string;
    expiry: string;
    titleDesc: string;
    licenseDesc: string;
  }
  
  interface License {
    id: string;
    title: Title;
    uses: Usecase[];
    terms: string;
    timestamp: string;
    description: string;
    expiry: string;
  }
  
  interface Use {
    usecases: Usecase[];
    destinations: string[];
  }
  
  interface Title {
    id: string;
    hashedPtr: string;
    tags: string[];
    timestamp: string;
    description: string;
  }
  
  interface Usecase {
    value: string;
  }
  
  interface RspLicenses {
    licenses: License[];
    requestId: string;
  }

  interface PostGuardRequest {
    ptr: string;
    uses: Use[];
  }
  
  interface RspGuard {
    success: boolean;
    reason: string;
  }