
import {
  Vector3, Color
} from 'three';
import { App } from 'lib/app';
import { Vector } from 'lib/base/vector';
import { Options } from 'lib/dom/Options';
import { DomElement } from 'lib/dom/DomElement';
import { InputNumber } from 'lib/dom/Input';
import { Option } from 'lib/dom/Option';
import { VectorAngle } from 'lib/base/vectorAngle';

interface Controls {
  vectors: VectorControl,
  operation: Options
}

class VectorControl extends DomElement {

  private x: InputNumber;
  private y: InputNumber;
  private z: InputNumber;
  private components: Option;
  private vector: Vector|undefined;
  private vectorLabel: DomElement;

  constructor(
    id: string,
    private _onChangeCallback: Function
  ) {
    super(id, false);
    this.vectorLabel = new DomElement('vector-label');
    this.x = new InputNumber('x', this.onChange.bind(this));
    this.y = new InputNumber('y', this.onChange.bind(this));
    this.z = new InputNumber('z', this.onChange.bind(this));
    this.components = new Option('components', this.onChange.bind(this));
  }

  onChange() {
    if (this.vector) {
      this.vector.value = new Vector3(
        this.x.value,
        this.y.value,
        this.z.value
      )
      this.vector.components = this.components.value;
      this._onChangeCallback();
    }
  }

  set(vec: Vector, enabled: boolean = true) {
    this.vector = vec;
    this.vectorLabel.obj.style.color = `#${vec.color.getHexString()}`;
    this.vectorLabel.obj.innerHTML = `${vec.name}`
    this.x.enable(enabled);
    this.x.set(vec.value.x);
    this.y.enable(enabled);
    this.y.set(vec.value.y);
    this.z.enable(enabled);
    this.z.set(vec.value.z);
    this.components.set(vec.components);
  }

}

class Sim {

  public w: App;
  public controls: Controls;
  public vectorA = new Vector(new Vector3(20, 10, 0), new Color('rgb(220, 53, 69)'), 'A', true);
  public vectorB = new Vector(new Vector3(10, 20, 0), new Color('rgb(0, 100, 255)'), 'B', true);
  public vectorR = new Vector(new Vector3(0, 0, 0), new Color('rgb(40, 167, 69)'), 'R', true);
  public vectors : Vector[];
  public angle = new VectorAngle();

  constructor() {

    this.w = new App({
      onRender: this.draw.bind(this),
      onClick: this.onClick.bind(this),
      debug: false,
      cameraPosition: new Vector3(50, 50, 20)
    });

    this.controls = {
      vectors: new VectorControl('input-div', this.updateVectors.bind(this)),
      operation: new Options('operation', this.updateVectors.bind(this))
    }

    // Add vectors to world and configure initial interface state.
    this.vectors = [this.vectorA, this.vectorB, this.vectorR];
    this.vectorA.select(true);
    this.controls.vectors.set(this.vectorA);
    this.w.add(this.vectors);
    this.w.add(this.angle);
    this.updateVectors();

    this.w.render();

  }

  updateVectors() {

    // Hide resultant if any vector is 0 or no operation is being calculated.
    this.vectorR.visible = 
      this.vectorA.length > 0 &&
      this.vectorB.length > 0 && 
      this.controls.operation.value !== 'none';

    // Show angle if no operation is calculated.
    this.angle.visible = this.controls.operation.value === 'none';
    if (this.angle.visible) this.angle.between(this.vectorA, this.vectorB);
    
    // Toggle between the selected operations.
    switch(this.controls.operation.value) {
      case 'a-b': {
        this.vectorR.value = this.vectorA.value.sub(this.vectorB.value);
        break;
      }
      case 'b-a': {
        this.vectorR.value = this.vectorB.value.sub(this.vectorA.value);
        break;
      }
      case 'axb': {
        this.vectorR.value = this.vectorA.value.cross(this.vectorB.value);
        break;
      }
      case 'a+b': {
        this.vectorR.value = this.vectorA.value.add(this.vectorB.value);
        break;
      }
      case 'none': {
        this.vectorR.selected = false;
      }
    }

  }

  onClick() {

    // Raycast the current position of the mouse.
    this.draw();

    // Select the currently intersected vector.
    this.vectors.forEach(v => {
      if (v.intersected) {
        v.select(true);
        this.controls.vectors.set(v, v.uuid !== this.vectorR.uuid);
      } else {
        v.select(false);
      }
    });

  }

  draw() {

    // Find if the mouse is over a vector.
    const raycaster = this.w.raycaster; 
    const intersections = raycaster.intersectObjects(this.vectors, true);
    this.vectors.forEach(v => {
      if (intersections.length > 0) {
        v.intersected = (<Vector>intersections[0].object.parent).uuid === v.uuid;
      } else {
        v.intersected = false;
      }
      v.highlight(v.intersected || v.selected);
    })

    // Change the cursor to a pointer if the mouse is over a vector.
    this.w.setCursor(intersections.length > 0 ? 'pointer' : 'default');

    // Define when a control is active.
    this.controls.vectors.display(this.vectors.some(v => v.selected));
    
  }

}

(<any>window).s = new Sim();