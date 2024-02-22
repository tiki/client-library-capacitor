import Capture from './Capture';
import Auth from './Auth'
import License from './License';
export default class TikiClient{
  

  public Capture = new Capture();
  public Auth = new Auth()
  public License = new License()
}
