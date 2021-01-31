const fragShader = `

precision mediump float;
uniform vec2  resolution;
uniform float tx;
uniform float ty;
uniform float r;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
vec3 makeCircle(vec2 st,vec2 center, vec3 col){
	float d = distance(st,center);
	float pct = smoothstep(r,r+0.1,d);
	vec3 v = vec3(1.0-pct)*col;
	return clamp(v, 0.1, 1.0);
}
void main(void) {
	vec4 color = texture2D(uMainSampler, outTexCoord);
	gl_FragColor = color*vec4(makeCircle(outTexCoord,vec2(tx,ty),vec3(1.0)),1.0);
}
`;
export default class SpotlightPostFX extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
	constructor(game) {
		super({
			game,
			renderTarget: true,
			fragShader,
			uniforms: ["uProjectionMatrix", "uMainSampler", "tx", "ty", "r"],
		});
	}

	onPreRender() {}
}
