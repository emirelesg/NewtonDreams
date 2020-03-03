import {
  Vector3,
  GridHelper,
  Object3D,
  Mesh,
  Camera,
  TextGeometry,
  MeshBasicMaterial
} from 'three';

import { Vector } from './vector';
import { Constants } from './constants';

export class Axis extends Object3D {

  private grid: GridHelper;
  
  private x: Vector;
  private xUnits: Mesh[];
  private y: Vector;
  private yUnits: Mesh[];
  private z: Vector;
  private zUnits: Mesh[];

  private fontMaterial: MeshBasicMaterial;
  
  constructor() {

    super();

    const k = Constants.AXIS_SIZE;

    // Configure font for units.
    this.fontMaterial = new MeshBasicMaterial({ color: Constants.AXIS_UNITS_COLOR });

    // Configure grid.
    this.grid = new GridHelper(k, 50, Constants.AXIS_COLOR, Constants.AXIS_GRID_COLOR);
    (<any>this.grid.material).opacity = Constants.AXIS_GRID_OPACITY;
    (<any>this.grid.material).transparent = true;
    this.grid.rotateX(Math.PI / 2);
      
    // Configure vectors.
    this.x = new Vector(new Vector3(k, 0, 0), Constants.AXIS_COLOR, 'x');
    this.x.start = new Vector3(-k / 2, 0, 0);
    this.xUnits = this.createUnits(this.x);
    
    this.y = new Vector(new Vector3(0, k, 0), Constants.AXIS_COLOR, 'y');
    this.y.start = new Vector3(0, -k / 2, 0);
    this.yUnits = this.createUnits(this.y);

    this.z = new Vector(new Vector3(0, 0, k), Constants.AXIS_COLOR, 'z');
    this.z.start = new Vector3(0, 0, -k / 2);
    this.zUnits = this.createUnits(this.z);

    this.add(this.x, this.y, this.z, this.grid); 

  }

  update(camera: Camera) {

    // Update the position of the labels to look at the camera.
    this.xUnits.forEach(v => v.quaternion.copy(camera.quaternion));
    this.yUnits.forEach(v => v.quaternion.copy(camera.quaternion));
    this.zUnits.forEach(v => v.quaternion.copy(camera.quaternion));

  }

  createUnits(v : Vector ) : Mesh[] {

    // Calculate the change in position for every unit.
    // This will create a vector that changes in the vector's direction.
    let unitStep = v.value.clone().divideScalar(Constants.AXIS_UNITS_STEP);

    // Contains the current unit position.
    let unitPosition = v.start.clone();

    // Array with the unit meshes.
    let units = new Array();

    for (let i = 0; i < Constants.AXIS_UNITS_STEP; i++) {

      // Calculate the value of the unit.
      // This is the distance from the origin to the unit position.
      // The sign of the position is given by the dot product of the cunit position and the vector.
      let sign = unitPosition.clone().dot(v.value) >= 0 ? 1 : -1;
      let positionChange = unitPosition.clone().length() * sign;

      // Do not plot the unit 0.
      if (positionChange !== 0) {

        // Create the text geometry.
        let geometry = new TextGeometry(`${positionChange}`, {
          font: Constants.FONT,
          height: 0, 
          size: 1.5,
          curveSegments: 2,
          bevelEnabled: false
        });
        geometry.computeBoundingBox();
        geometry.center();
        const label = new Mesh(geometry, this.fontMaterial);
        label.position.copy(unitPosition);
        units.push(label);
        this.add(label);
      }
        
      // Calculate the next text position.
      unitPosition.add(unitStep);

    }

    return units;

  }

}


/*

// private plane: Mesh;
// private planeGeometry: PlaneBufferGeometry;
// private planeMaterial: ShadowMaterial; 

// private canvas = document.getElementById('text-canvas') as HTMLCanvasElement;
// private ctx: CanvasRenderingContext2D;

// Draw text on a canvas.
drawFont() : Mesh {
  const textHeight = 18;
  const text = 'x';
  this.ctx.font = `${textHeight}pt sans-serif`;
  const textWidth = this.ctx.measureText(text).width;
  const canvasWidth = Math.floor(textWidth) + 10;
  const canvasHeight = textHeight + 10;
  const pxRatio = 10;
  const rescale = 1 / 1;
  this.resize(canvasWidth, canvasHeight, pxRatio);
  this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  this.ctx.font = `${textHeight}pt sans-serif`;
  this.ctx.fillStyle = 'rgb(255, 255, 255)';
  this.ctx.textBaseline = 'middle';
  this.ctx.textAlign = 'center';
  this.ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
  const texture = new CanvasTexture(this.canvas);
  texture.magFilter = NearestFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  const geometry = new PlaneGeometry(canvasWidth / 10, canvasHeight / 10, 1, 1)
  const material = new MeshLambertMaterial({ 
    map: texture, 
    side: DoubleSide,
    transparent: true,
    color: new Color('rgb(180,180,180)')
  });
  const cube = new Mesh(geometry, material);
  cube.rotateX(Math.PI / 2);
  cube.rotateY(Math.PI / 2);
  cube.position.set(50, 5, 2);
  cube.scale.set(rescale, rescale, rescale)
  return cube;
}

// Configure plane.
// this.planeGeometry = new PlaneBufferGeometry(k, k);
// this.planeMaterial = new ShadowMaterial({ opacity: 0.2 });
// this.plane = new Mesh(this.planeGeometry, this.planeMaterial);
// this.plane.receiveShadow = true;
// this.plane.rotateX(-Math.PI / 2);
// this.plane.position.y = 0;
// this.add(this.plane);

*/