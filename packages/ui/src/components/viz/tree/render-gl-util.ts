import { EDGE_DIM_BIT } from './render-gl-shaders';
import {
  EDGE_ORDER,
  EDGE_QUIET,
  NODE_DIM,
  type TreeEmphasis,
  type TreeGeometry,
} from './render-types';

export function program(
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string
): WebGLProgram {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Tree shader: could not create');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(`Tree shader: ${gl.getShaderInfoLog(shader)}`);
    return shader;
  };
  const p = gl.createProgram();
  if (!p) throw new Error('Tree program: could not create');
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error(`Tree program: ${gl.getProgramInfoLog(p)}`);
  return p;
}

/** A unit quad at attribute 0, shared by every instance. */
export function quad(gl: WebGL2RenderingContext, corners: number[]) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}

/** A per-instance attribute in the bound buffer. */
export function instanced(
  gl: WebGL2RenderingContext,
  location: number,
  size: number,
  stride: number,
  offset: number
) {
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
  gl.vertexAttribDivisor(location, 1);
}

/** Per square: x, y, size, tone, flags. */
export function nodeInstances(g: TreeGeometry, emphasis: TreeEmphasis | null) {
  const n = g.x.length;
  const out = new Float32Array(n * 5);
  for (let i = 0; i < n; i++) {
    const o = i * 5;
    out[o] = g.x[i] as number;
    out[o + 1] = g.y[i] as number;
    out[o + 2] = g.size[i] as number;
    out[o + 3] = g.tone[i] as number;
    out[o + 4] = emphasis?.node[i] ?? 0;
  }
  return out;
}

/** Per edge: both ends and its style, quiet first so lit ones draw on top. */
export function edgeInstances(g: TreeGeometry, emphasis: TreeEmphasis | null) {
  const m = g.edgeFrom.length;
  const styleOf = (k: number) => emphasis?.edge[k] ?? EDGE_QUIET;
  const flag = (i: number) => emphasis?.node[i] ?? 0;
  const order: number[] = [];
  for (const wanted of EDGE_ORDER)
    for (let k = 0; k < m; k++) if (styleOf(k) === wanted) order.push(k);
  const out = new Float32Array(order.length * 5);
  order.forEach((k, j) => {
    const a = g.edgeFrom[k] as number;
    const b = g.edgeTo[k] as number;
    const o = j * 5;
    out[o] = g.x[a] as number;
    out[o + 1] = g.y[a] as number;
    out[o + 2] = g.x[b] as number;
    out[o + 3] = g.y[b] as number;
    const dim = flag(a) & NODE_DIM && flag(b) & NODE_DIM;
    out[o + 4] = styleOf(k) | (dim ? EDGE_DIM_BIT : 0);
  });
  return { data: out, count: order.length };
}
