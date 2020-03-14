import { DomElement } from './DomElement';

export class Option extends DomElement {

  constructor(
    id: string,
    private _onClickCallback?: Function,
    enabled? : boolean
  ) {
    
    super(id, enabled)
    this.obj.addEventListener('click', this.onClick.bind(this), false);

  }

  public set(value: boolean) {
    (<HTMLInputElement>this.obj).checked = value;
  }

  get value() : boolean { return (<HTMLInputElement>this.obj).checked; };

  set onClickCallback(f: Function) {
    this._onClickCallback = f;
  }

  private onClick(e: MouseEvent) {
    DomElement.exec(this._onClickCallback);
  } 

}
