// Auto Update Image Card
//
// Options:
//   - url: required. Image's URL.
//   - update_interval: time between image updates, in seconds. Defaults to 60 (1 minute).
//   - title: title text shown above the image.
//   - width: card's width. In case you need a bigger card to show a big image.
//
// Yaml example:
//
// type: custom:auto-update-image-card
// title: Title Test
// update_interval: 180
// url: http://infocar.dgt.es/etraffic/data/camaras/605.jpg
// width: 130%

class AutoUpdateImageCard extends HTMLElement {
  // whenever state changes, a new hass object is set:
  set hass(hass) {

    if (!this.content) {
      this.innerHTML = `
        <ha-card style="width: ${this.config.width || '100%'};">
        </ha-card>
      `;
      this.content = this.querySelector('ha-card');
    }

    // console.log(this.config);

    this.content.innerHTML = `
      ${this.config.title ? `<h1 class="card-header">${this.config.title}</h1>` : ''}
      <img id="refreshing" src="${this.config.url}" style="display: block; width: 100%; border-radius: var(--ha-card-border-radius, 4px);" />
    `;

    // only set timer if update_interval is provided and no previous timer is running:
    if (this.config.update_interval && !this.timeout) this.timeout = window.setInterval(
      () => {
        this.setConfig({ url: `${this.config.url}?v=${new Date().getTime()}` });
      },
      (this.config.update_interval || 60) * 1000
    );
  }

  // user supplied configuration:
  setConfig(config) {
    console.log(config);
    if (!config.url) throw new Error('You need to give me an URL to load image from!');
    this.config = config;
  }

  // height of card:
  getCardSize() {
    return 1;
  }
}

customElements.define('auto-update-image-card', AutoUpdateImageCard);