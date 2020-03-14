import { DomElement } from './DomElement';

export class Button extends DomElement {

  constructor(
    id: string,
    private _onClickCallback?: Function,
    enabled? : boolean
  ) {
    
    super(id, enabled)
    this.obj.addEventListener('click', this.onClick.bind(this), false);

  }
  
  public active(state: boolean) {
    if (state) {
      this.obj.classList.add('active');
    } else {
      this.obj.classList.remove('active');
    }
  }

  set onClickCallback(f: Function) {
    this._onClickCallback = f;
  }

  private onClick(e: MouseEvent) {
    e.preventDefault();
    DomElement.exec(this._onClickCallback);

  } 

}

export class Switch extends Button {

  private readonly onIcon: DomElement;
  private readonly offIcon: DomElement;

  constructor(
    id: string,
    private _onToggleCallback?: Function,
    enabled? : boolean,
    public value : boolean = false
  ) {
    
    super(id, undefined, enabled);
    this.onClickCallback = this.onToggle.bind(this);
    this.onIcon = new DomElement(`${this.id}-1`);
    this.offIcon = new DomElement(`${this.id}-0`);
    this.setIcons(this.value);

  }

  set onToggleCallback(f: Function) {
    this._onToggleCallback = f;
  }

  private onToggle() {
    this.setIcons(!this.value);
    DomElement.exec(this._onToggleCallback);
  }

  private setIcons(value: boolean) {
    this.value = value;
    this.offIcon.display(!this.value);
    this.onIcon.display(this.value);
  }

}