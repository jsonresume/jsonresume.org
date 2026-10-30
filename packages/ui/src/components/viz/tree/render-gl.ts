import { EDGE_FS, EDGE_VS, NODE_FS, NODE_VS } from './render-gl-shaders';
import {
  edgeInstances,
  instanced,
  nodeInstances,
  program,
  quad,
} from './render-gl-util';
import {
  sizeCanvas,
  type TreeEmphasis,
  type TreeFrame,
  type TreeGeometry,
  type TreePalette,
  type TreeRenderer,
} from './render-types';

/**
 * WebGL2: every square and every edge in one instanced call each, so a frame
 * costs the same for ten nodes or a hundred thousand.
 */
export class GlRenderer implements TreeRenderer {
  readonly kind = 'webgl2' as const;
  private readonly gl: WebGL2RenderingContext;
  private readonly nodeProgram: WebGLProgram;
  private readonly edgeProgram: WebGLProgram;
  private readonly nodeVao: WebGLVertexArrayObject;
  private readonly edgeVao: WebGLVertexArrayObject;
  private readonly nodeBuffer: WebGLBuffer;
  private readonly edgeBuffer: WebGLBuffer;
  private readonly uniforms = new Map<string, WebGLUniformLocation | null>();
  private geometry: TreeGeometry | null = null;
  private emphasis: TreeEmphasis | null = null;
  private palette: TreePalette | null = null;
  private nodeCount = 0;
  private edgeCount = 0;
  private dirty = true;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      premultipliedAlpha: true,
      alpha: true,
      depth: false,
      stencil: false,
    });
    if (!gl) throw new Error('WebGL2 is not available');
    this.gl = gl;
    this.nodeProgram = program(gl, NODE_VS, NODE_FS);
    this.edgeProgram = program(gl, EDGE_VS, EDGE_FS);
    const nodeBuffer = gl.createBuffer();
    const edgeBuffer = gl.createBuffer();
    const nodeVao = gl.createVertexArray();
    const edgeVao = gl.createVertexArray();
    if (!nodeBuffer || !edgeBuffer || !nodeVao || !edgeVao)
      throw new Error('WebGL2 buffers are not available');
    this.nodeBuffer = nodeBuffer;
    this.edgeBuffer = edgeBuffer;
    this.nodeVao = nodeVao;
    this.edgeVao = edgeVao;

    const stride = 5 * 4;
    gl.bindVertexArray(nodeVao);
    quad(gl, [-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, nodeBuffer);
    instanced(gl, 1, 2, stride, 0);
    instanced(gl, 2, 1, stride, 8);
    instanced(gl, 3, 1, stride, 12);
    instanced(gl, 4, 1, stride, 16);

    gl.bindVertexArray(edgeVao);
    quad(gl, [0, -1, 1, -1, 0, 1, 1, 1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, edgeBuffer);
    instanced(gl, 1, 4, stride, 0);
    instanced(gl, 2, 1, stride, 16);
    gl.bindVertexArray(null);
  }

  private uniform(p: WebGLProgram, name: string) {
    const key = `${p === this.nodeProgram ? 'n' : 'e'}:${name}`;
    if (!this.uniforms.has(key))
      this.uniforms.set(key, this.gl.getUniformLocation(p, name));
    return this.uniforms.get(key) ?? null;
  }

  setGeometry(geometry: TreeGeometry) {
    this.geometry = geometry;
    this.dirty = true;
  }

  setEmphasis(emphasis: TreeEmphasis) {
    this.emphasis = emphasis;
    this.dirty = true;
  }

  setPalette(palette: TreePalette) {
    this.palette = palette;
  }

  private upload() {
    const g = this.geometry;
    if (!g) return;
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nodeBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      nodeInstances(g, this.emphasis),
      gl.DYNAMIC_DRAW
    );
    this.nodeCount = g.x.length;
    const edges = edgeInstances(g, this.emphasis);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, edges.data, gl.DYNAMIC_DRAW);
    this.edgeCount = edges.count;
    this.dirty = false;
  }

  draw(frame: TreeFrame) {
    const gl = this.gl;
    if (gl.isContextLost()) return;
    const { w, h } = sizeCanvas(this.canvas, frame.viewport, frame.dpr);
    if (this.dirty) this.upload();
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const p = this.palette;
    if (!p || !this.nodeCount) return;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const { camera: c, viewport: v } = frame;
    const camera = (prog: WebGLProgram) => {
      gl.uniform2f(this.uniform(prog, 'uCam'), c.x, c.y);
      gl.uniform1f(this.uniform(prog, 'uK'), c.k);
      gl.uniform2f(this.uniform(prog, 'uView'), v.width, v.height);
      gl.uniform1f(this.uniform(prog, 'uDim'), frame.dim);
    };

    const edges = this.edgeProgram;
    gl.useProgram(edges);
    camera(edges);
    gl.uniform3fv(this.uniform(edges, 'uInk'), p.ink);
    gl.uniform3fv(this.uniform(edges, 'uMuted'), p.muted);
    gl.uniform1f(this.uniform(edges, 'uQuiet'), frame.quiet);
    gl.bindVertexArray(this.edgeVao);
    if (this.edgeCount)
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.edgeCount);

    const nodes = this.nodeProgram;
    gl.useProgram(nodes);
    camera(nodes);
    gl.uniform1f(this.uniform(nodes, 'uMinPx'), frame.minPx);
    gl.uniform1f(this.uniform(nodes, 'uMaxPx'), frame.maxPx);
    gl.uniform1f(this.uniform(nodes, 'uTime'), frame.time);
    const colours: [string, number[]][] = [
      ['uBg', p.bg],
      ['uInk', p.ink],
      ['uMuted', p.muted],
      ['uBorder', p.border],
      ['uSuccess', p.success],
      ['uDanger', p.danger],
      ['uWarning', p.warning],
    ];
    for (const [name, value] of colours)
      gl.uniform3fv(this.uniform(nodes, name), value);
    gl.bindVertexArray(this.nodeVao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.nodeCount);
    gl.bindVertexArray(null);
  }

  dispose() {
    const gl = this.gl;
    gl.deleteBuffer(this.nodeBuffer);
    gl.deleteBuffer(this.edgeBuffer);
    gl.deleteVertexArray(this.nodeVao);
    gl.deleteVertexArray(this.edgeVao);
    gl.deleteProgram(this.nodeProgram);
    gl.deleteProgram(this.edgeProgram);
  }
}
