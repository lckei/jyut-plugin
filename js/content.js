var pos = { left: 0, top: 0 }; //__btn___ 座标
//鼠标拖动div
var mousePosition;
var offset = [0, 0];
var wheader;
var isDown = false;

//--------1初始化shadow Dom---------//

let popwin = document.createElement('div');
popwin.style.cssText = "all: initial;" //重置样式，避免全局的样式影响
const shadowRoot = popwin.attachShadow({ mode: 'open' });
popwin.shadowRoot;
popwin.shadowRoot.host;
let style = document.createElement('style');
style.innerHTML = "@import '" + chrome.extension.getURL("/css/custom.css") + "';";
shadowRoot.appendChild(style);

//-------------- 1.构造划词图标 ---------//
let divRoot = document.createElement('div');
divRoot.id = "root";
let divRootApp = document.createElement('div');
divRootApp.id = "app";
divRoot.appendChild(divRootApp);
let divRootAppSelectext = document.createElement('div'); //btn 默认不显示,通过控制div diplay none block 来关闭|显示 
divRootAppSelectext.id = "selectext";
divRootAppSelectext.style.position = "absolute"
divRootAppSelectext.style.display = "none";
divRootApp.appendChild(divRootAppSelectext);
let divRootAppSelectextBtn = document.createElement('button');
divRootAppSelectextBtn.className = "__btn__";
divRootAppSelectext.appendChild(divRootAppSelectextBtn);
divRootAppSelectextBtn.style.background = "url(" + chrome.extension.getURL("btn.png") + ") center center no-repeat";
divRootAppSelectextBtn.style.width = "24px";
divRootAppSelectextBtn.style.height = "24px";
divRootAppSelectextBtn.style.border = "none";

shadowRoot.appendChild(divRoot);

//-------------- 2.构造弹出窗体 ------------//

let divPanel = document.createElement('div');
divPanel.id = "divPanel"
divPanel.style.display = "none"; //默认不显示，btn触发则显示
divPanel.style.position = "absolute";
divPanel.style.width = "320px";
divPanel.style.height = "150px";

divPanel.innerHTML = `
<div class="custom-panel custom-radius">
   <div id="panelHeader" class="panels-heading custom-row">
      <div class="custom-col"></div>
            <span id="winClosebtn" class="custom-padding"><i  class="custom-icon">x</i></span>
   </div>
    <div class="break-line"></div>
   <div class="panel-body">
	<textarea id="dtext"></textarea>
    </div>
</div>
`
divRootApp.appendChild(divPanel);
document.documentElement.appendChild(popwin);

//2D字串查找（字典中数组）
function indexOf2dArray(array2d, itemtofind) {
    index = [].concat.apply([], ([].concat.apply([], array2d))).indexOf(itemtofind);
    if (index === -1) { return false; }
    numColumns = array2d[0].length;
    row = parseInt(index / numColumns);
    col = index % numColumns;
    return [row, col];
};

//获得鼠标划字
function selectText() {
    if (document.selection) {
        return document.selection.createRange().text;
    } else {
        return window.getSelection().toString();
    }
};

//显示 div plane
function showTopWindows(text, pos) {
    var newText = "";
    var charText = "";
    //逐字侧边加注音
    if (text.length > 0) {
        for (var i = 0; i < text.length; i++) {
            var res = indexOf2dArray(arr, text[i]);
            if (res) {
                var charIndex = res[0];
                charText = "（" + arr[charIndex][2] + "）";
            } else {
                charText = "";
            }
            newText += text[i] + charText;
        }
    }
    var textareaTxt = shadowRoot.getElementById("dtext");
    textareaTxt.value = newText;
    divPanel.style.display = "block";
    divRootAppSelectext.style.display = "none";
    divPanel.style.left = pos.left + "px";
    divPanel.style.top = pos.top + "px";

};

//隐藏div plane
function hiddenTopWindows() {
    divPanel.style.display = 'none';
};
//计算当前页面鼠标相对page的坐标,用于divPannel 拖动
document.addEventListener("mousemove", function(event) {
    if (isDown) {
        mousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        divPanel.style.left = (mousePosition.x + offset[0]) + 'px';
        divPanel.style.top = (mousePosition.y + offset[1]) + 'px';
    }
});

//划词 btn 追随显示
document.addEventListener("mouseup", (ev) => {
        isDown = false;
        var ev = ev || window.event;
        pos.left = ev.pageX + 20;
        pos.top = ev.pageY - 5;
        if (selectText().length >= 1) {
            setTimeout(() => {
                divRootAppSelectext.style.left = pos.left + 'px';
                divRootAppSelectext.style.top = pos.top + 'px';
                divRootAppSelectext.style.display = 'block';
            }, 100);
        } else {
            divRootAppSelectext.style.display = 'none';
        }
    })
    //点击页面任意地方，取消btn显示
document.onclick = function(ev) {
    var ev = ev || window.event
    ev.cancelBubble = true;
    divRootAppSelectext.style.display = 'none';
    isDown = false;
}

//点击btn 显示plane
divRootAppSelectextBtn.addEventListener("click", (ev) => {
    // console.log("clicked from btn");
    divRootAppSelectext.style.display = 'none';
    showTopWindows(selectText(), pos);
    ev.preventDefault();
});

//关闭windows
var winCloseBtn = shadowRoot.getElementById("winClosebtn");
winCloseBtn.addEventListener("click", () => {
    hiddenTopWindows();
});

var panelHeader = shadowRoot.getElementById("panelHeader")

//移动div
panelHeader.addEventListener('mousedown', function(ev) {
    isDown = true;
    offset = [
        divPanel.offsetLeft - ev.clientX,
        divPanel.offsetTop - ev.clientY
    ];
    divRootAppSelectext.style.display = "none";
}, true);