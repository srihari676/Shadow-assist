(function(){var e=`shadow-ui-accessibility-style`;function t(){let t=document.getElementById(e);return t||(t=document.createElement(`style`),t.id=e,document.head.appendChild(t)),t}var n=`
  /* Shadow UI Large Text Mode */
  body, p, span, li, dt, dd, td, th, blockquote {
    font-size: max(1.15em, 16px) !important;
    line-height: 1.6 !important;
  }
  h1 { font-size: max(2em, 28px) !important; line-height: 1.3 !important; }
  h2 { font-size: max(1.6em, 24px) !important; line-height: 1.35 !important; }
  h3 { font-size: max(1.35em, 20px) !important; line-height: 1.4 !important; }
  h4, h5, h6 { font-size: max(1.2em, 18px) !important; line-height: 1.4 !important; }
  a, button, input, select, textarea, label {
    font-size: max(1.1em, 15px) !important;
  }
  button, input[type="button"], input[type="submit"], input[type="reset"] {
    padding-top: max(8px, 0.5em) !important;
    padding-bottom: max(8px, 0.5em) !important;
  }
`,r=`
  /* Shadow UI High Contrast Mode */
  html {
    background-color: #090d16 !important;
    color: #f8fafc !important;
  }
  body {
    background-color: #090d16 !important;
    color: #f8fafc !important;
  }
  p, span, li, label, dt, dd, h1, h2, h3, h4, h5, h6, th, td {
    color: #f8fafc !important;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.8) !important;
  }
  a {
    color: #38bdf8 !important;
    text-decoration: underline !important;
    font-weight: 600 !important;
  }
  a:visited {
    color: #c084fc !important;
  }
  button, input, select, textarea {
    background-color: #1e293b !important;
    color: #ffffff !important;
    border: 2px solid #38bdf8 !important;
    box-shadow: 0 0 4px rgba(56, 189, 248, 0.4) !important;
  }
  div, section, article, nav, header, footer, main, aside, table {
    border-color: #334155 !important;
  }
  /* PROTECT IMAGES & MEDIA FROM DISTORTION */
  img, svg, video, canvas, picture, iframe, [role="img"] {
    filter: none !important;
    opacity: 1 !important;
    mix-blend-mode: normal !important;
  }
`,i=`
  /* Shadow UI Dyslexia Friendly Mode */
  body, p, span, li, h1, h2, h3, h4, h5, h6, a, button, input, select, textarea, label {
    font-family: 'OpenDyslexic', 'Comic Sans MS', 'Trebuchet MS', system-ui, sans-serif !important;
    letter-spacing: 0.04em !important;
    word-spacing: 0.08em !important;
    line-height: 1.65 !important;
  }
`;function a(){let e=t();e.textContent?.includes(`Shadow UI Large Text Mode`)||(e.textContent+=n)}function o(){let t=document.getElementById(e);t&&t.textContent&&(t.textContent=t.textContent.replace(n,``))}function s(){let e=t();e.textContent?.includes(`Shadow UI High Contrast Mode`)||(e.textContent+=r)}function c(){let t=document.getElementById(e);t&&t.textContent&&(t.textContent=t.textContent.replace(r,``))}function l(){let e=t();e.textContent?.includes(`Shadow UI Dyslexia Friendly Mode`)||(e.textContent+=i)}function u(){let t=document.getElementById(e);t&&t.textContent&&(t.textContent=t.textContent.replace(i,``))}function d(e){e.largeText?a():o(),e.highContrast?s():c(),e.dyslexiaFont?l():u()}var f={"authentication verification":`identity confirmation`,authentication:`sign in verification`,remittance:`payment`,utilize:`use`,facilitate:`help with`,commence:`start`,terminate:`stop`,requisite:`needed`,subsequently:`then`,"prior to":`before`,"in the event of":`if`,"pursuant to":`under the rules of`,notwithstanding:`even though`,discontinue:`stop`,expedite:`speed up`,reimbursement:`pay back`,"mandatory requirements":`must-have rules`,jurisdiction:`legal area`,indemnify:`protect legally`,"terms and conditions":`usage rules`,"privacy policy":`data protection rules`,eligible:`qualified`,ineligible:`not qualified`,"non-refundable":`cannot be refunded`};async function p(e){if(!e||e.trim().length===0)return e;let t=e;return Object.keys(f).forEach(e=>{let n=RegExp(`\\b${e}\\b`,`gi`);t=t.replace(n,f[e])}),t=t.replace(/is required to be submitted/gi,`must be sent`).replace(/your transaction requires/gi,`please complete`).replace(/in order to/gi,`to`).replace(/at this point in time/gi,`now`),t}function m(e){if(!e)return[];let t=[];return Object.keys(f).forEach(n=>{RegExp(`\\b${n}\\b`,`i`).test(e)&&t.push({original:n,simplified:f[n],category:`jargon`})}),t}var h=`shadow-ui-simple-language-overlays`;async function g(){_();let e=document.createElement(`div`);e.id=h,e.style.position=`absolute`,e.style.top=`0`,e.style.left=`0`,e.style.width=`100%`,e.style.pointerEvents=`none`,e.style.zIndex=`2147483640`,document.body.appendChild(e);let t=document.querySelectorAll(`p, h1, h2, h3, h4, label, span.title, div.description`),n=0;for(let r=0;r<t.length&&n<15;r++){let i=t[r],a=i.innerText||i.textContent||``;if(!(a.trim().length<15||i.closest(`#shadow-ui-root-host`)||i.offsetWidth===0)&&m(a).length>0){let t=await p(a),r=i.getBoundingClientRect(),o=window.scrollY||document.documentElement.scrollTop,s=window.scrollX||document.documentElement.scrollLeft,c=document.createElement(`div`);c.className=`shadow-ui-simple-lang-badge`,c.style.position=`absolute`,c.style.top=`${r.top+o-10}px`,c.style.left=`${r.left+s}px`,c.style.pointerEvents=`auto`,c.style.zIndex=`2147483641`,c.style.display=`inline-flex`,c.style.alignItems=`center`,c.style.gap=`6px`,c.style.padding=`4px 10px`,c.style.background=`linear-gradient(135deg, #0f172a, #1e1b4b)`,c.style.color=`#38bdf8`,c.style.border=`1px solid rgba(56, 189, 248, 0.5)`,c.style.borderRadius=`8px`,c.style.fontSize=`11px`,c.style.fontWeight=`600`,c.style.boxShadow=`0 4px 12px rgba(0,0,0,0.4)`,c.style.cursor=`pointer`,c.innerHTML=`
        <span>✨ Simple AI:</span>
        <span style="color: #ffffff;">"${t.slice(0,45)}${t.length>45?`...`:``}"</span>
      `,c.setAttribute(`title`,`Original: "${a}"\nSimple: "${t}"`),e.appendChild(c),n++}}console.log(`[Shadow UI TextSimplifier] Created ${n} non-destructive simple language overlays.`)}function _(){let e=document.getElementById(h);e&&e.remove()}var v=`shadow-ui-form-highlight-style`;function y(){if(!document.getElementById(v)){let e=document.createElement(`style`);e.id=v,e.textContent=`
      @keyframes shadowUiGreenGlow {
        0% { outline: 3px solid #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.8); }
        50% { outline: 4px solid #34d399; box-shadow: 0 0 25px rgba(52, 211, 153, 1); }
        100% { outline: 2px solid rgba(16, 185, 129, 0.4); box-shadow: 0 0 8px rgba(16, 185, 129, 0.3); }
      }
      .shadow-ui-field-highlight {
        animation: shadowUiGreenGlow 1.8s ease-in-out 2 !important;
        border-color: #10b981 !important;
      }
    `,document.head.appendChild(e)}}function b(e){if(!e)return null;let t=document.getElementById(e);return t||(t=document.querySelector(`[data-shadow-ui-id="${CSS.escape(e)}"]`),t)||(t=document.querySelector(`[name="${CSS.escape(e)}"]`),t)||(t=document.querySelector(`[data-shadow-ui-submit="true"]`),t)?t:null}function x(e){e.dispatchEvent(new Event(`input`,{bubbles:!0})),e.dispatchEvent(new Event(`change`,{bubbles:!0}))}async function S(e,t){let n=b(e);if(!n)return console.warn(`[Shadow UI DOM] Field not found: ${e}`),!1;try{n.scrollIntoView({behavior:`smooth`,block:`center`}),n.focus();let r=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,`value`)?.set,i=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,`value`)?.set;return n instanceof HTMLInputElement&&r?r.call(n,t):n instanceof HTMLTextAreaElement&&i?i.call(n,t):n.value=t,x(n),E(e),!0}catch(t){return console.error(`[Shadow UI DOM] Failed to fill field ${e}:`,t),!1}}async function C(e,t){let n=b(e);if(!n)return!1;try{if(n.scrollIntoView({behavior:`smooth`,block:`center`}),n.tagName===`SELECT`){let r=n;r.focus();let i=t.toLowerCase().trim(),a=Array.from(r.options).find(e=>e.value.toLowerCase().trim()===i||e.text.toLowerCase().trim()===i||e.text.toLowerCase().includes(i)||i.includes(e.text.toLowerCase().trim()));if(a){let t=Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype,`value`)?.set;return t?t.call(r,a.value):r.value=a.value,a.selected=!0,x(r),E(e),!0}}n.click(),n.focus(),await new Promise(e=>setTimeout(e,150));let r=Array.from(document.querySelectorAll(`[role="option"], li, div[data-value]`)),i=t.toLowerCase().trim(),a=r.find(e=>{let t=e.innerText.toLowerCase().trim(),n=(e.getAttribute(`data-value`)||``).toLowerCase().trim();return t===i||n===i||t.includes(i)||i.includes(t)});if(a)return a.click(),E(e),!0}catch(e){console.error(`[Shadow UI DOM] Dropdown selection error:`,e)}return!1}async function w(e,t){let n=b(e);if(!n)return!1;try{return n.scrollIntoView({behavior:`smooth`,block:`center`}),n.checked!==t&&n.click(),E(e),!0}catch(e){return console.error(`[Shadow UI DOM] Checkbox toggle error:`,e),!1}}async function T(e){try{let t=e?b(e):null;if(t||=document.querySelector(`input[type="submit"], button[type="submit"], [data-shadow-ui-submit="true"]`),t){t.scrollIntoView({behavior:`smooth`,block:`center`}),E(t.id||e||`submit-btn`),await new Promise(e=>setTimeout(e,300)),t.click(),x(t);let n=t.closest(`form`);return n&&(n.requestSubmit?n.requestSubmit():n.submit()),!0}let n=document.querySelector(`form`);if(n)return n.requestSubmit?n.requestSubmit():n.submit(),!0}catch(e){console.error(`[Shadow UI DOM] Form submission error:`,e)}return!1}function E(e){y();let t=b(e);t&&(t.classList.remove(`shadow-ui-field-highlight`),t.offsetWidth,t.classList.add(`shadow-ui-field-highlight`),setTimeout(()=>{t.classList.remove(`shadow-ui-field-highlight`)},3600))}var D={"correspondence address":{explanation:`This field asks where you currently receive official physical mail and documents.`,tip:`Provide your primary residential or mailing address.`},address:{explanation:`Enter your street address including building number and street name.`,tip:`Make sure this matches your official identification.`},ssn:{explanation:`Social Security Number for tax or identity verification.`,tip:`Ensure secure HTTPS connection before entering sensitive identifiers.`},tin:{explanation:`Taxpayer Identification Number required for government tax filings.`,tip:`Usually 9 digits long.`},email:{explanation:`Your electronic mail address for digital confirmation and receipts.`,tip:`Use an active email address you check frequently.`},phone:{explanation:`Contact phone number for SMS verification or customer support.`,tip:`Include country code if applying internationally.`},zip:{explanation:`Postal or zip code for your geographic region.`,tip:`Used for shipping calculations and address validation.`}};function O(e,t=``){let n=(t||e).toLowerCase(),r={explanation:`This input field ("${t||e}") collects specific information required to process your request.`,tip:`Fill with accurate information according to your profile.`};for(let e of Object.keys(D))if(n.includes(e)){r=D[e];break}return{elementId:e,label:t||e,explanation:r.explanation,usageTip:r.tip}}function k(e){let t=e.getAttribute(`aria-label`);if(t&&t.trim())return t.trim();let n=e.getAttribute(`aria-labelledby`);if(n){let e=document.getElementById(n);if(e&&e.innerText.trim())return e.innerText.trim()}if(e.id){let t=document.querySelector(`label[for="${CSS.escape(e.id)}"]`);if(t&&t.innerText.trim())return t.innerText.trim()}let r=e.closest(`label`);if(r){let e=r.cloneNode(!0);if(e.querySelectorAll(`input, select, textarea`).forEach(e=>e.remove()),e.innerText.trim())return e.innerText.trim()}let i=e.getAttribute(`placeholder`);if(i&&i.trim())return i.trim();let a=e.getAttribute(`name`);if(a&&a.trim())return a.replace(/[-_]/g,` `).replace(/([A-Z])/g,` $1`).trim();let o=e.getAttribute(`title`);if(o&&o.trim())return o.trim();let s=e.previousElementSibling;for(;s;){if([`LABEL`,`SPAN`,`DIV`,`P`,`H1`,`H2`,`H3`,`H4`].includes(s.tagName)){let e=s.innerText.trim();if(e.length>0&&e.length<50)return e}s=s.previousElementSibling}return`Input Field`}function A(e,t){return e.id?e.id:e.getAttribute(`name`)?`field-${e.getAttribute(`name`)}`:`shadow-ui-field-${t}`}function j(e){if(e.tagName===`SELECT`)return Array.from(e.options).filter(e=>e.value||e.text.trim()).map(e=>({value:e.value||e.text.trim(),label:e.text.trim()||e.value}));let t=e.getAttribute(`role`);if(t===`combobox`||t===`listbox`||e.hasAttribute(`aria-expanded`)){let t=e.getAttribute(`aria-controls`)||e.getAttribute(`aria-owns`),n=[];if(t){let e=document.getElementById(t);e&&(n=Array.from(e.querySelectorAll(`[role="option"], li, div[data-value]`)))}if(n.length===0&&(n=Array.from(document.querySelectorAll(`[role="option"]`))),n.length>0)return n.map(e=>{let t=e.innerText.trim();return{value:e.getAttribute(`data-value`)||e.getAttribute(`value`)||t,label:t}})}return[]}function M(){let e=Array.from(document.querySelectorAll(`input[type="submit"], button[type="submit"], button, [role="button"]`)).filter(e=>!e.closest(`#shadow-ui-root-host`)&&e.offsetWidth>0&&e.offsetHeight>0),t=[`submit`,`send`,`register`,`apply`,`post`,`save`,`confirm`,`place order`,`checkout`];for(let n of e){let e=n.getAttribute(`type`),r=(n.innerText||n.value||n.getAttribute(`aria-label`)||``).toLowerCase().trim();if(e===`submit`||t.some(e=>r.includes(e))){let e=n.id;return e||(e=`shadow-ui-submit-btn-${Date.now()}`,n.id=e),n.setAttribute(`data-shadow-ui-submit`,`true`),{id:e,label:n.innerText.trim()||n.value||`Submit Form`}}}}function N(){let e=Array.from(document.querySelectorAll(`input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea, [role="combobox"]`)).filter(e=>!e.closest(`#shadow-ui-root-host`)&&e.offsetWidth>0&&e.offsetHeight>0).map((e,t)=>{let n=k(e),r=e.getAttribute(`placeholder`)||``,i=e.getAttribute(`name`)||``,a=(e.getAttribute(`type`)||e.tagName.toLowerCase()).toLowerCase();(e.getAttribute(`role`)===`combobox`||e.tagName===`SELECT`)&&(a=`select`);let o=e.hasAttribute(`required`)||e.getAttribute(`aria-required`)===`true`,s=e.value||``,c=e.getBoundingClientRect(),l=window.scrollY||document.documentElement.scrollTop,u=window.scrollX||document.documentElement.scrollLeft,d=j(e),f=d.length>0?d:void 0,p=A(e,t);return e.getAttribute(`data-shadow-ui-id`)||e.setAttribute(`data-shadow-ui-id`,p),{id:p,label:n,placeholder:r,name:i,type:a,required:o,options:f,value:s,position:{top:Math.round(c.top+l),left:Math.round(c.left+u)}}}),t=document.title||`Web Form`,n=document.querySelector(`h1, h2, form legend`);n&&n.innerText.trim()&&(t=n.innerText.trim());let r=M();return{title:t,fields:e,submitButtonId:r?.id,submitButtonLabel:r?.label}}function P(e,t,n){let r=`${e} ${t}`.toLowerCase();return n.inputs===1&&(r.includes(`search`)||r.includes(`google`)||r.includes(`bing`))?{purpose:`Search Engine Portal`,pageType:`search_engine`}:n.inputs>=3||r.includes(`apply`)||r.includes(`register`)||r.includes(`form`)||r.includes(`gov`)||r.includes(`service`)?{purpose:`Citizen / Service Application Portal`,pageType:`form_application`}:r.includes(`shop`)||r.includes(`amazon`)||r.includes(`cart`)||r.includes(`checkout`)||r.includes(`store`)?{purpose:`E-Commerce Shopping Website`,pageType:`ecommerce`}:r.includes(`edu`)||r.includes(`portal`)||r.includes(`student`)||r.includes(`course`)||r.includes(`academic`)?{purpose:`Academic Learning Management System`,pageType:`academic`}:{purpose:`Knowledge & Information Portal`,pageType:`information`}}function F(){let e=window.location.href,t=document.title||`Webpage`,n=window.location.hostname||`Website`,r=Array.from(document.querySelectorAll(`form`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),i=Array.from(document.querySelectorAll(`input:not([type="hidden"]), select, textarea`)).filter(e=>!e.closest(`#shadow-ui-root-host`)&&e.offsetWidth>0),a=Array.from(document.querySelectorAll(`button, input[type="submit"], input[type="button"]`)).filter(e=>!e.closest(`#shadow-ui-root-host`)&&e.offsetWidth>0),o=Array.from(document.querySelectorAll(`a[href]`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),s=Array.from(document.querySelectorAll(`img`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),c=Array.from(document.querySelectorAll(`table`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),l=Array.from(document.querySelectorAll(`p`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),u=[],d=0;i.forEach(e=>{e.getAttribute(`aria-label`)||e.getAttribute(`aria-labelledby`)||e.getAttribute(`placeholder`)||e.id&&document.querySelector(`label[for="${CSS.escape(e.id)}"]`)||e.closest(`label`)||d++}),d>0&&u.push({type:`unlabelled_input`,severity:`high`,message:`${d} input field${d===1?``:`s`} missing accessible ARIA labels.`});let f=0;s.forEach(e=>{e.getAttribute(`alt`)||f++}),f>0&&u.push({type:`missing_alt_tag`,severity:`medium`,message:`${f} image${f===1?``:`s`} missing descriptive alt text.`});let p={forms:r.length,inputs:i.length,buttons:a.length,links:o.length,images:s.length,tables:c.length,paragraphs:l.length,unlabelledInputs:d},{purpose:m,pageType:h}=P(e,t,p);return{url:e,title:t,domain:n,purpose:m,pageType:h,summary:`Shadow UI analyzed ${n}: ${p.inputs} input field${p.inputs===1?``:`s`}, ${p.buttons} button${p.buttons===1?``:`s`}, and ${p.links} link${p.links===1?``:`s`}.`,counts:p,accessibilityIssues:u}}function I(e=``){let t=(e||(typeof window<`u`?window.location.href:``)).toLowerCase();return t.includes(`meet.google.com`)?{isMeeting:!0,platform:`Google Meet`,detectedUrl:t}:t.includes(`zoom.us`)||t.includes(`app.zoom.us`)?{isMeeting:!0,platform:`Zoom`,detectedUrl:t}:t.includes(`teams.microsoft.com`)||t.includes(`teams.live.com`)?{isMeeting:!0,platform:`Microsoft Teams`,detectedUrl:t}:{isMeeting:!1,platform:`None`,detectedUrl:t}}var L={name:``,age:``,ageGroup:``,email:``,phone:``,address:``,city:``,country:``,postalCode:``,preferredLanguage:`English`,accessibilityNeeds:[],readingSupport:!0,formSupport:!0,navigationSupport:!0,preferredContrast:`default`,preferredTextSize:`default`,autoApplyPreferences:!0,voicePreferences:{enabled:!0,language:`en-US`,continuousMode:!1,autoSpeakResponses:!0},updatedAt:``},R={largeText:!1,highContrast:!1,dyslexiaFont:!1,reducedMotion:!1,voiceAssist:!0,simplifiedWording:!1,largeControls:!1,screenReaderOptimized:!1},z={SETTINGS:`shadow_ui_accessibility_settings`,PROFILE:`shadow_ui_user_profile`,FORM_SESSION:`shadow_ui_active_form_session`,BRAIN_LOGS:`shadow_ui_brain_logs`,CONVERSATION_STATE:`shadow_ui_conversation_state`,MEET_SETTINGS:`shadow_ui_meet_assist_settings`};function B(){return typeof chrome<`u`&&chrome.storage&&chrome.storage.local!==void 0}async function V(){if(B())return new Promise(e=>{chrome.storage.local.get([z.SETTINGS],t=>{e(t[z.SETTINGS]||R)})});try{let e=localStorage.getItem(z.SETTINGS);return e?JSON.parse(e):R}catch{return R}}async function H(){if(B())return new Promise(e=>{chrome.storage.local.get([z.PROFILE],t=>{e(t[z.PROFILE]||L)})});try{let e=localStorage.getItem(z.PROFILE);return e?JSON.parse(e):L}catch{return L}}function U(e){if(!B())return()=>{};let t=(t,n)=>{n===`local`&&e({profile:t[z.PROFILE]?.newValue,settings:t[z.SETTINGS]?.newValue,formSession:t[z.FORM_SESSION]?.newValue,brainLogs:t[z.BRAIN_LOGS]?.newValue,meetSettings:t[z.MEET_SETTINGS]?.newValue})};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}function W(e){let{userProfile:t,settings:n}=e;if(!t.autoApplyPreferences)return{};let r={};return t.preferredTextSize===`large`&&!n.largeText&&(r.largeText=!0),t.preferredContrast===`high`&&!n.highContrast&&(r.highContrast=!0),r}function G(){let e=[],t=new Set;return Array.from(document.querySelectorAll(`button, a, input[type="button"], input[type="submit"], [role="button"]`)).forEach((n,r)=>{let i=`${(n.textContent||n.value||``).trim()} ${(n.getAttribute(`aria-label`)||``).trim()}`.toLowerCase();if(i.includes(`add to cart`)||i.includes(`add to basket`)||i.includes(`add`)||i===`+`||i.includes(`buy now`)){let i=n.parentElement,a=0,o=``,s=``;for(;i&&a<5;){let e=i.querySelector(`h1, h2, h3, h4, h5, [class*="title"], [class*="name"], [class*="product"]`);e&&e.textContent&&e.textContent.trim().length>2&&(o=e.textContent.trim());let t=i.querySelector(`[class*="price"], [class*="amount"], span, div`);if(t&&t.textContent){let e=t.textContent.trim();/[₹$€£]\s*\d+|\d+\s*rs/i.test(e)&&(s=e.match(/[₹$€£]\s*\d+[\d,.]*|\d+\s*rs/i)?.[0]||e)}if(o)break;i=i.parentElement,a++}o&&!t.has(o.toLowerCase())&&(t.add(o.toLowerCase()),n.setAttribute(`data-shadow-ui-add-btn`,`btn-${r}`),e.push({title:o,price:s||void 0,hasAddButton:!0,elementId:`btn-${r}`}))}}),e}async function K(e){if(!e||!e.trim())return!1;let t=document.querySelector(`input[type="search"], input[placeholder*="search" i], input[placeholder*="find" i], input[name*="search" i], input[id*="search" i]`);if(!t)return!1;t.focus(),t.value=e,t.dispatchEvent(new Event(`input`,{bubbles:!0})),t.dispatchEvent(new Event(`change`,{bubbles:!0})),t.dispatchEvent(new KeyboardEvent(`keydown`,{key:`Enter`,keyCode:13,bubbles:!0})),t.dispatchEvent(new KeyboardEvent(`keyup`,{key:`Enter`,keyCode:13,bubbles:!0}));let n=t.form||t.closest(`form`);if(n){let e=n.querySelector(`button[type="submit"], input[type="submit"]`);e&&e.click()}return!0}async function q(e,t=1){let n=G(),r=e.toLowerCase().trim();if(n.length===0)return{success:!1,message:`No product cards with Add buttons detected on this webpage.`};let i=n.find(e=>e.title.toLowerCase()===r);if(i||=n.find(e=>e.title.toLowerCase().includes(r)||r.includes(e.title.toLowerCase())),!i){let e=r.split(/\s+/).filter(e=>e.length>2);i=n.find(t=>e.some(e=>t.title.toLowerCase().includes(e)))}if(!i||!i.elementId)return{success:!1,message:`I couldn't find "${e}" on this page. Available items: ${n.map(e=>e.title).slice(0,3).join(`, `)||`None`}.`};let a=document.querySelector(`[data-shadow-ui-add-btn="${i.elementId}"]`);if(!a)return{success:!1,matchedTitle:i.title,message:`Found "${i.title}", but could not interact with the Add button.`};for(let e=0;e<Math.max(1,t);e++)a.click(),a.dispatchEvent(new MouseEvent(`click`,{bubbles:!0}));return{success:!0,matchedTitle:i.title,message:`✓ Added "${i.title}" to your cart.`}}(function(){if(window.__SHADOW_UI_CONTENT_SCRIPT_INITIALIZED__)return;window.__SHADOW_UI_CONTENT_SCRIPT_INITIALIZED__=!0;let e=!1,t=document.createElement(`div`);t.id=`shadow-ui-root-host`,t.style.cssText=`position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 2147483647; pointer-events: none;`,document.documentElement.appendChild(t);let n=t.attachShadow({mode:`open`}),r=document.createElement(`style`);r.textContent=`
    .shadow-ui-floating-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      pointer-events: auto;
      display: flex;
      items-center;
      gap: 8px;
      padding: 10px 18px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 800;
      font-size: 13px;
      border: none;
      border-radius: 9999px;
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4), 0 8px 10px -6px rgba(79, 70, 229, 0.3);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .shadow-ui-floating-btn:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 14px 30px -5px rgba(79, 70, 229, 0.5);
    }
    .shadow-ui-btn-icon {
      font-size: 16px;
    }
    .shadow-ui-badge {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
    }
    .shadow-ui-panel-iframe {
      position: fixed;
      top: 0;
      right: -420px;
      width: 420px;
      height: 100vh;
      z-index: 2147483646;
      pointer-events: auto;
      border: none;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
      transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      background: transparent;
    }
    .shadow-ui-panel-iframe.open {
      right: 0;
    }
    .shadow-ui-copilot-toast {
      position: fixed;
      bottom: 80px;
      right: 24px;
      z-index: 2147483645;
      pointer-events: auto;
      background: #0f172a;
      color: #f8fafc;
      padding: 12px 16px;
      border-radius: 16px;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      opacity: 0;
      transform: translateY(10px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    .shadow-ui-copilot-toast.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    .shadow-ui-toast-btn {
      padding: 6px 12px;
      background: #4f46e5;
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
    }
  `,n.appendChild(r);let i=document.createElement(`button`);i.className=`shadow-ui-floating-btn`,i.setAttribute(`title`,`Open AccessLayer Accessibility Panel`),i.innerHTML=`
    <span class="shadow-ui-btn-icon">✨</span>
    <span>Shadow UI</span>
    <span class="shadow-ui-badge"></span>
  `,n.appendChild(i);let a=document.createElement(`iframe`);a.className=`shadow-ui-panel-iframe`,a.allow=`camera; microphone; display-capture; autoplay`,a.setAttribute(`allow`,`camera; microphone; display-capture; autoplay`),a.src=typeof chrome<`u`&&chrome.runtime?.getURL?chrome.runtime.getURL(`extension/sidebar/index.html`):``,n.appendChild(a);let o=document.createElement(`div`);o.className=`shadow-ui-copilot-toast`,n.appendChild(o);function s(e,t=`Help me`,n){o.innerHTML=`
      <span>✨ <strong>Shadow UI:</strong> ${e}</span>
      <button class="shadow-ui-toast-btn">${t}</button>
    `,o.classList.add(`visible`);let r=o.querySelector(`.shadow-ui-toast-btn`);r&&r.addEventListener(`click`,()=>{o.classList.remove(`visible`),c(!0),n&&n()}),setTimeout(()=>{o.classList.remove(`visible`)},8e3)}function c(t){e=t,t?(a.classList.add(`open`),i.style.display=`none`,document.body.style.transition=`margin-right 0.35s cubic-bezier(0.16, 1, 0.3, 1)`,document.body.style.marginRight=`420px`):(a.classList.remove(`open`),i.style.display=`flex`,document.body.style.marginRight=`0px`)}i.addEventListener(`click`,()=>{c(!e)});async function l(e){d(e),e.simplifiedWording?await g():_()}(async()=>{try{let e=await V(),t=await H(),n=W({userProfile:t,settings:e}),r={...e,...n};r&&await l(r);let i=I(window.location.href);i.isMeeting?setTimeout(()=>{s(`${i.platform} detected. Accessibility assistance available.`,`Open Meet Assist`,()=>{a.contentWindow?.postMessage({type:`SWITCH_TAB`,payload:{tab:`meetAssist`,autoStart:!0,meetingContext:i}},`*`),typeof chrome<`u`&&chrome.runtime?.sendMessage&&chrome.runtime.sendMessage({type:`SWITCH_TAB`,payload:{tab:`meetAssist`,autoStart:!0,meetingContext:i}})})},1500):setTimeout(()=>{let e=N();e.fields.length>=3&&t.formSupport&&s(`I found an application form (${e.fields.length} fields). Guide filling?`,`Help Fill`,()=>{a.contentWindow?.postMessage({type:`SWITCH_TAB`,payload:{tab:`formFiller`}},`*`),typeof chrome<`u`&&chrome.runtime?.sendMessage&&chrome.runtime.sendMessage({type:`SWITCH_TAB`,payload:{tab:`formFiller`}})})},2e3)}catch(e){console.warn(`[Shadow UI Content Script] Error restoring preferences or detecting meeting:`,e)}})(),U(({settings:e})=>{e&&l(e)}),typeof chrome<`u`&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener((t,n,r)=>((async()=>{try{if(t.type===`TOGGLE_PANEL`)c(t.payload?.isOpen===void 0?!e:t.payload.isOpen),r({success:!0,isOpen:e});else if(t.type===`OPEN_PANEL`)c(!0),r({success:!0,isOpen:!0});else if(t.type===`CLOSE_PANEL`)c(!1),r({success:!0,isOpen:!1});else if(t.type===`SETTINGS_UPDATED`)t.payload&&await l(t.payload),r({success:!0});else if(t.type===`ANALYZE_PAGE_FORM`)r({form:N()});else if(t.type===`ANALYZE_PAGE_INTELLIGENCE`)r({analysis:F()});else if(t.type===`EXPLAIN_ELEMENT_DOM`){let{elementId:e,label:n}=t.payload||{};r({success:!0,explanation:O(e,n)})}else if(t.type===`SHOW_COPILOT_TOAST`){let{message:e,buttonText:n,targetTab:i}=t.payload||{};s(e||`Meeting accessibility assistance available.`,n||`Help Fill`,()=>{let e=i||(n===`Help Fill`?`formFiller`:`accessibility`);a.contentWindow?.postMessage({type:`SWITCH_TAB`,payload:{tab:e}},`*`),typeof chrome<`u`&&chrome.runtime?.sendMessage&&chrome.runtime.sendMessage({type:`SWITCH_TAB`,payload:{tab:e}})}),r({success:!0})}else if(t.type===`FILL_FIELD_DOM`){let{fieldId:e,value:n,fieldType:i}=t.payload||{},a=!1;a=i===`select`?await C(e,n):i===`checkbox`?await w(e,n===`true`||n===!0):await S(e,n),r({success:a})}else if(t.type===`SUBMIT_FORM_DOM`){let{submitButtonId:e}=t.payload||{};r({success:await T(e)})}else if(t.type===`HIGHLIGHT_FIELD_DOM`){let{fieldId:e}=t.payload||{};E(e),r({success:!0})}else if(t.type===`SEARCH_PRODUCT_DOM`){let{query:e}=t.payload||{};r({success:await K(e)})}else if(t.type===`ADD_TO_CART_DOM`){let{query:e,quantity:n}=t.payload||{};r(await q(e,n))}else t.type===`EXTRACT_PRODUCTS_DOM`&&r({products:G()})}catch(e){console.error(`[Shadow UI Content Script] Message execution error:`,e),r({error:String(e)})}})(),!0)),window.addEventListener(`message`,async e=>{if(e.data){if(e.data.type===`CLOSE_PANEL`)c(!1);else if(e.data.type===`ANALYZE_PAGE_FORM`){let t=N();e.source&&e.source.postMessage({type:`FORM_ANALYSIS_RESPONSE`,form:t},`*`)}else if(e.data.type===`ANALYZE_PAGE_INTELLIGENCE`){let t=F();e.source&&e.source.postMessage({type:`PAGE_INTELLIGENCE_RESPONSE`,analysis:t},`*`)}else if(e.data.type===`SHOW_COPILOT_TOAST`){let{message:t,buttonText:n,targetTab:r}=e.data.payload||{};s(t||`Meeting accessibility assistance available.`,n||`Help Fill`,()=>{let e=r||(n===`Help Fill`?`formFiller`:`accessibility`);a.contentWindow?.postMessage({type:`SWITCH_TAB`,payload:{tab:e}},`*`),typeof chrome<`u`&&chrome.runtime?.sendMessage&&chrome.runtime.sendMessage({type:`SWITCH_TAB`,payload:{tab:e}})})}else if(e.data.type===`FILL_FIELD_DOM`){let{fieldId:t,value:n,fieldType:r}=e.data.payload||{};r===`select`?await C(t,n):r===`checkbox`?await w(t,n===`true`||n===!0):await S(t,n)}else if(e.data.type===`SUBMIT_FORM_DOM`){let{submitButtonId:t}=e.data.payload||{};await T(t)}else if(e.data.type===`HIGHLIGHT_FIELD_DOM`){let{fieldId:t}=e.data.payload||{};E(t)}else if(e.data.type===`SEARCH_PRODUCT_DOM`){let{query:t}=e.data.payload||{};await K(t)}else if(e.data.type===`ADD_TO_CART_DOM`){let{query:t,quantity:n}=e.data.payload||{};await q(t,n)}else if(e.data.type===`EXTRACT_PRODUCTS_DOM`){let t=G();e.source&&e.source.postMessage({type:`EXTRACT_PRODUCTS_RESPONSE`,products:t},`*`)}}})})()})();