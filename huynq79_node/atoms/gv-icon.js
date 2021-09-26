import{css as t,LitElement as e,html as r}from"lit-element";import{directive as i}from"lit-html";import{classMap as o}from"lit-html/directives/class-map";export class GvIcon extends e{static get properties(){return{shape:{type:String}}}static get excludedShapes(){return["thirdparty:google","thirdparty:graviteeio_am"]}canCustomize(){return!["thirdparty:google","thirdparty:graviteeio_am","thirdparty:http","thirdparty:jdbc","thirdparty:microsoft","thirdparty:mongodb"].includes(this.shape)}static get styles(){return[t`:host{box-sizing:border-box;display:inline-flex;vertical-align:middle;--color:var(--gv-icon--c, var(--gv-theme-font-color-dark, #262626));--opacity:var(--gv-icon-opacity--c, var(--gv-theme-font-color-dark, #262626));--size:var(--gv-icon--s, 32px)}svg{height:var(--size);width:var(--size);fill:var(--star-vt, var(--color))}`]}static getHref(t){const[e,r]=t.split(":");return`./icons/${e}.svg#${r}`}render(){const t=i((t,e)=>r=>{r.committer.element.setAttributeNS(t,r.committer.name,e)});return r`<svg class="${o({"no-color":!this.canCustomize()})}"> <use xlink:href="${t("http://www.w3.org/1999/xlink",GvIcon.getHref(this.shape))}"/> </svg>`}}window.customElements.define("gv-icon",GvIcon);
//# sourceMappingURL=gv-icon.js.map
