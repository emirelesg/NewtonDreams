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
  Raycaster,
  BoxBufferGeometry
} from 'three';
import { Constants } from './constants';

interface HSL {
  h: number;
  s: number;
  l: number;
}

export class Vector extends Object3D {

  private boxGeometry: BoxBufferGeometry;
  private lineGeometry: BufferGeometry;
  private tipGeometry: CylinderBufferGeometry;
  private line: Line;
  private label: Mesh;
  private box: Mesh;
  private boxMaterial: MeshBasicMaterial;
  private tipMaterial: MeshLambertMaterial;
  private _value      = new Vector3();
  private _start      = new Vector3();
  private _direction  = new Vector3();
  private hsl: HSL    = {
    h: 0,
    s: 0,
    l: 0
  };

  // Public
  public tip: Mesh;
  public lineMaterial: MeshBasicMaterial;
  public intersected: boolean = false;
  public selected: boolean = false;
  
  constructor(
    init: Vector3 = new Vector3(),
    color: Color = new Color(`hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`),
    label: string = ''
  ) {

    super();

    // Init material.
    color.getHSL(this.hsl);
    
    // Configure tip.
    this.tipGeometry = new CylinderBufferGeometry(0.75, 0, 3, 10, 10, false);
    this.tipMaterial = new MeshLambertMaterial({ color });
    this.tip = new Mesh(this.tipGeometry, this.tipMaterial);
    this.tip.castShadow = true;
    this.tip.receiveShadow = true;
    this.add(this.tip);
    
    // Configure box. This is used for raycasting.
    this.boxGeometry = new BoxBufferGeometry(1.5 + 0.2, 3 + 0.2, 1.5 + 0.2);
    this.boxMaterial = new MeshBasicMaterial({ color, opacity: 0.2, transparent: true });
    this.box = new Mesh(this.boxGeometry, this.boxMaterial);
    
    // Configure line. Geometry has a buffer of two points.
    this.lineGeometry = new BufferGeometry();
    this.lineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(2 * 3), 3));
    this.lineMaterial = new MeshBasicMaterial({ color });
    this.line = new Line(this.lineGeometry, this.lineMaterial);
    this.add(this.line, this.box);

    // Configure label.
    this.label = this.setLabel(label);

    // Set the vector's initial value.
    this.value = init;

  }

  public setLabel(label: string) : Mesh {

    // Remove the previous geometry and mesh from memory and scene.
    if (this.label) {
      this.remove(this.label);
      this.label.geometry.dispose();
    }

    // Create the text geometry for the label.
    let geometry = new TextGeometry(label, {
      font: Constants.FONT,
      height: 0, 
      size: 2,
      curveSegments: 2,
      bevelEnabled: false
    });
    geometry.computeBoundingBox();
    geometry.center();

    // Create mesh and set a callback for orienting the label to the camera.
    this.label = new Mesh(geometry, this.lineMaterial);
    this.label.onBeforeRender = (renderer: any, scene: any, camera: Camera) => {
      this.label.quaternion.copy(camera.quaternion);
    };
    this.add(this.label);

    return this.label;

  }

  get direction() : Vector3 { return this._direction.clone(); };

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

  public dispose() {
    // Delete geometries.
    this.tipGeometry.dispose();
    this.lineGeometry.dispose();
    this.boxGeometry.dispose();
    this.label.geometry.dispose();
    // Delete materials.
    this.tipMaterial.dispose();
    this.lineMaterial.dispose();
    this.boxMaterial.dispose();
  }

  public select(state: boolean) {
    this.selected = state;
    this.highlight(this.selected);
  }

  public intersect(raycaster: Raycaster) : boolean {

    // Try to intersect with the tip of the vector.
    let intersects = raycaster.intersectObject(this.box);

    if (intersects.length > 0) {
      // First time being intersected.
      // Increase the luma color to simulate it is highlighted.
      if (!this.intersected) {
        this.intersected = true;
        this.highlight(true);
      }
    } else {
      // Restore color if it was highlighted.
      if (this.intersected) {
        this.intersected = false;
        this.highlight(this.selected);
      }
    }

    return this.intersected;

  }

  public highlight(state: boolean) {
    if (state) {
      this.tipMaterial.color.setHSL(this.hsl.h, this.hsl.s, this.hsl.l + 0.25);
      this.lineMaterial.color.copy(this.tipMaterial.color);
    } else {
      this.tipMaterial.color.setHSL(this.hsl.h, this.hsl.s, this.hsl.l);
      this.lineMaterial.color.copy(this.tipMaterial.color);
    }
  }

  public updateCoords() {

    // The position of this object is the current (0, 0, 0) position for all child objects.
    // This means that the value of the vector is equal to the position - the start position.
    this._value.copy(this.position).sub(this._start);

    // The direction of this vector is obtained by normalizing the value vector.
    this._direction.copy(this._value).normalize();

    // Update the line geometry to the value vector.
    this.lineGeometry.attributes.position.setXYZ(0, -this._value.x, -this._value.y, -this._value.z);
    (<any>this.lineGeometry.attributes.position).needsUpdate = true;
    this.lineGeometry.computeBoundingSphere();

    // Move the tip so that it points ot the (0, 0, 0) position.
    this.tip.position.copy(this._direction).multiplyScalar(-this.tipGeometry.parameters.height / 2);
    this.tip.lookAt(this._start);
    this.tip.rotateX(Math.PI / 2);
    
    // Move the target box to be inside the tip.
    this.box.position.copy(this.tip.position);
    this.box.rotation.copy(this.tip.rotation);
    
    // Place the text in front of the vector.
    this.label.position.copy(this._direction).multiplyScalar(2);
    
    // Hide or show.
    this.visible = this._value.lengthSq() > 0;
  }

}
