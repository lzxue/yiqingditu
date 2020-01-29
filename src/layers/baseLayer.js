import { addLayerGroup } from './common'
export  default class BaseLayer {
  constructor(scene, data, pointData) {
    this.scene =scene;
    this.data =data;
    this.pointData = pointData;
    this.addLayers();
    this.addLayerEvent();
  }

  hide() {
    this.layers.forEach(element => {
      element.hide();
      
    });
  }

  show() {
    this.layers.forEach(element => {
      element.show();
      
    });
    this.layers[0].fitBounds();
  }
  addLayers() {
    this.layers = new addLayerGroup(this.scene, this.data,this.pointData);
  }
  removeLayers() {
    this.layers.forEach(element => {
      this.scene.removeLayer(element);
    });
  }
  addLayerEvent() {

  }
  destroy() {
    this.removeLayers();
    this.scene.render();
    this.layers = [];
    this.data =[];
    this.pointData=[];
  }
}
