/*
 * a.js
 * Copyright (C) 2016 asxalex <asxalex@localhost>
 *
 * Distributed under terms of the MIT license.
 */

var str1 = []
str1.push("<span class='comment'>/**")
str1.push("&nbsp;* We have known each other for almost 10 years,")
str1.push("&nbsp;* but we have never been so close like we do now.")
str1.push("&nbsp;* It's the first <strong>May 20th</strong> since i fell in love with u,")
str1.push("&nbsp;* So I'd love to write something to express something.")
str1.push("&nbsp;*/</span>")

str1.push("^1000Boy i = <span class='keyword'>new</span> Boy(\"asxalex\");")
str1.push("Girl u = <span class='keyword'>new</span> Girl(\"TT\");")
str1.push("^1000<span class='comment'>// Mar 12th, we met.</span>")
str1.push("i.meet(u);")

str1.push("^1000<span class='comment'>// 24 days later, I told you that I love you.</span>")
str1.push("Love love = i.love(u);")
str1.push("<span class='comment'>// Luckily, you accepted and became my girlfriend, harooy :)</span>")
str1.push("u.accepted(love);")

str1.push("^1000<span class='comment'>// Since then, i miss u every day, every moment.</span>")
str1.push("i.miss(u);")
str1.push("<span class='comment'>// And i take care of our love carefully</span>")
str1.push("i.takeCarefullyCareOf(love);")

str1.push("^800<span class='comment'>// However time goes, u are my precious,")
str1.push("// and i will cherish and love u all the time.</span>")
str1.push("<span class='keyword'>boolean</span> forever = <span class='keyword'>true</span>;")
str1.push("<span class='keyword'>Time</span> time = \"whatever\";")
str1.push("<span class='keyword'>while </span> (forever || time) {")
str1.push("&nbsp; &nbsp; i.cherish(u);")
str1.push("&nbsp; &nbsp; i.love(u);")
str1.push("}")

/*
str1 = []
for(var i = 0; i < 26; i++) {
    str1.push("hello world")
}
*/

var s = str1.join(" <br/> ")

setTimeout(function(){
    $(".element0").typed({
        strings: [s],
        typeSpeed: 15, // typing speed
        backDelay: 750, // pause before backspacing
        loop: false, // loop on or off (true or false)
        loopCount: false, // number of loops, false = infinite
        showCursor: false,
        callback: function(){ } // call function after typing is done
    });
}, 0);

function wrapTime(d, dan) {
    if(d < 10) {
        d = "0" + d;
    }
    var a = "<font size=20px>" + d + "</font>";
    var b = "<font size=5px>" + dan + "</font>";
    return a + b;
}

function GetRTime(){
    var EndTime= new Date('2016/03/12 00:00:00');
    var NowTime = new Date();
    var t = NowTime.getTime() - EndTime.getTime()
    var d=0;
    var h=0;
    var m=0;
    var s=0;
    if(t>=0){
        d=Math.floor(t/1000/60/60/24);
        h=Math.floor(t/1000/60/60%24);
        m=Math.floor(t/1000/60%60);
        s=Math.floor(t/1000%60);
        document.getElementById("t_d").innerHTML = wrapTime(d, "D");
        document.getElementById("t_h").innerHTML = wrapTime(h, "H");
        document.getElementById("t_m").innerHTML = wrapTime(m, "M");
        document.getElementById("t_s").innerHTML = wrapTime(s, "S");
    }
}
setInterval(GetRTime,0);

function setOpacity(elem, n) {
    elem.style.cssText = "opacity: " + n + ";";
}

function fadeIn(elem, speed, opacity){
    /*
     * 参数说明
     * elem==>需要淡入的元素
     * speed==>淡入速度,正整数(可选)
     * opacity==>淡入到指定的透明度,0~100(可选)
     */
    speed = speed || 20;
    opacity = opacity || 100;
    //显示元素,并将元素值为0透明度(不可见)
    elem.style.display = 'block';
    //初始化透明度变化值为0
    setOpacity(elem, 0);
    var val = 0;
    //循环将透明值以0.01递增,即淡入效果
    (function(){
        //iBase.SetOpacity(elem, val);
        setOpacity(elem, val);
        val += 0.01;
        console.log(val);
        if (val <= opacity) {
            setTimeout(arguments.callee, speed);
        }
    })();
}

fadeIn(document.getElementById("fade"), 50, 3);

