import{css as t,LitElement as e}from"lit-element";import{html as i}from"lit-html";import{skeleton as s}from"../styles/skeleton";import{empty as r}from"../styles/empty";import{link as o}from"../styles/link";import{classMap as n}from"lit-html/directives/class-map";import{repeat as a}from"lit-html/directives/repeat";import{dispatchCustomEvent as l}from"../lib/events";import{getLanguage as h,i18n as d}from"../lib/i18n";import{until as g}from"lit-html/directives/until";import{styleMap as c}from"lit-html/directives/style-map";import{withResizeObserver as m}from"../mixins/with-resize-observer";import{ifDefined as p}from"lit-html/directives/if-defined";import"../atoms/gv-image";import"../organisms/gv-pagination";export class GvTable extends(m(e)){static get properties(){return{items:{type:Array},title:{type:String},order:{type:String},options:{type:Array},noheader:{type:Boolean},nosort:{type:Boolean},rowsheight:{type:String},rowheight:{type:String},emptymessage:{type:String},format:{type:Function},compareFn:{type:Function},selected:{type:Array,reflect:!0},total:{type:String},skeleton:{type:Boolean},_items:{type:Array,attribute:!1},_skeleton:{type:Boolean,attribute:!1},_error:{type:Boolean,attribute:!1},_empty:{type:Boolean,attribute:!1},_itemsProvider:{type:Array,attribute:!1},_page:{type:Number,attribute:!1}}}static get styles(){return[o,s,r,t`:host{--selected--bgc:var(--gv-table-selected--bgc, var(--gv-theme-color, #5a7684));--hover-bgc:var(--gv-table-hover--bgc, var(--gv-theme-neutral-color-lighter, #fafafa));--bgc:var(--gv-table--bgc, var(--gv-theme-neutral-color-lightest, #ffffff));--bdc:var(--gv-table--bdc, var(--gv-theme-neutral-color-dark, #d9d9d9));display:block;height:100%;margin:.2rem;box-sizing:border-box}.table{background-color:var(--bgc);flex-direction:column;height:100%;display:flex;width:100%}.rows{-ms-overflow-style:none;scrollbar-width:none;overflow:var(--gv-table-rows--ov,auto);flex:1;height:100%;transition:height 250ms ease-in-out}.rows::-webkit-scrollbar{display:none}:host([w-lt-768]) .row{height:70px}:host([w-lt-580]) .row{height:60px}:host([w-lt-400]) .row{height:50px}.theader{background-color:#F3F3F3;font-weight:700;padding:0 .2rem}.row,.theader{align-items:center;align-content:center;border-right:solid thick transparent;display:grid}div{box-sizing:border-box}.cell{height:100%;display:flex;align-items:center;margin:.2rem}.row:not(:last-child){box-shadow:0 5px 3px -6px var(--bdc)}.row.selected,.row:hover{background-color:var(--hover-bgc)}.row.selected{border-color:var(--selected--bgc);box-sizing:border-box}.header{border-bottom:1px solid var(--bdc);padding:var(--gv-table-header--p,2rem 4rem)}.title{margin:0;text-transform:uppercase;font-size:var(--gv-table-header--fz,var(--gv-theme-font-size-l,20px));line-height:var(--gv-table-header--fz,var(--gv-theme-font-size-l,20px));opacity:.6}.title span{font-weight:600;font-size:var(--gv-theme-font-size-s);line-height:var(--gv-theme-font-size-s);margin-left:8px;opacity:.7}gv-identity-picture{height:35px;width:35px;--gv-image--of:contain;margin-left:20px}gv-icon{transform:rotate(0);--gv-icon--s:18px}gv-icon.desc{transform:rotate(180deg)}gv-pagination{align-self:flex-end}.cell>:not(gv-tag){margin:auto;width:100%}`]}constructor(){super(),this._id=(new Date).getTime(),this.breakpoints={width:[400,580,768]},this._empty=!1,this.order="",this._page=1,this._itemsProvider=[],this.selected=[],this.compareFn=(t,e,i)=>{const s=this._getDataFromField(t,i)&&this._getDataFromField(t,i).toLowerCase?this._getDataFromField(t,i).toLowerCase():"",r=this._getDataFromField(e,i)&&this._getDataFromField(e,i).toLowerCase?this._getDataFromField(e,i).toLowerCase():"";return this.order.startsWith("-")?r.localeCompare(s):s.localeCompare(r)},this.addEventListener("gv-pagination:paginate",t=>{this._page=t.detail.page})}set items(t){this._skeleton=!0,Promise.resolve(t).then(t=>{t&&(this._itemsProvider=t.map((t,e)=>(t._id=null==t.id?e:t.id,t)),this._onSortChanged(),this._empty=0===this._itemsProvider.length,this._skeleton=!1)}).catch(t=>{console.error(t),this._error=!0,this._skeleton=!1,this._itemsProvider=[]})}get items(){return this._itemsProvider}_onSortChanged(t,e){if(e&&e.preventDefault(),this._itemsProvider&&this.order){const e=this.order.startsWith("-"),i=e?this.order.substring(1):this.order,s=t||i;t&&(this.order=i===s?e?s:"-"+s:s),this._itemsProvider=this._itemsProvider.sort((t,e)=>this.compareFn(t,e,s)),t&&l(this,"sort",{order:this.order})}}get _items(){if(this._itemsProvider){if(this.options&&this.options.paging&&this.options.paging<this._itemsProvider.length){const t=(this._page-1)*this.options.paging;return[...this._itemsProvider].splice(t,this.options.paging)}return this._itemsProvider}return[]}_getItemId(t){return null==t.id?t._id:t.id}_onSelect(t){if(!this._skeleton)if(this.options.selectable){const e=this._getItemId(t);this._isSelected(t)?this.selected=this.selected.filter(t=>e!==t):"multi"===this.options.selectable?this.selected=[...this.selected,e]:this.selected=[e],l(this,"select",{items:this.selectedItems,options:this.options})}else l(this,"select",{items:[t]})}get selectedItems(){return this.selected&&this._itemsProvider?this._itemsProvider.filter(t=>this.selected&&this.selected.includes(this._getItemId(t))):[]}_onMouseEnter(t){this.selected&&this.selected.length>0||this._skeleton||l(this,"mouseenter",{item:t})}_onMouseLeave(){this.selected&&this.selected.length>0||this._skeleton||l(this,"mouseleave")}_renderHeader(t){if(this.noheader)return"";{const e={...t,height:this.rowheight,"grid-auto-rows":this.rowheight?null:"minmax(80px, auto)"};return i` <div class="${n({theader:!0})}" style="${c(e)}"> ${this.options&&this.options.data&&this._items&&this._items.length?a(this.options.data,t=>t,t=>{const e=this.order&&this.order.startsWith("-")?this.order.substring(1):this.order,s=this.format&&t.label?this.format(t.label):t.label,r="function"==typeof t.headerStyle?t.headerStyle(s):t.headerStyle;return i` <div style="${r||""}"> ${this.order&&!this.nosort?i` <gv-button link @click="${this._onSortChanged.bind(this,t.field||t.tag)}">${g(s)}</gv-button> ${e===t.tag||e===t.field&&"image"!==t.type?i` <gv-icon class="${n({desc:this.order.startsWith("-")})}" shape="design:triangle"></gv-icon>`:""} `:g(s)} </div>`}):""} </div>`}}_renderIcon(t,e,s){const r="function"==typeof s.icon?s.icon(t):s.icon,o="function"==typeof s.iconTitle?s.iconTitle(t):s.iconTitle;return r?i` <gv-icon shape="${r}" title="${o}"></gv-icon>`:""}_renderComponent(t,e,i,s,r){if(i.condition&&!i.condition(t))return"";const o=document.createElement(r);o.value=s,i.attributes&&Object.keys(i.attributes).forEach(e=>{if(e.startsWith("on")){const s=e.replace("on","").toLowerCase();"click"===s&&o.classList.add("link"),o.addEventListener(s,s=>{s.stopPropagation();null==("function"==typeof i.confirm?i.confirm(t):i.confirm)&&setTimeout(()=>{i.attributes[e](t,s,o,this)},0)})}else if("function"==typeof i.attributes[e]){const s=i.attributes[e](t);null!=s&&(o[e]=s)}else this.format&&"string"==typeof i.attributes[e]?this.format(i.attributes[e]).then(t=>{o[e]=t}):o[e]=i.attributes[e]}),o.addEventListener("input",t=>{this._items[e][i.field]=t.target.value});const n="function"==typeof i.confirm?i.confirm(t):i.confirm;if(n){const e=document.createElement("gv-confirm");return this.format?this.format(n.msg).then(t=>e.message=t):e.message=n.msg,n.danger&&(e.danger=!0),e.addEventListener("click",t=>t.stopPropagation()),e.addEventListener("gv-confirm:ok",e=>{e.stopPropagation(),i.attributes.onClick(t,e,o)}),e.appendChild(o),e}return o}_renderCell(t,e,i){let s=t.field?this._getDataFromField(e,t.field):"";if("date"===t.type&&s?s=new Date(s).toLocaleDateString(h()):"datetime"===t.type&&s?s=new Date(s).toLocaleString(h()):"time"===t.type&&s&&(s=new Date(s).toLocaleTimeString(h())),t.format&&(s=t.format(s)),t.type){if("image"===t.type){let i="";return t.alt&&(i="function"==typeof t.alt?t.alt(e):this._getDataFromField(e,t.alt)),this._renderImage(s,i)}if("function"==typeof t.type)return this._renderComponent(e,i,t,s,t.type(e));if(t.type.startsWith("gv-"))return this._renderComponent(e,i,t,s,t.type)}return g(s)}_isSelected(t){return this.selected&&this.selected.includes(this._getItemId(t))}_renderRows(t){return i` <div class="rows" style="${c({height:this.rowsheight,"user-select":this.options.selectable?"none":""})}" @mouseleave="${this._onMouseLeave.bind(this)}"> ${this._items&&this._items.length?a(this._items,t=>t,(e,s)=>i` <div class="${n({row:!0,skeleton:this._skeleton,selected:this._isSelected(e)})}" style="${c({...t,height:this.rowheight,"grid-auto-rows":this.rowheight?null:"minmax(80px, auto)",cursor:this.options.selectable?"pointer":"","border-color":this.options.selectable&&this._isSelected(e)?"var(--selected--bgc)":""})}" @click="${this._onSelect.bind(this,e)}" @mouseenter="${this._onMouseEnter.bind(this,e)}"> ${this.options&&this.options.data?a(this.options.data,t=>t,t=>{const r="function"==typeof t.style?t.style(e):t.style;return i`<div class="cell" style="${p(r)}"> ${this._renderCell(t,e,s)}${this._renderTag(t,e)}${t.icon?this._renderIcon(e,s,t):""} </div> `}):""} </div> `):""} </div>`}_renderItems(){let t=this.options.data.map(t=>t.width?t.width:"image"===t.type?"80px":"icon"===t.type?"40px":null);const e=t.filter(t=>null!==t),s=e.reduce((t,e)=>t+parseInt(e.replace("px",""),10),0);t=t.map(t=>null==t?`calc((100% - ${s}px) / ${this.options.data.length-e.length})`:t);const r={"grid-template-columns":t.join(" ")};return i` ${this._renderHeader(r)} ${this._renderRows(r)} ${this._renderPagination()} `}_renderPagination(){if(this.options&&this.options.paging&&this._itemsProvider){const t={first:1,last:this._itemsProvider.length/this.options.paging,total:this._itemsProvider.length,current_page:this._page,total_pages:this._itemsProvider.length/this.options.paging};return i`<gv-pagination .data="${t}" widget="true"></gv-pagination>`}}_getDataFromField(t,e){return"function"==typeof e?e(t):e.split(".").reduce((t,e)=>t&&t[e],t)}_renderTag(t,e){if(t.tag){let s;if(s="function"==typeof t.tag?t.tag(e):t.format?t.format(this._getDataFromField(e,t.tag)):this._getDataFromField(e,t.tag),s)return i` <gv-tag ?skeleton="${this._skeleton}">${s}</gv-tag>`}return""}_onImageLoaded(){this._skeleton=!1}_renderImage(t,e){return i`<gv-identity-picture .picture="${t}" .display_name="${e}"></gv-identity-picture>`}updated(t){this._onSortChanged()}render(){if(this._error)return i`<div class="error">${d("gv-table.error")}</div>`;const t={table:!0,skeleton:this._skeleton||this.skeleton},e={height:this.rowsheight?this.rowsheight:""};return i` <div class="${n(t)}" style="${c({display:this.rowsheight?"block":"flex"})}"> ${this.title?i` <div class="header"> <h3 class="title"> ${this.title} ${this._empty?"":i`<span>(${this.total||this._items&&this._items.length})</span>`} </h3> </div>`:""} ${!this._empty&&this.options&&this.options.data?this._renderItems():i` <div class="empty" style="${c(e)}"> ${this.emptymessage?this.emptymessage:d("gv-table.empty")} </div>`} </div> `}}window.customElements.define("gv-table",GvTable);
//# sourceMappingURL=gv-table.js.map