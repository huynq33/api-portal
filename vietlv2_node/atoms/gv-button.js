import{classMap as t}from"lit-html/directives/class-map";import{LitElement as i,html as o,css as n}from"lit-element";import{skeleton as e}from"../styles/skeleton";import{link as r}from"../styles/link";import"../atoms/gv-icon";import{ifDefined as a}from"lit-html/directives/if-defined";import{dispatchCustomEvent as c}from"../lib/events";export class GvButton extends i{static get properties(){return{type:{type:String},danger:{type:Boolean},disabled:{type:Boolean},primary:{type:Boolean},outlined:{type:Boolean},link:{type:Boolean},href:{type:String},skeleton:{type:Boolean},icon:{type:String},iconRight:{type:String,attribute:"icon-right"},loading:{type:Boolean},title:{type:String,reflect:!0},provider:{type:String},small:{type:Boolean},tabindex:{type:Number,reflect:!0},_hasContent:{type:Boolean,attribute:!1}}}static get styles(){return[n`:host{box-sizing:border-box;display:inline-block;margin:.2rem;vertical-align:middle;--gv-icon--s:23px;--github--c:#444;--google--c:#4285f4;--oidc--c:var(--gv-button-oidc--bgc, #000000);--gravitee--c:var(--gv-button-graviteeio_am--bgc, #86c3d0)}:host(:not([link])){outline:0}.github{--gv-button--bgc:var(--github--c)}.google{--gv-button--bgc:var(--google--c)}.oidc{--gv-button--bgc:var(--oidc--c);--gv-button-icon--c:#fff}.oidc.outlined{--gv-button-icon--c:var(--oidc--c)}.button.graviteeio_am{--gv-button--bgc:var(--gravitee--c);color:#383e3f}.button{background:#fff;border:1px solid #000;font-size:var(--gv-button--fz,var(--gv-theme-font-size-m,14px));margin:0;padding:0;height:100%;text-decoration:none;box-sizing:border-box;display:flex;justify-content:center;align-items:center;text-align:center;outline:0}.button.small{--gv-icon--s:16px}.button.small:not(.link){max-height:25px;min-height:25px;min-width:25px;--gv-button--p:1px 4px}.button:not(.link){border-radius:8px;cursor:pointer;min-height:39px;min-width:39px;padding:var(--gv-button--p,7px 14px);text-transform:uppercase;user-select:none;width:100%}.button.iconLeft slot{margin-left:7px}.button.iconRight slot{margin-right:7px}.default{--c:var(--gv-button--c, var(--gv-theme-font-color-light, #ffffff));--bgc:var(--gv-button--bgc, var(--gv-theme-color-dark, #28444f));--icon--c:var(--gv-button--c, var(--gv-theme-font-color-light, #ffffff));--gv-icon--c:var(--icon--c);--gv-icon-opacity--c:var(--icon--c)}.primary{--c:var(--gv-button-primary--c, var(--gv-theme-font-color-light, #ffffff));--bgc:var(--gv-button-primary--bgc, var(--gv-theme-color, #5a7684));--icon--c:var(--gv-button-primary--c, var(--gv-theme-font-color-light, #ffffff));--gv-icon--c:var(--icon--c);--gv-icon-opacity--c:var(--icon--c);font-weight:500}.danger{--c:var(--gv-button-danger--c, var(--gv-theme-font-color-light, #ffffff));--bgc:var(--gv-button-danger--bgc, var(--gv-theme-danger-color, #ff5722));--icon--c:var(--gv-button-danger--c, var(--gv-theme-font-color-light, #ffffff));--gv-icon--c:var(--icon--c);--gv-icon-opacity--c:var(--icon--c)}.button:not(.link){background-color:var(--gv-tag-major--bgc);border-color:var(--gv-tag-major--bgc);color:var(--c)}.button.outlined{background-color:var(--c);color:var(--bgc);--gv-icon--c:var(--bgc);--gv-icon-opacity--c:var(--bgc)}:host(:focus) .button:not(.link):not(.disabled),:host(:hover) .button:not(.link):not(.disabled){box-shadow:0 1px 3px var(--gv-theme-color-darker,#383e3f)}:host(:active) .button{box-shadow:none}.button.disabled{cursor:default;opacity:.5}.button.skeleton>gv-icon{opacity:0}.button{box-shadow:0 0 0 0 rgba(255,255,255,0);transition:all 75ms ease-in-out}.button::-moz-focus-inner{border:0}.button slot{flex:1;white-space:nowrap;display:flex;align-items:center;justify-content:center;height:100%}.button.noContent slot{display:none}.loading gv-icon{animation:spinner 1.6s linear infinite;--gv-icon--s:20px}.loading.small gv-icon{--gv-icon--s:18px}@keyframes spinner{to{transform:rotate(360deg)}}.link{border:0;cursor:pointer;background-color:transparent}button.link{text-decoration:underline}`,e,r]}constructor(){super(),this.tabindex=0,this.addEventListener("click",this._onClick.bind(this))}_onKeyDown(t){32!==t.keyCode&&13!==t.keyCode||(t.preventDefault(),this._onClick(t))}_onClick(t){if(this.href&&t.preventDefault(),!this.disabled&&!this.loading&&!this.skeleton){const t=this.closest("form");t&&"submit"===this.type&&t.dispatchEvent(new Event("submit",{bubbles:!0,cancelable:!0})),c(this,"click")}}async performUpdate(){super.performUpdate();const t=this.shadowRoot.querySelector("gv-icon");t&&t.performUpdate()}render(){const i={button:!0,primary:this.primary&&!this.danger,danger:this.danger,skeleton:this.skeleton&&!this.link,default:!this.primary&&!this.danger&&!this.link,outlined:this.outlined,icon:this.icon||this.iconRight,iconLeft:this._hasIconLeft(),iconRight:this.iconRight,loading:this.loading&&!this.link,link:this.link&&!this.primary&&!this.danger,disabled:this.disabled,small:this.small,noContent:!this._hasContent};return this.provider&&(i[this.provider]=!0,this.icon="thirdparty:"+this.provider,i.icon=!0,i.iconLeft=!0),this.href?o`<a tabindex="-1" .href="${this.href}" .title="${a(this.title)}" class="${t(i)}"> ${this._getIconLeft()} <slot></slot> ${this._getIconRight()} </a>`:o`<button tabindex="-1" type="${this.type||"button"}" .title="${a(this.title)}" class="${t(i)}" .disabled="${this.disabled||this.skeleton}"> ${this._getIconLeft()} <slot></slot> ${this._getIconRight()} </button>`}_getIconRight(){return this.iconRight?!this.loading||this.icon||this.link?o`<gv-icon shape="${this.iconRight}" .title="${a(this.title)}"></gv-icon>`:o`<gv-icon shape="navigation:waiting" .title="${a(this.title)}"></gv-icon>`:""}_hasIconLeft(){return(this.icon||this.loading)&&!this.iconRight}_getIconLeft(){return this._hasIconLeft()?this.loading&&!this.link?o`<gv-icon shape="navigation:waiting" .title="${a(this.title)}"></gv-icon>`:o`<gv-icon shape="${this.icon}" .title="${a(this.title)}"></gv-icon>`:""}firstUpdated(){this.shadowRoot.querySelector("slot").assignedNodes().length>0&&(this._hasContent=!0),this.addEventListener("keydown",this._onKeyDown)}}window.customElements.define("gv-button",GvButton);
//# sourceMappingURL=gv-button.js.map