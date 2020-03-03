
import {
  Vector3, Color
} from 'three';
import { App } from 'lib/app';
import { Vector } from "lib/base/vector";
import { Button } from 'lib/dom/Button';
import { DomElement } from 'lib/dom/DomElement';
import { InputNumber } from 'lib/dom/Input';

interface Controls {
  add: Button;
  remove: Button;
  vectors: VectorControl
}

class VectorControl extends DomElement {

  private x: InputNumber;
  private y: InputNumber;
  private z: InputNumber;
  private vector: Vector|undefined;

  constructor(
    id: string,
    private _onChangeCallback: Function
  ) {
    super(id, false);
    this.x = new InputNumber('x', this.onChange.bind(this));
    this.y = new InputNumber('y', this.onChange.bind(this));
    this.z = new InputNumber('z', this.onChange.bind(this));
  }

  onChange() {
    if (this.vector) {
      this.vector.value = new Vector3(
        this.x.value,
        this.y.value,
        this.z.value
      )
      this._onChangeCallback();
    }
  }

  set(vec: Vector, enabled: boolean = true) {
    this.vector = vec;
    this.obj.style.backgroundColor = `#${vec.lineMaterial.color.getHexString()}`;
    this.x.enable(enabled);
    this.x.set(vec.value.x);
    this.y.enable(enabled);
    this.y.set(vec.value.y);
    this.z.enable(enabled);
    this.z.set(vec.value.z);
  }

}

class Sim {

  public w: App;
  public resultant: Vector = new Vector(new Vector3(), new Color('rgb(0, 100, 255)'), 'r');
  public vectors: Vector[] = [
    new Vector(new Vector3(20, 20, 0))
  ];
  public controls: Controls;

  constructor() {

    this.w = new App({
      onRender: this.draw.bind(this),
      onClick: this.onClick.bind(this),
      debug: false
    });

    this.controls = {
      add: new Button('add-btn', this.addVector.bind(this)),
      remove: new Button('remove-btn', this.removeVector.bind(this), false),
      vectors: new VectorControl('input-div', this.updateVectors.bind(this))
    }
    
    // Select the initial vector.
    if (this.vectors.length) {
      this.vectors[0].select(true);
      this.controls.vectors.set(this.vectors[0]);
    }

    this.w.add(this.vectors);
    this.w.add(this.resultant);
    this.w.render();

  }


  addVector() {

    // New vector created.
    // Select the new vector.
    const v =  new Vector(
      new Vector3(10, 10, 0)
    );
    v.select(true);
    this.controls.vectors.set(v);
    
    // Add vector at the end or after selected vector.
    // By default append it to the end.
    let idx = this.vectors.length;
    const selected = this.vectors.find(v => v.selected);
    if (selected) idx = this.vectors.indexOf(selected) + 1;

    // Update the origins of the vectors.
    // Add vector to the world.
    this.vectors.splice(idx, 0, v);
    this.updateVectors();
    this.w.add(v);
    
  }

  removeVector() {
    
    // Remove the currently selected vector from world and vectors array.
    // Update the vectors.
    const selected = this.vectors.find(v => v.selected);
    if (selected) {
      const idx = this.vectors.indexOf(selected);
      this.vectors.splice(idx, 1);
      this.w.remove(selected);
      this.updateVectors();
    }

  }

  updateVectors() {
    
    // Position the vectors in addition mode: one after the other.
    this.vectors.forEach((v, i) => {
      if (i > 0) {
        v.start = this.vectors[i - 1].position;
      } else {
        v.start = new Vector3(0, 0, 0);
      }
      v.updateCoords();
    });
    
    // Calculate the resultant vector if two or more vectors are present.
    if (this.vectors.length > 1) {
      let lastVector = this.vectors[this.vectors.length - 1];
      this.resultant.value = lastVector.start.add(lastVector.value);
    } else {
      this.resultant.value = new Vector3();
    }

  }

  onClick() {

    // Raycast the current position of the mouse.
    this.draw();

    // Check if the resultant was clicked and select it.
    if (this.resultant.intersected) {

      // Select the resultant and deselect all other vectors.
      // Sets the input window to the resultant in disabled mode.
      this.resultant.select(true);
      this.controls.vectors.set(this.resultant, false);
      this.vectors.forEach(v => v.select(false));

    } else {

      this.resultant.select(false);

      // Check if a vector was clicked and select it.
      this.vectors.forEach(v => {
        if (v.intersected) {
          v.select(true);
          this.controls.vectors.set(v);
        } else {
          v.select(false);
        }
      });

    }

  }

  draw() {

    
    // Find if the mouse is over a vector.
    const raycaster = this.w.raycaster;   
    const vectorIntersection = this.vectors.some(v => v.intersect(raycaster));
    const resultantIntersection = this.resultant.intersect(raycaster);
    this.w.setCursor(resultantIntersection || vectorIntersection ? 'pointer' : 'default');

    // Define when a control is active.
    const anySelected = this.vectors.some(v => v.selected) || this.resultant.selected;
    this.controls.add.enable(true);
    this.controls.remove.enable(anySelected && !this.resultant.selected);
    this.controls.vectors.display(anySelected);
    
  }

}

(<any>window).s = new Sim();