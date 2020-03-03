import { isFunction } from "util";

export class DomElement {
  
  public obj: HTMLElement;
  
  constructor(
      public id: string,
      public isEnabled?: boolean 
  ) {

    // Find the html element.
    const obj = document.getElementById(this.id);
    if (!obj) {
      throw new Error(`Button with id #${this.id} not found.`);
    }
    this.obj = obj;

    // Set or get the current enabled state.
    if (this.isEnabled !== undefined) {
      this.enable(this.isEnabled);
    } else {
      this.isEnabled = !this.obj.getAttribute('disabled');
    }

  }

  public exec(f: any) { 
    if (f && isFunction(f)) f();
  }

  public invalid(state: boolean) {
    if (state) {
      this.obj.classList.add('invalid');
    } else {
      this.obj.classList.remove('invalid');
    }
  }

  public enable(state: boolean) {
    if (state) {
      this.obj.removeAttribute('disabled');
    } else {
      this.obj.setAttribute('disabled', 'true');
    }
    this.isEnabled = state;
  }

  public display(state: boolean) {
    if (state) {
      this.obj.classList.add('d-block');
      this.obj.classList.remove('d-none');
    } else {
      this.obj.classList.remove('d-block');
      this.obj.classList.add('d-none');
    }
  }

}