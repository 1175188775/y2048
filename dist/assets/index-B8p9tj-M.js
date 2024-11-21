(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const p of s.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&r(p)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();let l=[],i=0,c=0,b=!1,g=!1,u=null,a=[];try{c=parseInt(localStorage.getItem("bestScore"))||0,a=JSON.parse(localStorage.getItem("leaderboard"))||[],u=localStorage.getItem("currentUser")}catch(e){console.error("Local storage error:",e),localStorage.clear(),c=0,a=[],u=null}function S(){l=Array(4).fill().map(()=>Array(4).fill(0))}function I(e){return e>4?"#f9f6f2":"#776e65"}function w(){for(let e=0;e<4;e++)for(let n=0;n<4;n++){const o=document.getElementById(`cell-${e}-${n}`),r=l[e][n];o.textContent=r||"",o.setAttribute("data-value",r),o.style.color=I(r),r>=1024?o.style.fontSize="20px":r>=128?o.style.fontSize="25px":o.style.fontSize="30px"}if(document.getElementById("score").textContent=i,i>c){c=i,f();const e=a.findIndex(n=>n.name===u);e!==-1&&(a[e].bestScore=c,f(),d()),document.getElementById("best-score").style.color="#f65e3b",document.getElementById("best-score").style.textShadow="0 0 10px rgba(246, 94, 59, 0.5)"}document.getElementById("best-score").textContent=c}function v(){const e=[];for(let n=0;n<4;n++)for(let o=0;o<4;o++)l[n][o]===0&&e.push({x:n,y:o});if(e.length>0){const{x:n,y:o}=e[Math.floor(Math.random()*e.length)];l[n][o]=Math.random()<.9?4:8}}function E(){for(let e=0;e<4;e++)for(let n=0;n<4;n++)if(l[e][n]===0||n<3&&l[e][n]===l[e][n+1]||e<3&&l[e][n]===l[e+1][n])return!1;return!0}function y(e){if(b||g)return!1;g=!0;let n=!1;try{switch(e){case"left":n=x();break;case"right":n=L();break;case"up":n=D();break;case"down":n=N();break}n&&(v(),w(),E()&&(b=!0,C()))}finally{g=!1}return n}function x(){let e=!1;for(let n=0;n<4;n++){let o=l[n].filter(t=>t!==0),r=[];for(let t=0;t<o.length;t++)t<o.length-1&&o[t]===o[t+1]?(r.push(o[t]*2),i+=o[t]*2,t++,e=!0):r.push(o[t]);for(;r.length<4;)r.push(0);r.join(",")!==l[n].join(",")&&(e=!0),l[n]=r}return e}function L(){let e=!1;for(let n=0;n<4;n++){let o=l[n].filter(t=>t!==0),r=[];for(let t=o.length-1;t>=0;t--)t>0&&o[t]===o[t-1]?(r.unshift(o[t]*2),i+=o[t]*2,t--,e=!0):r.unshift(o[t]);for(;r.length<4;)r.unshift(0);r.join(",")!==l[n].join(",")&&(e=!0),l[n]=r}return e}function D(){let e=!1;for(let n=0;n<4;n++){let o=[];for(let t=0;t<4;t++)l[t][n]!==0&&o.push(l[t][n]);let r=[];for(let t=0;t<o.length;t++)t<o.length-1&&o[t]===o[t+1]?(r.push(o[t]*2),i+=o[t]*2,t++,e=!0):r.push(o[t]);for(;r.length<4;)r.push(0);for(let t=0;t<4;t++)l[t][n]!==r[t]&&(e=!0),l[t][n]=r[t]}return e}function N(){let e=!1;for(let n=0;n<4;n++){let o=[];for(let t=0;t<4;t++)l[t][n]!==0&&o.push(l[t][n]);let r=[];for(let t=o.length-1;t>=0;t--)t>0&&o[t]===o[t-1]?(r.unshift(o[t]*2),i+=o[t]*2,t--,e=!0):r.unshift(o[t]);for(;r.length<4;)r.unshift(0);for(let t=0;t<4;t++)l[t][n]!==r[t]&&(e=!0),l[t][n]=r[t]}return e}function C(){const e=a.findIndex(o=>o.name===u);e!==-1&&i>a[e].bestScore&&(a[e].bestScore=i,c=i,f(),d()),d();const n=document.createElement("div");n.className="game-over",n.innerHTML=`
        <div class="game-over-content">
            <h2>游戏结束!</h2>
            <p>本局得分: ${i}</p>
            <p>历史最高: ${c}</p>
            ${i===c?'<p class="new-record">新纪录！</p>':""}
            <button onclick="restartGame()">重新开始</button>
        </div>
    `,document.querySelector(".container").appendChild(n)}window.restartGame=function(){const e=document.querySelector(".game-over");e&&e.remove(),b=!1,i=0,document.getElementById("best-score").style.color="",S(),v(),v(),w()};function M(e){e.key.startsWith("Arrow")&&(e.preventDefault(),y(e.key.replace("Arrow","").toLowerCase()))}let m=0,h=0;function U(e){m=e.touches[0].clientX,h=e.touches[0].clientY}function $(e){if(!m||!h)return;const n=e.changedTouches[0].clientX,o=e.changedTouches[0].clientY,r=n-m,t=o-h,s=20;Math.abs(r)>Math.abs(t)?Math.abs(r)>s&&y(r>0?"right":"left"):Math.abs(t)>s&&y(t>0?"down":"up"),m=0,h=0}function j(e){e.touches.length===1&&e.preventDefault()}window.showNameInputDialog=function(){const e=document.createElement("div");e.className="game-over",e.innerHTML=`
        <div class="game-over-content">
            <h2>欢迎来到2048!</h2>
            <p>请输入你的名字 (1-5个字符):</p>
            <input type="text" id="username-input" maxlength="5" style="margin: 10px; padding: 5px;">
            <p id="name-error" style="color: #f65e3b; display: none;">名字不能为空!</p>
            <button onclick="submitUsername()">开始游戏</button>
        </div>
    `,document.querySelector(".container").appendChild(e),document.getElementById("username-input").focus()};window.submitUsername=function(){const e=document.getElementById("username-input"),n=document.getElementById("name-error"),o=e.value.trim();if(o.length===0||o.length>5){n.style.display="block";return}u=o,localStorage.setItem("currentUser",o),a.find(r=>r.name===o)||(a.push({name:o,bestScore:0}),f()),document.querySelector(".game-over").remove(),d(),restartGame()};function d(){const e=document.querySelector(".leaderboard")||G();a.sort((n,o)=>o.bestScore-n.bestScore),e.innerHTML=`
        <h3>排行榜</h3>
        <div class="leaderboard-list">
            ${a.map((n,o)=>`
                <div class="leaderboard-item ${n.name===u?"current-user":""}">
                    <span class="rank">${o+1}</span>
                    <span class="name">${n.name}</span>
                    <span class="score">${n.bestScore}</span>
                </div>
            `).join("")}
        </div>
    `,f()}function G(){const e=document.createElement("div");return e.className="leaderboard",document.querySelector(".container").appendChild(e),e}window.switchToUser=function(e){u=e,localStorage.setItem("currentUser",e);const n=a.find(o=>o.name===e);n&&(c=n.bestScore,f()),closeUserDialog(),d(),restartGame()};window.closeUserDialog=function(){const e=document.querySelector(".game-over");e&&e.remove()};window.onload=function(){const e=document.querySelector(".container");e.setAttribute("tabindex","0"),e.addEventListener("keydown",M),e.addEventListener("touchstart",U),e.addEventListener("touchend",$),e.addEventListener("touchmove",j,{passive:!1}),e.focus();const n=document.createElement("div");n.className="button-container",n.innerHTML=`
        <button onclick="newGame()">新游戏</button>
        <button onclick="showSwitchUserDialog()" class="switch-user-btn">切换用户</button>
    `;const o=document.querySelector("button");o.parentNode.replaceChild(n,o);const r=document.createElement("div");r.className="instructions",r.textContent="使用方向键或滑动来移动方块",e.appendChild(r),window.newGame=restartGame,u?(d(),restartGame()):showNameInputDialog()};window.showSwitchUserDialog=function(){const e=document.createElement("div");e.className="game-over",e.innerHTML=`
        <div class="game-over-content">
            <h2>切换用户</h2>
            <div class="user-list">
                ${a.map(n=>`
                    <div class="user-item ${n.name===u?"current-user":""}" 
                         onclick="switchToUser('${n.name}')">
                        ${n.name}
                        ${n.name===u?" (当前用户)":""}
                    </div>
                `).join("")}
            </div>
            <div class="dialog-buttons">
                <button onclick="showNameInputDialog()">新用户</button>
                <button onclick="closeUserDialog()">取消</button>
            </div>
        </div>
    `,document.querySelector(".container").appendChild(e)};function f(){try{localStorage.setItem("bestScore",c),localStorage.setItem("leaderboard",JSON.stringify(a)),localStorage.setItem("currentUser",u)}catch(e){console.error("Error saving game data:",e),alert("保存游戏数据时出错，请确保浏览器没有禁用本地存储。")}}
