const fragShader = `
#define SHADER_NAME BLUR_FS
precision mediump float;
//"in" attributes from our vertex shader
varying vec2 outTexCoord;
//declare uniforms
uniform sampler2D uMainSampler;
uniform vec2 dist;
uniform float ray;
uniform vec2 center;

void main()
{
	vec2 tc = outTexCoord;
	float distance = sqrt(pow(tc.x - center.x, 2.0) + pow(tc.y - center.y, 2.0));
	//our original texcoord for this fragment
	//this will be our RGBA sum
	vec4 sum = texture2D(uMainSampler, vec2(tc.x, tc.y));

	//apply blurring, using a 9-tap filter with predefined gaussian weights. Lol, gaussian weights go brrrrrr
	sum += texture2D(uMainSampler, vec2(tc.x - dist.x, tc.y));
	sum += texture2D(uMainSampler, vec2(tc.x + dist.x, tc.y));
	sum += texture2D(uMainSampler, vec2(tc.x, tc.y - dist.y));
	sum += texture2D(uMainSampler, vec2(tc.x, tc.y + dist.y));
	sum += texture2D(uMainSampler, vec2(tc.x - dist.x, tc.y - dist.y));
	sum += texture2D(uMainSampler, vec2(tc.x - dist.x, tc.y + dist.y));
	sum += texture2D(uMainSampler, vec2(tc.x + dist.x, tc.y - dist.y));
	sum += texture2D(uMainSampler, vec2(tc.x + dist.x, tc.y + dist.y));

	sum /= 9.0;
	//discard alpha for our simple demo,return
	gl_FragColor =  vec4(sum.rgb, 1.0);
}
`;

export default class BlurPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
	constructor(game) {
		super({
			game,
			renderTarget: true,
			fragShader,
			uniforms: ["uProjectionMatrix", "uMainSampler", "dist"],
		});
	}

	onPreRender() {
		this._dist = 2.5;
		this.set2f("dist", this._dist / this.renderer.width, this._dist / this.renderer.height);
	}

	get dist() {
		return this._dist;
	}

	set dist(value) {
		this._dist = value;
		this.set2f("dist", value / this.renderer.width, value / this.renderer.height);
	}
}
