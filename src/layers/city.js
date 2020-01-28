import BaseLayer from './baseLayer'
import  { addLayerGroup} from './common'
export default class CityLayerGroup extends BaseLayer {

  addLayers() {
    this.layers = new addLayerGroup(this.scene, this.data,this.pointData);
  }
  removeLayers() {
    this.layers.forEach(element => {
      this.scene.removeLayer(element);
    });
  }
  
}