import {Use} from './'

export interface PostLicenseRequest {
    ptr: string
    tags: string[]
    uses: Use[]
    terms: string
    description: string
    origin: string
    expiry?: string
    signature?: string
}



  