/* GLSL for the WebGL2 renderer: instanced squares and instanced edges. */

export const NODE_VS = `#version 300 es
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec2 aPos;
layout(location = 2) in float aSize;
layout(location = 3) in float aTone;
layout(location = 4) in float aFlag;
uniform vec2 uCam;
uniform float uK;
uniform vec2 uView;
uniform float uMinPx;
uniform float uMaxPx;
out vec2 vLocal;
out float vHalf;
flat out int vTone;
flat out int vFlag;
void main() {
  if ((int(aFlag + 0.5) & 2) != 0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vLocal = vec2(0.0);
    vHalf = 0.0;
    vTone = 0;
    vFlag = 0;
    return;
  }
  float half_ = clamp(aSize * uK, uMinPx, uMaxPx) * 0.5;
  vec2 local = aCorner * (half_ + 5.0);
  vec2 screen = (aPos - uCam) * uK + uView * 0.5 + local;
  vec2 clip = screen / uView * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  vLocal = local;
  vHalf = half_;
  vTone = int(aTone + 0.5);
  vFlag = int(aFlag + 0.5);
}`;

export const NODE_FS = `#version 300 es
precision highp float;
in vec2 vLocal;
in float vHalf;
flat in int vTone;
flat in int vFlag;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uMuted;
uniform vec3 uBorder;
uniform vec3 uSuccess;
uniform vec3 uDanger;
uniform vec3 uWarning;
uniform float uTime;
uniform float uDim;
out vec4 outColor;
float box(vec2 p, float h, float r) {
  vec2 q = abs(p) - vec2(h - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
vec4 pm(vec3 c, float a) { return vec4(c * a, a); }
vec4 over(vec4 top, vec4 under) { return top + under * (1.0 - top.a); }
void main() {
  float d = box(vLocal, vHalf, min(vHalf * 0.2, 1.5));
  float inside = clamp(0.5 - d, 0.0, 1.0);
  float line = clamp(vHalf * 0.3, 0.75, 1.25);
  float border = clamp(line * 0.5 + 0.5 - abs(d + line * 0.5), 0.0, 1.0) * inside;
  float diagonal = (vLocal.x + vLocal.y) * 0.70710678;
  vec4 c;
  if (vTone == 1 || vTone == 2) {
    c = pm(vTone == 1 ? uSuccess : uDanger, inside);
  } else {
    c = pm(uBg, inside);
    if (vTone == 3) c = over(pm(uWarning, step(0.5, fract(diagonal / 4.0)) * inside), c);
    if (vTone == 4) c = over(pm(uMuted, step(0.5, fract((diagonal - uTime * 5.3) / 4.243)) * inside), c);
    if (vTone == 5) c = over(pm(uSuccess, step(0.32 * vHalf, vLocal.x + vLocal.y) * inside), c);
    vec3 stroke = vTone == 3 ? uWarning : vTone == 4 ? uInk : uBorder;
    c = over(pm(stroke, border), c);
  }
  if ((vFlag & 4) != 0) c = over(pm(uInk, clamp(1.25 - abs(d - 3.0), 0.0, 1.0)), c);
  else if ((vFlag & 8) != 0) c = over(pm(uInk, 0.7 * clamp(1.0 - abs(d - 2.5), 0.0, 1.0)), c);
  if ((vFlag & 1) != 0) c *= uDim;
  outColor = c;
}`;

export const EDGE_VS = `#version 300 es
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aSeg;
layout(location = 2) in float aStyle;
uniform vec2 uCam;
uniform float uK;
uniform vec2 uView;
out float vAcross;
out float vHalfWidth;
out float vFade;
flat out int vStyle;
void main() {
  vec2 a = (aSeg.xy - uCam) * uK + uView * 0.5;
  vec2 b = (aSeg.zw - uCam) * uK + uView * 0.5;
  int style = int(aStyle + 0.5) & 3;
  // A quiet line with neither end on screen is only noise crossing the view.
  vec2 margin = vec2(48.0);
  bool aOn = all(greaterThan(a, -margin)) && all(lessThan(a, uView + margin));
  bool bOn = all(greaterThan(b, -margin)) && all(lessThan(b, uView + margin));
  if (style == 0 && !aOn && !bOn) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    vAcross = 0.0;
    vHalfWidth = 0.0;
    vFade = 0.0;
    vStyle = 0;
    return;
  }
  float width = style == 1 ? 1.5 : style == 3 ? 1.25 : 1.0;
  float extent = width * 0.5 + 1.0;
  vec2 dir = b - a;
  float len = max(length(dir), 1e-4);
  // Long quiet lines fade, so the short local ones carry the picture.
  vFade = style == 0 ? clamp(420.0 / len, 0.25, 1.0) : 1.0;
  vec2 normal = vec2(-dir.y, dir.x) / len;
  vec2 p = mix(a, b, aCorner.x) + normal * aCorner.y * extent;
  vec2 clip = p / uView * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  vAcross = aCorner.y * extent;
  vHalfWidth = width * 0.5;
  vStyle = int(aStyle + 0.5);
}`;

export const EDGE_FS = `#version 300 es
precision highp float;
in float vAcross;
in float vHalfWidth;
in float vFade;
flat in int vStyle;
uniform vec3 uInk;
uniform vec3 uMuted;
uniform float uQuiet;
uniform float uDim;
out vec4 outColor;
void main() {
  int style = vStyle & 3;
  float cover = clamp(vHalfWidth + 0.5 - abs(vAcross), 0.0, 1.0);
  float alpha = style == 1 ? 0.7 : style == 3 ? 0.45 : style == 2 ? 0.5 : uQuiet;
  if ((vStyle & 8) != 0) alpha *= uDim;
  alpha *= vFade;
  vec3 colour = style == 2 ? uMuted : uInk;
  outColor = vec4(colour * cover * alpha, cover * alpha);
}`;

/** Edge style bit set when both ends of the edge are dimmed. */
export const EDGE_DIM_BIT = 8;
