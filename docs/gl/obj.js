import {
  Mesh,
  BoxGeometry,
  DoubleSide,
  RawShaderMaterial,
  InstancedBufferGeometry,
  InstancedBufferAttribute,
} from "three";

import vs from "./shader.vert";
import fs from "./shader.frag";
import gsap from "gsap";
const size = 10;
const margin = 50;

const getAttribute = (_num) => {
  const num = _num * _num * _num;
  const offsetPos = new InstancedBufferAttribute(new Float32Array(num * 3), 3);
  const offsetPos1 = new InstancedBufferAttribute(new Float32Array(num * 3), 3);
  const offsetPos2 = new InstancedBufferAttribute(new Float32Array(num * 3), 3);
  const id = new InstancedBufferAttribute(new Float32Array(num * 1), 1);

  [...Array(num)].forEach((_, i) => {
    //立方体
    const z = Math.floor(i / (_num * _num)) - Math.floor(_num * 0.5);
    const y = (Math.floor(i / _num) % _num) - Math.floor(_num * 0.5);
    const x = i - Math.floor(i / _num) * _num - Math.floor(_num * 0.5);
    offsetPos.setXYZ(i, x, y, z);
    //球
    const r = (i % num) / num;
    const r2 = ((i % _num) * 3) / (_num * 3);
    offsetPos1.setXYZ(
      i,
      Math.sin(r * Math.PI * 2) * Math.cos(r2 * Math.PI * 2) * size,
      Math.sin(r * Math.PI * 2) * Math.sin(r2 * Math.PI * 2) * size,
      Math.cos(r * Math.PI * 2) * size
    );

    offsetPos2.setXYZ(
      i,
      (Math.random() * 2 - 1.0) * size,
      (Math.random() * 2 - 1.0) * size,
      (Math.random() * 2 - 1.0) * size
    );
    id.setX(i, i);
  });

  return [offsetPos, offsetPos1, offsetPos2, id];
};

const getGeometry = (num) => {
  const originBox = new BoxGeometry(size, size, size);
  const g = new InstancedBufferGeometry();
  g.index = originBox.index;
  g.attributes = originBox.attributes;
  const [offsetPos, offsetPos1, offsetPos2, id] = getAttribute(num);
  g.setAttribute("offsetPos", offsetPos);
  g.setAttribute("offsetPos1", offsetPos1);
  g.setAttribute("offsetPos2", offsetPos2);
  g.setAttribute("id", id);
  console.log(id);

  return g;
};
export default class Plane extends Mesh {
  constructor(_num, gui) {
    const originBox = new BoxGeometry(size, size, size);
    const g = getGeometry(_num);

    const m = new RawShaderMaterial({
      fragmentShader: fs,
      vertexShader: vs,
      uniforms: {
        uTime: {
          value: 0,
        },
        size: {
          value: size,
        },
        margin: {
          value: margin,
        },
        pattarn: {
          value: 0,
        },
        num: {
          value: _num * _num * _num,
        },
      },
      side: DoubleSide,
    });
    super(g, m);

    this.frustumCulled = true;

    this.debug(gui, _num);
  }

  //gui
  debug(gui, num) {
    const obj = {
      size,
      margin,
      num,
      primitive: "box",
    };

    const step = {
      size: [0, 50, 1],
      margin: [0, 100, 1],
      num: [0, 100, 1],
      primitive: [["box", "sphere", "random"]],
    };

    Object.keys(obj).forEach((key) => {
      gui.add(obj, key, ...step[key]);
    });

    gui.onChange(({ property, value }) => {
      if (property == "size" || property == "margin") {
        this.material.uniforms[property].value = value;
      } else if (property == "num") {
        this.geometry.dispose();
        this.geometry = getGeometry(value);
        this.material.uniforms.num.value = value * value * value;
      } else if (property == "primitive") {
        gsap.to(this.material.uniforms.pattarn, {
          value: value == "box" ? 0 : value == "sphere" ? 1 : 2,
          ease: "expo.out",
        });
      }
    });
  }

  update() {
    this.rotation.y += 0.01;
    this.rotation.x += 0.01;
  }
}
