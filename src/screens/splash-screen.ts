import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import '../preview-info.js';
import { FullScreenController } from '../fullscreen-controller';
import { getContrastingColor } from '../utils';
import type { Platform } from '../models';

@customElement('splash-screen')
export class SplashScreen extends LitElement {
  static styles = css`
    .container {
      position: relative;
      width: 220px;
      margin: 10px auto 0;
    }

    .android .phone {
      position: absolute;
      width: 100%;
      height: 480px;
      top: 0;
      background: #FFF;
      box-shadow: 0px 3px 5.41317px rgba(0, 0, 0, 0.25);
      border-radius: 8.11976px;
      object-fit: cover;
      z-index: -1;
    }

    .android .screen {
      position: absolute;
      width: 100%;
      height: 400px;
      top: 29px;
      border-radius: 8.12px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .phone-bar {
      padding: 7px 0;
      width: 100%;
    }

    .icon {
      margin: auto;
      width: 90px;
      height: 90px;
      margin-top: calc(50% + 45px);
    }

    .appName {
      width: fit-content;
      margin: 0 auto 30px;
      font-size: 16px;
    }

    .container.ios {
      margin-top: 30px;
    }

    .ios .phone {
      width: 100%;
      position: absolute;
      top: 0;
    }

    .ios .screen {
      height: 280px;
      width: 188px;
      position: absolute;
      top: 66px;
      left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: var(--ios-font-family);
    }

    .ios .status-bar {
      width: 100%;
      position: absolute;
      top: 2px;
      height: 19px;
      object-fit: cover;
      object-position: top;
    }

    .ios .icon {
      margin: 0 0 10px;
      width: 80px;
      height: 80px;
    }

    .container.windows {
      width: 250px;
    }

    .windows img.desktop {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      width: 100%;
    }

    .windows .screen {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 100px;
      height: 55px;
      top: 45px;
      left: calc(50% - 50px);
    }

    .windows .app-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: fit-content
    }

    .windows .app-info img {
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }

    .windows .app-info p {
      margin: 0;
      font-size: 10px;
      font-weight: 600;
    }

    .windows .window-actions {
      position: absolute;
      top: 2px;
      right: 2px;
      display: flex;
      align-items: center;
    }

    .windows .window-actions .collapse {
      width: 4px;
      height: 0.1px;
      margin-right: 3px;
    }
  `;

  private fsController = new FullScreenController(this);

  @property() platform: Platform = 'windows';

  /**
   * Background color attribute on the manifest.
   */
  @property() backgroundColor?: string;

  /**
   * Theme color attribute on the manifest.
   */
  @property() themeColor?: string;

  /**
   * The splash screen's icon.
   */
  @property() iconUrl?: string;

  /**
   * Name attribute on the manifest.
   */
  @property() appName?: string;

  /**
   * The color to use on top of the background color, such that the text is visible.
   */
  @state() private _contrastingBackgroundColor = '';
  
  @state()
  private get contrastingBackgroundColor() {
    if (!this._contrastingBackgroundColor) {
      this._contrastingBackgroundColor = this.backgroundColor ? getContrastingColor(this.backgroundColor) : '#000';
    }
    return this._contrastingBackgroundColor;
  }

  render() {
    switch (this.platform) {
      case 'windows':
        return html`
          <preview-info>
            While the PWA is loading, Windows uses the background color, name and 
            icon for displaying the splash screen.
          </preview-info>
          <div 
          style=${styleMap({ 
            transform: `scale(${this.fsController.isInFullScreen ? 3 : 1})`,
            marginTop: this.fsController.isInFullScreen ? '20vh' : '50px'
          })} 
          class="container windows">
            <img class="desktop" alt="Window's desktop" src="../assets/images/windows/desktop.png" />
            <div class="screen" style=${styleMap({ backgroundColor: this.backgroundColor || '#FFF' })}>
              <div class="window-actions">
                <div class="collapse" style=${styleMap({ backgroundColor: this.contrastingBackgroundColor })}></div>
                <svg class="close" width="4px" height="4px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
                  <g><path style="fill:${this.contrastingBackgroundColor}" d="M990,61.2L933.3,5.1L500,443.3L66.7,5.1L10,61.2L443.9,500L10,938.8l56.7,56.1L500,556.7l433.3,438.2l56.7-56.1L556.1,500L990,61.2z"/></g>
                </svg>
              </div>
              <div class="app-info">
                ${this.iconUrl ? 
                  html`<img src=${this.iconUrl} alt="App's splash screen" />` : null}
                <p style=${styleMap({ color: this.contrastingBackgroundColor })}>
                  ${this.appName || 'PWA App'}
                </p>
              </div>
            </div>
          </div>
        `;
      case 'android':
        return html`
        <preview-info>
          When launching the PWA, Android uses the background color, theme color, name and 
          icon for displaying the splash screen.
        </preview-info>
        <div style=${styleMap({ transform: `scale(${this.fsController.isInFullScreen ? 1.7 : 1})` })} class="container android">
          <img class="phone" alt="Application mobile preview" src="../assets/images/android/background.svg" />
          <div class="screen" style=${styleMap({ backgroundColor: this.backgroundColor || '#FFF' })}>
            <div 
            class="phone-bar"
            style=${styleMap({ backgroundColor: this.themeColor || '#000' })}></div>
            <img 
            class="icon" 
            src=${this.iconUrl || '../assets/images/android/noicon.svg'} 
            alt="App's splash screen" />
            <h5 class="appName" style=${styleMap({ color: this.contrastingBackgroundColor })}>
              ${this.appName || 'PWA App'}
            </h5>
            <div class="phone-bar" style=${styleMap({ backgroundColor: this.themeColor || '#000' })}></div>
          </div>
        </div>
        `;
      case 'iOS':
        return html`
          <preview-info>
            When launching the PWA, iOS uses the background color, name and icon for displaying
            the splash screen while the content loads.
          </preview-info>
          <div style=${styleMap({ transform: `scale(${this.fsController.isInFullScreen ? 1.5 : 1})` })} class="container ios"> 
            <img class="phone" alt="Iphone" src="../assets/images/ios/iphone.svg" />
            <div class="screen" style=${styleMap({ backgroundColor: this.backgroundColor || '#FFF' })}>
              <img class="status-bar" alt="iOS status bar" src="../assets/images/ios/statusbar.svg" />
              ${this.iconUrl ? 
                html`<img class="icon" src=${this.iconUrl} alt="App's splash screen" />` : null}
              <h5 class="appName" style=${styleMap({ color: this.contrastingBackgroundColor })}>
                ${this.appName || 'PWA App'}
              </h5>
            </div>
          </div>
        `;
      default: return null;
    }
  }
}