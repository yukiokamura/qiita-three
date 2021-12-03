precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec3 offsetPos;
attribute vec3 offsetPos1;
attribute vec3 offsetPos2;
attribute vec2 uv;
attribute float id;

uniform float uTime;
uniform float size;
uniform float pattarn;
uniform float margin;
uniform float num;

const float PI = 3.14159265359;

varying float color;


void main() {

  // vUv =  uv;

  vec3 pos = position;
  
  vec3 changePos = mix(offsetPos,offsetPos1,clamp(pattarn,0.0,1.0));
  changePos = mix(changePos,offsetPos2,clamp(pattarn - 1.0,0.0,1.0));
  changePos *=  margin;
  pos.xyz *= 0.1 * size;
  pos += changePos;
  color = id  / num;
  vec4 projected = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projected;

  

  
}
