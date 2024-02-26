import Capture from './Capture'
import Auth from './Auth'
import License from './License'
import KeyService from './Key'
import type { Photo } from "@capacitor/camera"
import Utils from './utils'


export default class TikiClient{
  private keyService = new KeyService()
  private address: string = '';
  public capture = new Capture()
  public auth = new Auth(this.keyService)
  public license = new License()

  public async initialize(providerId: string, pubKey: string, userId: string){

    await this.keyService.clear()

    const keys = await this.keyService.get()

    if(keys.find((key)=> key.value.name === `${providerId}.${userId}`)) return 

    const address = await this.auth.registerAddress(providerId, pubKey, userId)

    this.address = address

  }

  public async scan(providerId: string, userId: string){
    
    const keys = await this.keyService.get()

    const key = keys.find((key)=> key.value.name === `${providerId}.${userId}`)

    const address = await Utils.generateSignature(this.address!, key?.value.privateKey!)

    const addressToken = await this.auth.getToken(providerId, address, [], this.address)
    if(!addressToken) throw new Error('Error to get Address Token')

    const sampleGuardRequest = {
      ptr: "example-ptr",
      uses: [
        {
          usecases: [{ value: "usecase1" }, { value: "usecase2" }],
          destinations: ["destination1", "destination2"]
        },
        {
          usecases: [{ value: "usecase3" }],
          destinations: ["destination3"]
        }
      ],
    }
    const verifyLicense = await this.license.guard(sampleGuardRequest, addressToken!)

    if(!verifyLicense) throw new Error('Unverified License')

    let photos: Photo[] = []
    
    photos.push(await this.capture.scan())

    await this.capture.publish(photos)
  }
}
