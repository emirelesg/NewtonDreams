import {
  Color,
  Mesh,
  Group,
  CylinderBufferGeometry,
  Object3D,
  AxesHelper,
  MeshLambertMaterial,
  BoxBufferGeometry
} from 'three';

export class Base extends Object3D {

  private material: MeshLambertMaterial;

  private geometry: CylinderBufferGeometry;
  private body: Mesh;

  private linkGeometry: BoxBufferGeometry;
  private link: Mesh;

  private axes: AxesHelper;

  public obj = new Group();

  constructor(
    color: Color = new Color('rgb(120, 120, 120)')
  ) {

    super();

    this.rotateX(Math.PI / 2);

    this.material = new MeshLambertMaterial({ color });

    this.linkGeometry = new BoxBufferGeometry(1.5, 10, 1.5);
    this.link = new Mesh(this.linkGeometry, this.material);
    
    this.geometry = new CylinderBufferGeometry(3, 3, 2, 20, 10, false);
    this.body = new Mesh(this.geometry, this.material);

    this.axes = new AxesHelper(5);
    
    this.link.position.setY(this.linkGeometry.parameters.height / 2 + this.geometry.parameters.height);
    this.body.position.setY(this.geometry.parameters.height / 2);
    this.axes.position.setY(this.linkGeometry.parameters.height + this.geometry.parameters.height);

    this.add(this.body, this.link, this.axes);
  
  }
}
