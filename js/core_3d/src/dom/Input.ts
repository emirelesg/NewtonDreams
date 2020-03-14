import { DomElement } from "./DomElement";

// export class Input extends DomElement {
//   public value: string;

//   constructor(
//       id: string,
//       private _onChangeCallback?: Function
//   ) {

//     super(id);
//     this.value = ''
//     this.obj.addEventListener('input', this.onInput.bind(this));

//   }

//   private onInput() {
//     this.value = (<any>this.obj).value;
//     if (this._onChangeCallback && isFunction(this._onChangeCallback)) this._onChangeCallback();
//   }

//   set(value: string) {
//     this.value = value;
//     (<any>this.obj).value = value;
//   }

// }

export class InputNumber extends DomElement {

  public value: number = 0;
  public default: number = 0;

  constructor(
    id: string,
    private _onChangeCallback?: Function,
    private _onFocusoutCallback?: Function
  ) {

    super(id);
    this.obj.addEventListener('input', this.onInput.bind(this));
    this.obj.addEventListener('focusout', this.onFocusout.bind(this));
    this.obj.addEventListener('keyup', this.onKeyup.bind(this));

  }

  public set(value: number) {
    this.value = value;
    (<any>this.obj).value = value;
  }

  private onKeyup(e: KeyboardEvent) {
    if (e.keyCode === 13) this.obj.blur();
  }

  private onInput() {
    const raw = (<any>this.obj).value;
    if (raw === '') {
      this.value = this.default;
      this.invalid(false);
    } else {
      const parsed = parseFloat(raw);
      this.invalid(isNaN(parsed));
      if (!isNaN(parsed)) this.value = parsed;
    }
    DomElement.exec(this._onChangeCallback);
  }

  private onFocusout() {
    this.set(this.value);
    DomElement.exec(this._onChangeCallback);
    DomElement.exec(this._onFocusoutCallback);

  }

}