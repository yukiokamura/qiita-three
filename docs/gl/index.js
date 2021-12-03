import * as THREE from "three";
import Camera from "./camera";
import Renderer from "./renderer";
import Plane from "./obj";
export default class GL {
  constructor(wrap, gui) {
    this.wrap = wrap;
    this.gui = gui;
    this.setup();
  }

  setup() {
    this.camera = new Camera();
    this.renderer = new Renderer({
      canvas: this.wrap.querySelector("canvas"),
      antialias: true,
      alpha: true,
    });
    this.scene = new THREE.Scene();

    this.plane = new Plane(10, this.gui);
    this.scene.add(this.plane);
    this.onResize(window.innerWidth, window.innerHeight);
  }

  onResize(w, h) {
    this.camera.onResize(w, h);
    this.renderer.onResize(w, h);
  }

  update() {
    this.plane.update();
    this.renderer.render(this.scene, this.camera);
  }

  destory() {
    this.renderer.dispose();
  }
}
