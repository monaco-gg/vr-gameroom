uniform float u_flatness;
uniform float u_scanline_height;
uniform float u_screen_height;
uniform float u_time;
uniform float u_heat_intensity;
uniform float u_movement_intensity;  // Novo uniforme para controlar a intensidade do movimento

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 pos) {
    vec2 i = floor(pos);
    vec2 f = fract(pos);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), f.x),
               mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), f.x), f.y);
}

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    vec2 center = vec2(0.5, 0.5);
    vec2 off_center = uv - center;
    off_center *= 1.0 + pow(abs(off_center.yx), vec2(u_flatness));

    // Adiciona distorção de calor
    vec2 heat_uv = uv + vec2(noise(uv * 10.0 + u_time) - 0.5, noise(uv * 10.0 - u_time) - 0.5) * u_heat_intensity;

    // Adiciona movimento à textura
    vec2 movement_uv = heat_uv + vec2(sin(u_time * 2.0) * u_movement_intensity, cos(u_time * 2.0) * u_movement_intensity);

    vec2 uv2 = center + off_center;
    if (uv2.x > 1.0 || uv2.x < 0.0 || uv2.y > 1.0 || uv2.y < 0.0) {
        return vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        vec4 c = vec4(texture2D(tex, movement_uv).rgb, 1.0);
        float fv = fract(uv2.y * 160.0);
        fv = min(1.0, 0.8 + 0.5 * min(fv, 1.0 - fv));
        c.rgb *= fv;
        return c;
    }
}
