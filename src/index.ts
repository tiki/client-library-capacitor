import Capture from './Capture'
import Auth from './Auth'
import License from './License'
import KeyService from './Key'

export default class TikiClient{
  private keyService = new KeyService()

  public capture = new Capture()
  public auth = new Auth(this.keyService)
  public license = new License()

  initialize(){}

  scan(){}
}
