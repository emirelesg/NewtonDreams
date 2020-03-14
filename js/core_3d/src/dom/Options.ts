import { DomElement } from './DomElement';
import { Button } from './Button';

export class Options extends DomElement {

  public value = '';
  public buttons: Button[];

  constructor(
    id: string,
    private _onChangeCallback?: Function,
    enabled? : boolean
  ) {
    
    super(id, enabled)

    // Convert all children elements to a button object.
    this.buttons = Array.from(this.obj.children).map(button => new Button(button.id));

    // The callback for each button will be the onChange function.
    // The clicked button is passed as argument.
    this.buttons.forEach(b => b.onClickCallback = this.onChange.bind(this, b));

    // Set the current selected option.
    this.value = this.getActiveOption();

  }

  private getActiveOption() : string {
    let activeButton = this.buttons.find(button => button.obj.classList.contains('active'));
    if (activeButton) return activeButton.id;
    return '';
  }

  set onChangeCallback(f: Function) {
    this.onChangeCallback = f;
  }

  private onChange(button: Button) {
    this.buttons.forEach(b => b.active(b === button));
    this.value = this.getActiveOption();
    DomElement.exec(this._onChangeCallback);
  } 

}