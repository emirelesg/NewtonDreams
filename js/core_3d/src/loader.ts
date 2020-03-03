function loadScript(src: string, callback: Function) {
  const script =  document.createElement('script') as HTMLScriptElement;
  script.type = 'text/javascript';
  script.src = src;
  script.onload = () => callback();
  const tag = document.getElementsByTagName('script')[0];
  (<any>tag.parentNode).insertBefore(script, tag);
}

window.onload = () => {

  const footer = document.getElementById('footer') as HTMLDivElement;
  if (footer) {
    const { height } = window.getComputedStyle(footer);
    document.body.style.paddingBottom = height;
  }

  loadScript('./dist/main.js', () => {
    console.log('Loaded!');
  })
}