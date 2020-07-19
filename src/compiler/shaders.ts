const glsl = (x: any) => x as string

export const defaultVertexShaderSource = glsl`
precision mediump float;
attribute vec3 a_position;
uniform mat4 mvp;
varying vec2 v_texcoord;

void main() {
  v_texcoord = vec2(a_position.x, a_position.y);
  gl_Position = mvp * vec4(a_position.xy, 0, 1);
}
`

export const defaultFragmentShaderSource = glsl`
precision mediump float;

varying vec2 v_texcoord;

uniform float time;
uniform vec2 resolution;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

void main(void) {
    vec2 uv = -1. + 2. * v_texcoord;
    gl_FragColor = vec4(
        abs(sin(cos(time+3.*uv.y)*2.*uv.x+time)),
        abs(cos(sin(time+2.*uv.x)*3.*uv.y+time)),
        0.0,
        1.0);
}
`

export const defaultFragmentShaderChainPassSource = glsl`
#version 150

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D prevFrame;
uniform sampler2D prevPass;

in VertexData
{
    vec4 v_position;
    vec3 v_normal;
    vec2 v_texcoord;
} inData;

out vec4 fragColor;

void main(void)
{
    fragColor = texture(prevPass,inData.v_texcoord);
}
`
