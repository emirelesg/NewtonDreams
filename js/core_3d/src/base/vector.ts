import {
  Vector3,
  Color,
  TextGeometry,
  Line,
  MeshBasicMaterial,
  Mesh,
  Camera,
  Object3D,
  BufferGeometry,
  BufferAttribute,
  CylinderBufferGeometry,
  MeshLambertMaterial,
  BoxBufferGeometry,
  Float32BufferAttribute,
  LineSegments,
  LineDashedMaterial
} from 'three';
import { Constants } from './constants';

interface HSL {
  h: number;
  s: number;
  l: number;
}

export class Vector extends Object3D {

  private static readonly CYLINDER_RADIUS = 0.1;
  private static readonly TIP_LENGTH = 3;
  private static readonly TIP_RADIUS = 0.75;
  private static readonly BOX_MARGIN = 0;

  private cylidnerGeometry: CylinderBufferGeometry;
  private cylinder: Mesh;

  private boxGeometry: BoxBufferGeometry;
  private box: Mesh;

  private lineGeometry: BufferGeometry;
  private line: Line;
  
  private tipGeometry: CylinderBufferGeometry;
  private tip: Mesh;
  
  private labelGeometry: TextGeometry;
  private label: Mesh;

  private componentsBoxGeometry: BufferGeometry;
  private componentsBox: LineSegments;
  
  private lambertMaterial: MeshLambertMaterial;
  private transparentMaterial: MeshBasicMaterial;
  private basicMaterial: MeshBasicMaterial;
  private dashedMaterial: LineDashedMaterial;

  private _value      = new Vector3();
  private _start      = new Vector3();
  private _direction  = new Vector3();
  private _length     = 0;
  private hsl: HSL    = {
    h: 0,
    s: 0,
    l: 0
  };

  public intersected: boolean = false;
  public selected: boolean = false;
  
  constructor(
    init: Vector3 = new Vector3(),
    public color: Color = new Color(`hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`),
    name: string = '',
    public thick: boolean = false
  ) {

    super();

    // Configure materials.
    this.lambertMaterial = new MeshLambertMaterial({ color });
    this.basicMaterial = new MeshBasicMaterial({ color });
    this.transparentMaterial = new MeshBasicMaterial({ color, opacity: 0.2, transparent: true });
    this.dashedMaterial = new LineDashedMaterial({
      color,
      linewidth: 1,
      scale: 1,
      dashSize: 1,
      gapSize: 0.5
    });

    // Configure tip.
    this.tipGeometry = this.updateTipGeometry();
    this.tip = new Mesh(this.tipGeometry, this.lambertMaterial);
    
    // Configure box. This is used for raycasting.
    this.boxGeometry = this.updateBoxGeometry();
    this.box = new Mesh(this.boxGeometry, this.transparentMaterial);
    
    // Configure line. Geometry has a buffer of two points.
    this.lineGeometry = new BufferGeometry();
    this.lineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(2 * 3), 3));
    this.line = new Line(this.lineGeometry, this.basicMaterial);
    
    // Configure label.
    this.labelGeometry = this.setLabel(name);
    this.label = new Mesh(this.labelGeometry, this.basicMaterial);
    this.label.onBeforeRender = (renderer: any, scene: any, camera: Camera) => {
      this.label.quaternion.copy(camera.quaternion);
    };

    // Configure cylinder.
    this.cylidnerGeometry = this.updateCylinderGeometry();
    this.cylinder = new Mesh(this.cylidnerGeometry, this.lambertMaterial);

    // Configure components.
    this.componentsBoxGeometry = new BufferGeometry();
    this.componentsBox = new LineSegments(this.componentsBoxGeometry, this.dashedMaterial);
    this.componentsBox.visible = false;

    // Add objects to the parent.
    this.add(this.tip, this.line, this.box, this.label, this.cylinder, this.componentsBox);

    // Set the vector's initial value.
    this.value = init;

  }

  private updateComponentsGeometry() {
    // Create an array with the vertices of the dashed cube.
    // The array is formed by pairs of vertices.
    const { x, y, z} = this._value;
    let vertices = [
      // Bottom face.
      0, 0, -z,
      0, -y, -z,

      0, -y, -z,   // This line segment lies on the -x axis.
      -x, -y, -z,

      -x, -y, -z,  // This line segment lies on the -y axis.
      -x, 0, -z,

      -x, 0, -z,
      0, 0, -z,

      // Top face.
      0, 0, 0,
      0, -y, 0,

      0, -y, 0,   // This line segment lies on the -x axis if z is 0.
      -x, -y, 0,

      -x, -y, 0,  // This line segment lies on the -y axis if z is 0.
      -x, 0, 0,

      -x, 0, 0,
      0, 0, 0,

      // Vertical lines
      0, 0, 0,
      0, 0, -z,

      -x, 0, 0,
      -x, 0, -z,

      0, -y, 0,
      0, -y, -z,

      // -x, -y, 0,   // This line segment lies on the -z axis.
      // -x, -y, -z,

    ];
    this.componentsBoxGeometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.componentsBox.computeLineDistances();
  }

  private updateLineGeometry() {
    this.lineGeometry.attributes.position.setXYZ(0, -this._value.x, -this._value.y, -this._value.z);
    (<any>this.lineGeometry.attributes.position).needsUpdate = true;
    this.lineGeometry.computeBoundingSphere();
  }

  private updateBoxGeometry() : BoxBufferGeometry {

    if (this.boxGeometry) this.boxGeometry.dispose();
    this.boxGeometry = new BoxBufferGeometry(
      1.5 + Vector.BOX_MARGIN,
      this.tipGeometry.parameters.height + Vector.BOX_MARGIN,
      1.5 + Vector.BOX_MARGIN
    );
    this.boxGeometry.translate(0, this.boxGeometry.parameters.height / 2, 0);
    if (this.box) this.box.geometry = this.boxGeometry;
    return this.boxGeometry;
  }

  private updateTipGeometry() : CylinderBufferGeometry {

    // When the tip length is longer than the vector's length,
    // make the tip length equal to the vector's length.
    // Scale the tip raidus proportional to the length.
    let l = Vector.TIP_LENGTH;
    let r = Vector.TIP_RADIUS;
    if (Vector.TIP_LENGTH >= this._length) {
      l = this._length;
      r = r * l / Vector.TIP_LENGTH;
    }
    const y0 = l / 2;

    if (this.tipGeometry) this.tipGeometry.dispose();
    this.tipGeometry = new CylinderBufferGeometry(r, 0, l, 10, 10, false);
    this.tipGeometry.translate(0, y0, 0);
    if (this.tip) this.tip.geometry = this.tipGeometry;
    return this.tipGeometry;

  }

  private updateCylinderGeometry() : CylinderBufferGeometry {

    // When the length is 0, hide the cylinder.
    const l = this._length - this.tipGeometry.parameters.height;
    const r = Vector.CYLINDER_RADIUS;
    const y0 = l > 0 ? (this._length + this.tipGeometry.parameters.height) / 2 : 0;

    if (this.cylidnerGeometry) this.cylidnerGeometry.dispose();
    this.cylidnerGeometry = new CylinderBufferGeometry(r, r, l, 5, 5, false);
    this.cylidnerGeometry.translate(0, y0, 0);
    if (this.cylinder) {
      this.cylinder.geometry = this.cylidnerGeometry;
      this.cylinder.visible = this._length > 0 && this.thick;
    }
    return this.cylidnerGeometry;

  }

  private updateCoords() {

    // The position of this object is the current (0, 0, 0) position for all child objects.
    // This means that the value of the vector is equal to the position - the start position.
    // The direction of this vector is obtained by normalizing the value vector.
    this._value.copy(this.position).sub(this._start);
    this._direction.copy(this._value).normalize();
    this._length = this._value.length();

    if (this._length > 0) {
   
      // Update geometries to match the new vector's length.
      this.updateTipGeometry();
      this.updateCylinderGeometry();
      this.updateBoxGeometry();
      this.updateLineGeometry();
      this.updateComponentsGeometry();
  
      // Orient the tip, cylinder and box to look at the origin.
      this.tip.lookAt(this._start);
      this.tip.rotateX(Math.PI / 2);
      this.cylinder.quaternion.copy(this.tip.quaternion);
      this.box.quaternion.copy(this.tip.quaternion);

      // Show vector.
      this.tip.visible = true;
      this.cylinder.visible = this.thick;
      this.line.visible = !this.thick;
      this.box.visible = true;
      
    } else {

      // Hide vector.
      this.tip.visible = false;
      this.cylinder.visible = false;
      this.line.visible = false;
      this.box.visible = false;
      
    }
    
  }

  public setLabel(label: string) : TextGeometry {

    // Sets the name of the current object.
    this.name = label;

    // Remove the previous geometry and mesh from memory and scene.
    if (this.labelGeometry) this.labelGeometry.dispose();

    // Create the text geometry for the label.
    this.labelGeometry = new TextGeometry(label, {
      font: Constants.FONT,
      height: 0, 
      size: 1.5,
      curveSegments: 2,
      bevelEnabled: false
    })
    this.labelGeometry.computeBoundingBox();
    this.labelGeometry.center();
    this.labelGeometry.translate(0, 0, 3);
    
    // Return geometry in order to set the initial value.
    if (this.label) this.label.geometry = this.labelGeometry;
    return this.labelGeometry;

  }

  get direction() : Vector3 { return this._direction.clone(); };
  get length() : number { return this._length }; 
  get value(): Vector3 { return this._value.clone(); }
  set value(value: Vector3) {
    this.position.copy(value).add(this._start);
    this.updateCoords();
  }
  get start(): Vector3 { return this._start.clone(); }
  set start(start: Vector3) {
    this._start.copy(start);
    this.position.copy(start).add(this._value);
    this.updateCoords();
  }
  get components() : boolean { return this.componentsBox.visible };
  set components(state: boolean) { this.componentsBox.visible = state; }

  public dispose() {
    // Delete geometries.
    this.tipGeometry.dispose();
    this.lineGeometry.dispose();
    this.boxGeometry.dispose();
    this.cylidnerGeometry.dispose();
    this.label.geometry.dispose();
    this.componentsBoxGeometry.dispose();
    // Delete materials.
    this.lambertMaterial.dispose();
    this.dashedMaterial.dispose();
    this.basicMaterial.dispose();
    this.transparentMaterial.dispose();
  }

  public showComponents(state: boolean) {
    this.componentsBox.visible = state;
  }

  public select(state: boolean) {
    this.selected = state;
    this.highlight(this.selected);
  }

  public highlight(state: boolean) {
    this.color.getHSL(this.hsl);
    if (state) {
      this.lambertMaterial.color.setHSL(this.hsl.h, this.hsl.s, this.hsl.l + 0.25);
      this.basicMaterial.color.copy(this.lambertMaterial.color);
    } else {
      this.lambertMaterial.color.setHSL(this.hsl.h, this.hsl.s, this.hsl.l);
      this.basicMaterial.color.copy(this.lambertMaterial.color);
    }
  }

}
