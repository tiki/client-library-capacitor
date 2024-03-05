import {Use} from './'

export interface PostLicenseRequest {
    ptr: string
    tags: string[]
    uses: Use[]
    terms: string
    expiry?: string
    titleDesc?: string
    licenseDesc: string
}



  