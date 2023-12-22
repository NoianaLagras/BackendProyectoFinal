import { cartsManager} from '../dao/Mongo/manager/carts.dao'

export default class cartRepository{
constructor(){
this.dao= new cartsManager();
}
}