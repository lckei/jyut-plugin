var oDiv = document.createElement('div');
document.body.appendChild(oDiv);
var image = document.createElement('img');
oDiv.appendChild(image);
oDiv.id = 'div1';
oDiv.style.position = 'absolute';
oDiv.style.display = 'none';
image.className = '_btn_';
image.src = chrome.extension.getURL("image/32logo.png");
image.style.height = '32px';
image.style.width = '32px';
var pos = { left: 0, top: 0 };
//鼠标拖动div
var mousePosition;
var offset = [0, 0];
var wheader;
var isDown = false;

function selectText() {
    if (document.selection) {
        return document.selection.createRange().text;
    } else {
        return window.getSelection().toString();
    }
};
var win = document.createElement('div');
win.innerHTML = `<div  class="ax-panel ax-border ax-radius" style="width:360px;min-height:150px">
        <div id="wheader" class="ax-panel-header ax-row">
            <div class="ax-col"><span><i class="ax-iconfont ax-icon-radio"></i></span></div>
            <span id="wclosebtn" class="ax-operate ax-panel-close"><i class="ax-iconfont ax-icon-close"></i></span>
        </div>
        <div class="ax-break-line"></div>
        <div class="ax-panel-body ax-article"><textarea  id="dtext"></textarea>
        </div>
    </div>`;
document.body.appendChild(win);
win.id = "div2";
win.style.position = 'absolute';
win.style.display = 'none';


wheader = document.getElementById("wheader");
//查找字串
function indexOf2dArray(array2d, itemtofind) {
    index = [].concat.apply([], ([].concat.apply([], array2d))).indexOf(itemtofind);
    if (index === -1) { return false; }
    numColumns = array2d[0].length;
    row = parseInt(index / numColumns);
    col = index % numColumns;
    return [row, col];
};

function showTopWindows(text, pos) {
    var newText = "";
    var charText = "";
    //逐字侧边加注音
    for (var i = 0; i < text.length; i++) {
        var res = indexOf2dArray(arr, text[i]);
        if (res) {
            var charIndex = res[0];
            charText = "（" + arr[charIndex][2] + "）";
        } else {
            charText = "";
        }
        // console.log(charIndex, charText);
        newText += text[i] + charText;
    }
    var d = win;
    if (document.body.contains(d)) {
        var dd = document.getElementById("dtext");
        dd.value = newText;
        d.style.display = 'block';
        dd.style.display = 'block';
        d.style.left = pos.left + "px";
        d.style.top = pos.top + "px";
    }
};

function hiddenTopWindows() {
    var d = win;
    if (document.body.contains(d)) {
        d.style.display = 'none';
    }
};
//计算当前页面鼠标相对page的坐标
document.addEventListener("mousemove", function(event) {
    if (isDown) {
        mousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        div2.style.left = (mousePosition.x + offset[0]) + 'px';
        div2.style.top = (mousePosition.y + offset[1]) + 'px';
    }
});

document.addEventListener("mouseup", function(ev) {
    isDown = false;
    var ev = ev || window.event;
    pos.left = ev.pageX + 10;
    pos.top = ev.pageY - 10;
    if (selectText().length >= 1) {
        //console.log(oDiv.style.left, oDiv.style.top, "offsetX: " + ev.offsetX, "offsetY: " + ev.offsetY, "pageX: " + ev.pageX, "pageY: " + ev.pageY, "clientX: " + ev.clientX, "clientY: " + ev.clientY);

        setTimeout(function() { //定时器用于延迟加载否则如果选中文字太快,图片跟不上

            oDiv.style.left = pos.left + 'px';
            oDiv.style.top = pos.top + 'px';
            oDiv.style.display = 'block';
            image.style.display = 'block';
        }, 100);
    } else {
        oDiv.style.display = 'none';
        image.style.display = 'none';
    }

});

document.onclick = function(ev) {

    var ev = ev || window.event;

    ev.cancelBubble = true;
    oDiv.style.display = 'none';
    image.style.display = 'none';

};

oDiv.onclick = function(ev) {
    var ev = ev || window.event;
    oDiv.style.display = 'none';
    image.style.display = 'none';
    showTopWindows(selectText(), pos);
    ev.preventDefault();
};
//关闭windows
var tid = document.getElementById("wclosebtn");
tid.onclick = function(ev) {
    hiddenTopWindows();
};

//移动div
wheader.addEventListener('mousedown', function(ev) {
    isDown = true;
    offset = [
        div2.offsetLeft - ev.clientX,
        div2.offsetTop - ev.clientY
    ];
}, true);