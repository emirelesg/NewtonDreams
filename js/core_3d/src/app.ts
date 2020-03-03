import {
  PerspectiveCamera,
  Scene,
  Vector3,
  Vector2,
  WebGLRenderer,
  Raycaster,
  AmbientLight,
  PointLight,
  Color,
} from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Axis } from './base/axis';
import { Constants } from './base/constants';
import { isArray, isObject, isFunction } from 'util';
import { Switch, Button } from './dom/Button';

interface Buttons {
  zoomIn: Button;
  zoomOut: Button;
  fullscreen: Switch;
  rotate: Switch
};

interface Options {
  onRender?: Function;
  onClick?: Function;
  onMove?: Function;
  cameraPosition: Vector3;
  background: Color;
  debug: Boolean;
}

interface Mouse {
  pos: Vector2;
  norm: Vector2;
}

export class App {

  // Private
  private readonly container      = document.getElementById('sim') as HTMLDivElement;
  private readonly canvas         = document.getElementById('main-canvas') as HTMLCanvasElement;
  private readonly initialHeight  = this.container.style.height;
  private readonly scene          = new Scene();
  private readonly camera         = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  private readonly light          = new PointLight(0xFFFFFF, 0.75, 100);
  private readonly axis           = new Axis();
  private readonly renderer       = new WebGLRenderer({
    antialias: true,
    canvas: this.canvas
  });
  private readonly footer: HTMLElement|undefined;
  private readonly controls: OrbitControls;
  private readonly stats: Stats;
  private readonly options: Options;
  private readonly buttons: Buttons;
  private readonly _raycaster = new Raycaster();

  // Public
  public mouse: Mouse = {
    pos: new Vector2(),
    norm: new Vector2()
  };
  public size = new Vector2();

  constructor(options: Partial<Options> = {}) {

    // Set any options from the user.
    this.options = {
      cameraPosition: new Vector3(30, 30, 5),
      background: Constants.SCENE_BG_COLOR,
      debug: false
    };
    Object.assign(this.options, options);

    // Get the footer element by its tag.
    const footers = document.getElementsByTagName('footer');
    if (footers.length) {
      this.footer = footers[0];
    }
    
    // Configure the initial position of the camera.
    // The controls must be initialized after the camera position.
    this.camera.position.copy(this.options.cameraPosition)
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(new Vector3(0, 0, 0));
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene.background = this.options.background;
    this.renderer.shadowMap.enabled = false;
    this.light.castShadow = true;
    
    // Stats.
    // Sets the css properties in order for the div to stay inside of the container.
    this.stats = Stats();
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.top = 'auto';
    this.stats.dom.style.bottom = '1em';
    this.stats.dom.style.left = '1em';
    this.stats.dom.style.opacity = '0.5';
    this.stats.dom.style.display = this.options.debug ? 'block' : 'none';
    this.container.appendChild(this.stats.dom);

    // Buttons.
    this.buttons = {
      zoomIn: new Button('zoom-in-btn', this.onZoomIn.bind(this)),
      zoomOut: new Button('zoom-out-btn', this.onZoomOut.bind(this)),
      fullscreen: new Switch('fullscreen-btn', this.onFullscreen.bind(this)),
      rotate: new Switch('rotate-btn')
    };

    // Add created objects to the scene.
    // Light is added to camera so that it follows the camera.
    this.scene.add(new AmbientLight(0xAAAAAA));
    this.scene.add(this.camera);
    this.scene.add(this.axis);
    this.camera.add(this.light);

    this.showControls();
    this.setCallbacks();
    
  }

  private showControls() {
    let controls = this.container.getElementsByClassName('controls') as HTMLCollectionOf<HTMLDivElement>;
    Object.values(controls).forEach(control => {
      if (!control.classList.contains('d-none')) control.classList.add('d-block');
    })
  }

  private onZoomOut() { this.zoom(1.1); }

  private onZoomIn() { this.zoom(0.9); }

  private zoom(scale: number) {
    let pos = this.camera.position.clone();
    let length = pos.length();
    pos.normalize().multiplyScalar(length * scale);
    this.camera.position.copy(pos);
    this.camera.updateProjectionMatrix();
  }

  private onFullscreen() {
    const footer = document.getElementsByTagName('footer');
    if (footer) {
      footer[0].classList.toggle('d-none');
    }
    this.container.classList.toggle('sim-fullscreen');
    if (this.buttons.fullscreen.value) {
      window.scrollTo(0, 0);
    } else {
      this.container.scrollIntoView(false);
    }
    this.onWindowResize();
  }

  private setCallbacks() {
    
    // Controls related.
    this.controls.addEventListener('change', this.onControlsMove.bind(this));
    this.onControlsMove();

    // Mouse related.
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    this.canvas.addEventListener('click', this.onMouseClick.bind(this), false);

    // Window related.
    window.addEventListener('orientationchange', this.onWindowResize.bind(this), false);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.onWindowResize();
  }

  private onControlsMove() {
    this.axis.update(this.camera);
  }

  private onTouchStart(e: TouchEvent) {
    if (e.targetTouches) {
      e.preventDefault();
      this.setMousePosition(
        e.targetTouches[0].clientX,
        e.targetTouches[0].clientY
      );
      this.exec(this.options.onClick);
    }
  }

  private onMouseClick(e: MouseEvent) {
    e.preventDefault();
    this.setMousePosition(e.clientX, e.clientY);
    this.exec(this.options.onClick);
  }

  private onMouseMove(e: MouseEvent) {
    e.preventDefault();
    this.setMousePosition(e.clientX, e.clientY);
    this.exec(this.options.onMove);
  }

  private setMousePosition(x: number, y: number) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.pos.set(
      x - rect.left,
      y - rect.top
    );
    this.mouse.norm.set(
      (this.mouse.pos.x / this.size.x ) * 2 - 1,
      - (this.mouse.pos.y / this.size.y ) * 2 + 1
    )
  }
 
  private onWindowResize() {
    if (this.buttons.fullscreen.value) {
      document.body.style.paddingBottom = '0';
      this.container.style.height = `${window.innerHeight}px`;
    } else {
      if (this.footer) {
        const { height } = window.getComputedStyle(this.footer);
        document.body.style.paddingBottom = height;
      }
      this.container.style.height = this.initialHeight;
    }
    this.size.set(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.size.x, this.size.y);
    this.camera.aspect = this.size.x / this.size.y;
    this.camera.updateProjectionMatrix();    
  }

  private exec(f: any) { if (f && isFunction(f)) f(); }

  public setCursor(cursor: string = 'default') {
    this.canvas.style.cursor = cursor;
  }

  public render() {
    requestAnimationFrame(() => this.render());
    this.stats.begin();
    this.controls.autoRotate = this.buttons.rotate.value;
    if (this.buttons.rotate.value) this.controls.update();
    this.exec(this.options.onRender);
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }

  public remove(obj: any) {
    if (isArray(obj)) {
      obj.forEach(o => this.remove(o));
    } else if (isObject(obj)) {
      obj.dispose();
      this.scene.remove(obj);
    }
  }

  public add(obj: any) {
    if (isArray(obj)) {
      obj.forEach(o => this.add(o));
    } else if (isObject(obj)) {
      this.scene.add(obj);
    }
  }

  public project(vec: Vector3) {
    this.camera.updateMatrixWorld();
    let projected = vec.clone().project(this.camera);
    projected.x = Math.round( (   projected.x + 1 ) * this.size.x / 2 );
    projected.y = Math.round( ( - projected.y + 1 ) * this.size.y / 2 );
    projected.z = 0;
    return projected;
  }

  get raycaster() {
    this._raycaster.setFromCamera(this.mouse.norm, this.camera);
    return this._raycaster;
  }
}
