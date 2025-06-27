uniform float u_flatness;
uniform float u_scanline_height; // Não usado, mas deixado para consistência
uniform float u_screen_height; // Não usado, mas deixado para consistência

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec2 center = vec2(0.5, 0.5);
	vec2 off_center = uv - center;
	off_center *= 1.0 + pow(abs(off_center.yx), vec2(u_flatness));
	vec2 uv2 = center + off_center;

	if(uv2.x > 1.0 || uv2.x < 0.0 || uv2.y > 1.0 || uv2.y < 0.0) {
		return vec4(0.0, 0.0, 0.0, 1.0);
	} else {
		vec4 c = vec4(texture2D(tex, uv2).rgb, 1.0);

		float fx = fract(uv2.x * 120.0);
		fx = min(1.0, 0.8 + 0.5 * min(fx, 1.0 - fx));

		float fy = fract(uv2.y * 120.0);
		fy = min(1.0, 0.8 + 0.5 * min(fy, 1.0 - fy));

		c.rgb *= fx * fy;

		return c;
	}
}
