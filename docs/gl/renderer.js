import { WebGLRenderer } from "three";
export default class Renderer extends WebGLRenderer {
  constructor(props) {
    super(props);
  }

  onResize(width, height) {
    this.setSize(width, height);
    this.setPixelRatio(window.devicePixelRatio);
  }
}
