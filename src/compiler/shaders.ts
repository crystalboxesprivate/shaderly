const glsl = (x: any) => x as string;

const vert = glsl`
#version 150

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;
uniform mat4 mvp;

in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

out VertexData
{
    vec4 v_position;
    vec3 v_normal;
    vec2 v_texcoord;
} outData;

void main(void)
{
    gl_Position = mvp * a_position;

    outData.v_position = a_position;
    outData.v_normal = a_normal;
    outData.v_texcoord = a_texcoord;
}
`

const frag = glsl`
#version 150

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
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
    vec2 uv = -1. + 2. * inData.v_texcoord;
    fragColor = vec4(
        abs(sin(cos(time+3.*uv.y)*2.*uv.x+time)),
        abs(cos(sin(time+2.*uv.x)*3.*uv.y+time)),
        spectrum.x * 100.,
        1.0);
}
`;