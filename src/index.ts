import Capture from './Capture'
import Auth from './Auth'
import License from './License'
import KeyService from './Key'

export default class TikiClient{
  private keyService = new KeyService()

  public capture = new Capture()
  public auth = new Auth(this.keyService)
  public license = new License()

  initialize(providerId: string, userId: string, token: string){
    // pegar private key pelo {providerId}.${userId}
    // se não existir gera uma nova
    // registra o endereço
  }

  scan(){
    // get address token
    // verifica licença (sem licença não cria)
    // chama o get photo
    // chama o publish
  }
}
