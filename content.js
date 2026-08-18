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
      `,c.setAttribute(`title`,`Original: "${a}"\nSimple: "${t}"`),e.appendChild(c),n++}}console.log(`[Shadow UI TextSimplifier] Created ${n} non-destructive simple language overlays.`)}function _(){let e=document.getElementById(h);e&&e.remove()}var v={name:`Srihari Selvarajan`,age:`28`,ageGroup:`18-35`,email:`srihari@example.com`,phone:`+1 (555) 234-5678`,address:`123 Innovation Way`,city:`San Francisco`,country:`United States`,postalCode:`94105`,preferredLanguage:`English`,accessibilityNeeds:[`low_vision`,`cognitive_support`],readingSupport:!0,formSupport:!0,navigationSupport:!0,preferredContrast:`default`,preferredTextSize:`default`,autoApplyPreferences:!0,updatedAt:new Date().toISOString()},y={largeText:!1,highContrast:!1,dyslexiaFont:!1,reducedMotion:!1,voiceAssist:!0,simplifiedWording:!1,largeControls:!1,screenReaderOptimized:!1},b={SETTINGS:`shadow_ui_accessibility_settings`,PROFILE:`shadow_ui_user_profile`,FORM_SESSION:`shadow_ui_active_form_session`,BRAIN_LOGS:`shadow_ui_brain_logs`,CONVERSATION_STATE:`shadow_ui_conversation_state`,MEET_SETTINGS:`shadow_ui_meet_assist_settings`};function x(){return typeof chrome<`u`&&chrome.storage&&chrome.storage.local!==void 0}async function S(){if(x())return new Promise(e=>{chrome.storage.local.get([b.SETTINGS],t=>{e(t[b.SETTINGS]||y)})});try{let e=localStorage.getItem(b.SETTINGS);return e?JSON.parse(e):y}catch{return y}}async function C(){if(x())return new Promise(e=>{chrome.storage.local.get([b.PROFILE],t=>{e(t[b.PROFILE]||v)})});try{let e=localStorage.getItem(b.PROFILE);return e?JSON.parse(e):v}catch{return v}}function w(e){if(!x())return()=>{};let t=(t,n)=>{n===`local`&&e({profile:t[b.PROFILE]?.newValue,settings:t[b.SETTINGS]?.newValue,formSession:t[b.FORM_SESSION]?.newValue,brainLogs:t[b.BRAIN_LOGS]?.newValue,meetSettings:t[b.MEET_SETTINGS]?.newValue})};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}function T(e){let t=e.getAttribute(`aria-label`);if(t&&t.trim())return t.trim();let n=e.getAttribute(`aria-labelledby`);if(n){let e=document.getElementById(n);if(e&&e.innerText.trim())return e.innerText.trim()}if(e.id){let t=document.querySelector(`label[for="${CSS.escape(e.id)}"]`);if(t&&t.innerText.trim())return t.innerText.trim()}let r=e.closest(`label`);if(r){let e=r.cloneNode(!0);if(e.querySelectorAll(`input, select, textarea`).forEach(e=>e.remove()),e.innerText.trim())return e.innerText.trim()}let i=e.getAttribute(`placeholder`);if(i&&i.trim())return i.trim();let a=e.getAttribute(`name`);if(a&&a.trim())return a.replace(/[-_]/g,` `).replace(/([A-Z])/g,` $1`).trim();let o=e.getAttribute(`title`);if(o&&o.trim())return o.trim();let s=e.previousElementSibling;for(;s;){if([`LABEL`,`SPAN`,`DIV`,`P`,`H1`,`H2`,`H3`,`H4`].includes(s.tagName)){let e=s.innerText.trim();if(e.length>0&&e.length<50)return e}s=s.previousElementSibling}return`Input Field`}function E(e,t){return e.id?e.id:e.getAttribute(`name`)?`field-${e.getAttribute(`name`)}`:`shadow-ui-field-${t}`}function D(e){if(e.tagName===`SELECT`)return Array.from(e.options).filter(e=>e.value||e.text.trim()).map(e=>({value:e.value||e.text.trim(),label:e.text.trim()||e.value}));let t=e.getAttribute(`role`);if(t===`combobox`||t===`listbox`||e.hasAttribute(`aria-expanded`)){let t=e.getAttribute(`aria-controls`)||e.getAttribute(`aria-owns`),n=[];if(t){let e=document.getElementById(t);e&&(n=Array.from(e.querySelectorAll(`[role="option"], li, div[data-value]`)))}if(n.length===0&&(n=Array.from(document.querySelectorAll(`[role="option"]`))),n.length>0)return n.map(e=>{let t=e.innerText.trim();return{value:e.getAttribute(`data-value`)||e.getAttribute(`value`)||t,label:t}})}return[]}function O(){let e=Array.from(document.querySelectorAll(`input[type="submit"], button[type="submit"], button, [role="button"]`)).filter(e=>!e.closest(`#shadow-ui-root-host`)&&e.offsetWidth>0&&e.offsetHeight>0),t=[`submit`,`send`,`register`,`apply`,`post`,`save`,`confirm`,`place order`,`checkout`];for(let n of e){let e=n.getAttribute(`type`),r=(n.innerText||n.value||n.getAttribute(`aria-label`)||``).toLowerCase().trim();if(e===`submit`||t.some(e=>r.includes(e))){let e=n.id;return e||(e=`shadow-ui-submit-btn-${Date.now()}`,n.id=e),n.setAttribute(`data-shadow-ui-submit`,`true`),{id:e,label:n.innerText.trim()||n.value||`Submit Form`}}}}function k(){let e=Array.from(document.querySelectorAll(`input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea, [role="combobox"]`)).filter(e=>!e.closest(`#shadow-ui-root-host`)&&e.offsetWidth>0&&e.offsetHeight>0).map((e,t)=>{let n=T(e),r=e.getAttribute(`placeholder`)||``,i=e.getAttribute(`name`)||``,a=(e.getAttribute(`type`)||e.tagName.toLowerCase()).toLowerCase();(e.getAttribute(`role`)===`combobox`||e.tagName===`SELECT`)&&(a=`select`);let o=e.hasAttribute(`required`)||e.getAttribute(`aria-required`)===`true`,s=e.value||``,c=e.getBoundingClientRect(),l=window.scrollY||document.documentElement.scrollTop,u=window.scrollX||document.documentElement.scrollLeft,d=D(e),f=d.length>0?d:void 0,p=E(e,t);return e.getAttribute(`data-shadow-ui-id`)||e.setAttribute(`data-shadow-ui-id`,p),{id:p,label:n,placeholder:r,name:i,type:a,required:o,options:f,value:s,position:{top:Math.round(c.top+l),left:Math.round(c.left+u)}}}),t=document.title||`Web Form`,n=document.querySelector(`h1, h2, form legend`);n&&n.innerText.trim()&&(t=n.innerText.trim());let r=O();return{title:t,fields:e,submitButtonId:r?.id,submitButtonLabel:r?.label}}var A=`shadow-ui-form-highlight-style`;function j(){if(!document.getElementById(A)){let e=document.createElement(`style`);e.id=A,e.textContent=`
      @keyframes shadowUiGreenGlow {
        0% { outline: 3px solid #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.8); }
        50% { outline: 4px solid #34d399; box-shadow: 0 0 25px rgba(52, 211, 153, 1); }
        100% { outline: 2px solid rgba(16, 185, 129, 0.4); box-shadow: 0 0 8px rgba(16, 185, 129, 0.3); }
      }
      .shadow-ui-field-highlight {
        animation: shadowUiGreenGlow 1.8s ease-in-out 2 !important;
        border-color: #10b981 !important;
      }
    `,document.head.appendChild(e)}}function M(e){if(!e)return null;let t=document.getElementById(e);return t||(t=document.querySelector(`[data-shadow-ui-id="${CSS.escape(e)}"]`),t)||(t=document.querySelector(`[name="${CSS.escape(e)}"]`),t)||(t=document.querySelector(`[data-shadow-ui-submit="true"]`),t)?t:null}function N(e){e.dispatchEvent(new Event(`input`,{bubbles:!0})),e.dispatchEvent(new Event(`change`,{bubbles:!0}))}async function P(e,t){let n=M(e);if(!n)return console.warn(`[Shadow UI DOM] Field not found: ${e}`),!1;try{n.scrollIntoView({behavior:`smooth`,block:`center`}),n.focus();let r=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,`value`)?.set,i=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,`value`)?.set;return n instanceof HTMLInputElement&&r?r.call(n,t):n instanceof HTMLTextAreaElement&&i?i.call(n,t):n.value=t,N(n),R(e),!0}catch(t){return console.error(`[Shadow UI DOM] Failed to fill field ${e}:`,t),!1}}async function F(e,t){let n=M(e);if(!n)return!1;try{if(n.scrollIntoView({behavior:`smooth`,block:`center`}),n.tagName===`SELECT`){let r=n;r.focus();let i=t.toLowerCase().trim(),a=Array.from(r.options).find(e=>e.value.toLowerCase().trim()===i||e.text.toLowerCase().trim()===i||e.text.toLowerCase().includes(i)||i.includes(e.text.toLowerCase().trim()));if(a){let t=Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype,`value`)?.set;return t?t.call(r,a.value):r.value=a.value,a.selected=!0,N(r),R(e),!0}}n.click(),n.focus(),await new Promise(e=>setTimeout(e,150));let r=Array.from(document.querySelectorAll(`[role="option"], li, div[data-value]`)),i=t.toLowerCase().trim(),a=r.find(e=>{let t=e.innerText.toLowerCase().trim(),n=(e.getAttribute(`data-value`)||``).toLowerCase().trim();return t===i||n===i||t.includes(i)||i.includes(t)});if(a)return a.click(),R(e),!0}catch(e){console.error(`[Shadow UI DOM] Dropdown selection error:`,e)}return!1}async function I(e,t){let n=M(e);if(!n)return!1;try{return n.scrollIntoView({behavior:`smooth`,block:`center`}),n.checked!==t&&n.click(),R(e),!0}catch(e){return console.error(`[Shadow UI DOM] Checkbox toggle error:`,e),!1}}async function L(e){try{let t=e?M(e):null;if(t||=document.querySelector(`input[type="submit"], button[type="submit"], [data-shadow-ui-submit="true"]`),t){t.scrollIntoView({behavior:`smooth`,block:`center`}),R(t.id||e||`submit-btn`),await new Promise(e=>setTimeout(e,300)),t.click(),N(t);let n=t.closest(`form`);return n&&(n.requestSubmit?n.requestSubmit():n.submit()),!0}let n=document.querySelector(`form`);if(n)return n.requestSubmit?n.requestSubmit():n.submit(),!0}catch(e){console.error(`[Shadow UI DOM] Form submission error:`,e)}return!1}function R(e){j();let t=M(e);t&&(t.classList.remove(`shadow-ui-field-highlight`),t.offsetWidth,t.classList.add(`shadow-ui-field-highlight`),setTimeout(()=>{t.classList.remove(`shadow-ui-field-highlight`)},3600))}function z(e,t,n){let r=`${e} ${t}`.toLowerCase();return n.inputs===1&&(r.includes(`search`)||r.includes(`google`)||r.includes(`bing`))?{purpose:`Search Engine Portal`,pageType:`search_engine`}:n.inputs>=3||r.includes(`apply`)||r.includes(`register`)||r.includes(`form`)||r.includes(`gov`)||r.includes(`service`)?{purpose:`Citizen / Service Application Portal`,pageType:`form_application`}:r.includes(`shop`)||r.includes(`amazon`)||r.includes(`cart`)||r.includes(`checkout`)||r.includes(`store`)?{purpose:`E-Commerce Shopping Website`,pageType:`ecommerce`}:r.includes(`edu`)||r.includes(`portal`)||r.includes(`student`)||r.includes(`course`)||r.includes(`academic`)?{purpose:`Academic Learning Management System`,pageType:`academic`}:{purpose:`Knowledge & Information Portal`,pageType:`information`}}function B(){let e=window.location.href,t=document.title||`Webpage`,n=window.location.hostname||`Website`,r=Array.from(document.querySelectorAll(`form`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),i=Array.from(document.querySelectorAll(`input:not([type="hidden"]), select, textarea`)).filter(e=>!e.closest(`#shadow-ui-root-host`)&&e.offsetWidth>0),a=Array.from(document.querySelectorAll(`button, input[type="submit"], input[type="button"]`)).filter(e=>!e.closest(`#shadow-ui-root-host`)&&e.offsetWidth>0),o=Array.from(document.querySelectorAll(`a[href]`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),s=Array.from(document.querySelectorAll(`img`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),c=Array.from(document.querySelectorAll(`table`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),l=Array.from(document.querySelectorAll(`p`)).filter(e=>!e.closest(`#shadow-ui-root-host`)),u=[],d=0;i.forEach(e=>{e.getAttribute(`aria-label`)||e.getAttribute(`aria-labelledby`)||e.getAttribute(`placeholder`)||e.id&&document.querySelector(`label[for="${CSS.escape(e.id)}"]`)||e.closest(`label`)||d++}),d>0&&u.push({type:`unlabelled_input`,severity:`high`,message:`${d} input field${d===1?``:`s`} missing accessible ARIA labels.`});let f=0;s.forEach(e=>{e.getAttribute(`alt`)||f++}),f>0&&u.push({type:`missing_alt_tag`,severity:`medium`,message:`${f} image${f===1?``:`s`} missing descriptive alt text.`});let p={forms:r.length,inputs:i.length,buttons:a.length,links:o.length,images:s.length,tables:c.length,paragraphs:l.length,unlabelledInputs:d},{purpose:m,pageType:h}=z(e,t,p);return{url:e,title:t,domain:n,purpose:m,pageType:h,summary:`Shadow UI analyzed ${n}: ${p.inputs} input field${p.inputs===1?``:`s`}, ${p.buttons} button${p.buttons===1?``:`s`}, and ${p.links} link${p.links===1?``:`s`}.`,counts:p,accessibilityIssues:u}}var V={"correspondence address":{explanation:`This field asks where you currently receive official physical mail and documents.`,tip:`Provide your primary residential or mailing address.`},address:{explanation:`Enter your street address including building number and street name.`,tip:`Make sure this matches your official identification.`},ssn:{explanation:`Social Security Number for tax or identity verification.`,tip:`Ensure secure HTTPS connection before entering sensitive identifiers.`},tin:{explanation:`Taxpayer Identification Number required for government tax filings.`,tip:`Usually 9 digits long.`},email:{explanation:`Your electronic mail address for digital confirmation and receipts.`,tip:`Use an active email address you check frequently.`},phone:{explanation:`Contact phone number for SMS verification or customer support.`,tip:`Include country code if applying internationally.`},zip:{explanation:`Postal or zip code for your geographic region.`,tip:`Used for shipping calculations and address validation.`}};function H(e,t=``){let n=(t||e).toLowerCase(),r={explanation:`This input field ("${t||e}") collects specific information required to process your request.`,tip:`Fill with accurate information according to your profile.`};for(let e of Object.keys(V))if(n.includes(e)){r=V[e];break}return{elementId:e,label:t||e,explanation:r.explanation,usageTip:r.tip}}function U(e){let{userProfile:t,settings:n}=e;if(!t.autoApplyPreferences)return{};let r={};return t.preferredTextSize===`large`&&!n.largeText&&(r.largeText=!0),t.preferredContrast===`high`&&!n.highContrast&&(r.highContrast=!0),r}function W(e=``){let t=(e||(typeof window<`u`?window.location.href:``)).toLowerCase();return t.includes(`meet.google.com`)?{isMeeting:!0,platform:`Google Meet`,detectedUrl:t}:t.includes(`zoom.us`)||t.includes(`app.zoom.us`)?{isMeeting:!0,platform:`Zoom`,detectedUrl:t}:t.includes(`teams.microsoft.com`)||t.includes(`teams.live.com`)?{isMeeting:!0,platform:`Microsoft Teams`,detectedUrl:t}:{isMeeting:!1,platform:`None`,detectedUrl:t}}(function(){if(document.getElementById(`shadow-ui-root-host`))return;let e=!1,t=document.createElement(`div`);t.id=`shadow-ui-root-host`,t.style.position=`fixed`,t.style.top=`0`,t.style.right=`0`,t.style.width=`0`,t.style.height=`0`,t.style.zIndex=`2147483647`,t.style.pointerEvents=`none`;let n=t.attachShadow({mode:`open`});document.documentElement.appendChild(t);let r=document.createElement(`style`);r.textContent=`
    .shadow-ui-floating-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 24px;
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      border-radius: 9999px;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.01em;
      cursor: pointer;
      user-select: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .shadow-ui-floating-btn:hover {
      transform: translateY(-2px) scale(1.04);
      border-color: #cbd5e1;
      box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.2), 0 8px 10px -4px rgba(0, 0, 0, 0.08);
      background: #f8fafc;
    }

    .shadow-ui-floating-btn:active {
      transform: translateY(0) scale(0.98);
    }

    .shadow-ui-btn-icon {
      width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      border-radius: 50%;
      color: #ffffff;
      font-size: 13px;
    }

    .shadow-ui-badge {
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    .shadow-ui-panel-iframe {
      position: fixed;
      top: 0;
      right: 0;
      width: 420px;
      height: 100vh;
      border: none;
      z-index: 2147483646;
      pointer-events: auto;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      transform: translateX(100%);
      box-shadow: -10px 0 35px rgba(0, 0, 0, 0.12);
      background: transparent;
    }

    .shadow-ui-panel-iframe.open {
      transform: translateX(0);
    }

    /* Subtle Copilot Suggestion Toast (Light Theme) */
    .shadow-ui-copilot-toast {
      position: fixed;
      bottom: 90px;
      right: 24px;
      z-index: 2147483645;
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.1);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transform: translateY(20px);
      opacity: 0;
    }

    .shadow-ui-copilot-toast.visible {
      transform: translateY(0);
      opacity: 1;
    }

    .shadow-ui-toast-btn {
      padding: 6px 14px;
      background: #6366f1;
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
  `,n.appendChild(i);let a=document.createElement(`iframe`);a.className=`shadow-ui-panel-iframe`,a.src=typeof chrome<`u`&&chrome.runtime?.getURL?chrome.runtime.getURL(`extension/sidebar/index.html`):``,n.appendChild(a);let o=document.createElement(`div`);o.className=`shadow-ui-copilot-toast`,n.appendChild(o);function s(e,t=`Help me`,n){o.innerHTML=`
      <span>✨ <strong>Shadow UI:</strong> ${e}</span>
      <button class="shadow-ui-toast-btn">${t}</button>
    `,o.classList.add(`visible`);let r=o.querySelector(`.shadow-ui-toast-btn`);r&&r.addEventListener(`click`,()=>{o.classList.remove(`visible`),c(!0),n&&n()}),setTimeout(()=>{o.classList.remove(`visible`)},8e3)}function c(t){e=t,t?(a.classList.add(`open`),i.style.opacity=`0.3`,document.body.style.transition=`margin-right 0.35s cubic-bezier(0.16, 1, 0.3, 1)`,document.body.style.marginRight=`420px`):(a.classList.remove(`open`),i.style.opacity=`1`,document.body.style.marginRight=`0px`)}i.addEventListener(`click`,()=>{c(!e)});async function l(e){d(e),e.simplifiedWording?await g():_()}(async()=>{try{let e=await S(),t=await C(),n=U({userProfile:t,settings:e}),r={...e,...n};r&&await l(r);let i=W(window.location.href);i.isMeeting?setTimeout(()=>{s(`${i.platform} detected. Accessibility assistance available.`,`Open Meet Assist`)},1500):setTimeout(()=>{let e=k();e.fields.length>=3&&t.formSupport&&s(`I found an application form (${e.fields.length} fields). Guide filling?`,`Help Fill`)},2e3)}catch(e){console.warn(`[Shadow UI Content Script] Error restoring preferences or detecting meeting:`,e)}})(),w(({settings:e})=>{e&&l(e)}),typeof chrome<`u`&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener((t,n,r)=>((async()=>{try{if(t.type===`TOGGLE_PANEL`)c(t.payload?.isOpen===void 0?!e:t.payload.isOpen),r({success:!0,isOpen:e});else if(t.type===`OPEN_PANEL`)c(!0),r({success:!0,isOpen:!0});else if(t.type===`CLOSE_PANEL`)c(!1),r({success:!0,isOpen:!1});else if(t.type===`SETTINGS_UPDATED`)t.payload&&await l(t.payload),r({success:!0});else if(t.type===`ANALYZE_PAGE_FORM`)r({success:!0,form:k()});else if(t.type===`ANALYZE_PAGE_INTELLIGENCE`)r({success:!0,analysis:B()});else if(t.type===`EXPLAIN_ELEMENT_DOM`){let{elementId:e,label:n}=t.payload||{};r({success:!0,explanation:H(e,n)})}else if(t.type===`SHOW_COPILOT_TOAST`){let{message:e,buttonText:n}=t.payload||{};s(e||`Meeting accessibility assistance available.`,n||`Open Meet Assist`),r({success:!0})}else if(t.type===`FILL_FIELD_DOM`){let{fieldId:e,value:n,fieldType:i}=t.payload||{},a=!1;a=i===`select`?await F(e,n):i===`checkbox`?await I(e,n===`true`||n===!0):await P(e,n),r({success:a})}else if(t.type===`SUBMIT_FORM_DOM`){let{submitButtonId:e}=t.payload||{};r({success:await L(e)})}else if(t.type===`HIGHLIGHT_FIELD_DOM`){let{fieldId:e}=t.payload||{};R(e),r({success:!0})}}catch(e){console.error(`[Shadow UI Content Script] Message execution error:`,e),r({error:String(e)})}})(),!0)),window.addEventListener(`message`,async e=>{if(e.data){if(e.data.type===`CLOSE_PANEL`)c(!1);else if(e.data.type===`ANALYZE_PAGE_FORM`){let t=k();e.source&&e.source.postMessage({type:`FORM_ANALYSIS_RESPONSE`,form:t},`*`)}else if(e.data.type===`ANALYZE_PAGE_INTELLIGENCE`){let t=B();e.source&&e.source.postMessage({type:`PAGE_INTELLIGENCE_RESPONSE`,analysis:t},`*`)}else if(e.data.type===`SHOW_COPILOT_TOAST`){let{message:t,buttonText:n}=e.data.payload||{};s(t||`Meeting accessibility assistance available.`,n||`Open Meet Assist`)}else if(e.data.type===`FILL_FIELD_DOM`){let{fieldId:t,value:n,fieldType:r}=e.data.payload||{};r===`select`?await F(t,n):r===`checkbox`?await I(t,n===`true`||n===!0):await P(t,n)}else if(e.data.type===`SUBMIT_FORM_DOM`){let{submitButtonId:t}=e.data.payload||{};await L(t)}else if(e.data.type===`HIGHLIGHT_FIELD_DOM`){let{fieldId:t}=e.data.payload||{};R(t)}}}),console.log(`[Shadow UI AccessLayer] Content Script initialized with Form Submission & Dropdown Support.`)})()})();