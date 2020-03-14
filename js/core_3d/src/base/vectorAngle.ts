import {
  Object3D,
  Mesh,
  CircleBufferGeometry,
  Color,
  DoubleSide,
  Vector3,
  TextGeometry,
  Camera,
  MeshBasicMaterial
} from 'three';
import { Vector } from './vector';
import { Constants } from './constants';

export class VectorAngle extends Object3D {

  private circle : Mesh;
  private circleGeoemetry : CircleBufferGeometry;
  
  private angleGeometry : TextGeometry;
  private angle : Mesh;
  
  private basicMaterial : MeshBasicMaterial;
  private transparentMaterial: MeshBasicMaterial;

  constructor() {
    super();

    // Configure materials.
    this.transparentMaterial = new MeshBasicMaterial({
      color: new Color('rgb(255, 150, 7)'),
      opacity: 0.25,
      transparent: true,
      side: DoubleSide
    });
    this.basicMaterial = new MeshBasicMaterial({
      color: new Color('rgb(255, 150, 7)'),
      side: DoubleSide
    });
    
    // Configure plane.
    this.circleGeoemetry = new CircleBufferGeometry(5, 32);
    this.circle = new Mesh(this.circleGeoemetry, this.transparentMaterial);

    // Configure Angle label.
    this.angleGeometry = this.setAngle('label');
    this.angle = new Mesh(this.angleGeometry, this.basicMaterial);
    this.angle.onBeforeRender = (renderer: any, scene: any, camera: Camera) => {
      // Undo the orientation transform from the circle.
      this.angle.quaternion.copy(this.circle.quaternion).inverse();
      // Apply the camera transform to look at the camera.
      this.angle.quaternion.multiply(camera.quaternion);
    };
    
    this.circle.add(this.angle);
    this.add(this.circle);

  }

  private setAngle(label: string) : TextGeometry {

    if (this.angleGeometry) this.angleGeometry.dispose();
    this.angleGeometry = new TextGeometry(label, {
      font: Constants.FONT,
      height: 0, 
      size: 1.5,
      curveSegments: 2,
      bevelEnabled: false
    });
    this.angleGeometry.computeBoundingBox();
    this.angleGeometry.center();
    if (this.angle) this.angle.geometry = this.angleGeometry;
    return this.angleGeometry;

  }

  between(a: Vector, b: Vector) {

    // Calculate the angle between vectors and set label.
    const angle = a.value.angleTo(b.value);
    const label = `${Math.round(angle * 180 / Math.PI * 10) / 10}°`;
    this.setAngle(label);

    // Set the visibility of the object.
    this.visible = a.length > 0 && b.length > 0 && angle > 0;
    if (!this.visible) return;

    // Create the geometry that extends between A and B.
    this.circleGeoemetry.dispose();
    this.circleGeoemetry = new CircleBufferGeometry(
      5,
      32,
      0,
      angle
    );
    this.circle.geometry = this.circleGeoemetry;

    // Rotate the circle to be between vectors A and B.
    let normal = a.value.cross(b.value).normalize();
    if (normal.lengthSq() === 0) {
      
      // Since the cross product is 0, the vectors are parallel. This means that
      // the angle between them is either 0 or 180.
      this.circle.lookAt(a.value);
      this.circle.rotateY(Math.PI / 2);
      this.circle.rotateX(Math.PI / 2);
            
    } else {
      
      // By setting the up direction to the A vector, the -x direction of the circle
      // is aligned to A, when looking at the normal vector.
      this.circle.up.copy(a.value.normalize());
      this.circle.lookAt(normal);
      this.circle.rotateZ(Math.PI / 2);
    }

    // Set the box in the middle of the circle.
    const position = new Vector3(Math.cos(angle / 2), Math.sin(angle / 2), 0).multiplyScalar(this.circleGeoemetry.parameters.radius + 2);
    this.angle.position.copy(position);
    
  }

}