import {Use} from './'

export interface PostLicenseRequest {
    ptr: string
    tags: string[]
    uses: Use[]
    terms: string
    licenseDesc: string
    expiry?: string
    titleDesc?: string
    userSignature?: string
}



  