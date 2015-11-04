/*
 bondSlider Slider jQuery plugin
 Author: Bondarenko Aleksey
 Homepage: http://alex-bond.net
 */
(function($){
    $.fn.bondSlider=function(options){
        var c = {
            fd : {fast:"fast", normal:"normal", slow:"slow"},
            tpL:{h:"horizontal", v:"vertical"},
            tp:{opacity:"opacity",rotator:"rotator"},
            dr:{next:"next",prev:"prev"},
            typeBtn:{btn:"btn",navi:"navi", auto:"auto"},
            sp: {slow: 600, fast: 200, normal: 400}
        }
        var d={
            autoPlay: true,
            autoPlayTime: 7000,
            autoPlaySuspend: true,
            loop: true,
            distance: null,
            activeFrame: 0,
            sizeFrame: 1,
            naviOverActive: false,
            hideBtn: false,
            hideBtnOpacity: 0,
            hideBtnSpeed: c.fd.fast,
            speedOpacity: c.fd.slow,
            speedRotate: c.fd.slow,
            typeBtn: c.tp.rotator,
            typeThumb: c.tp.rotator,
            typeAutoPlay: c.tp.rotator,
            typeScroller: c.tpL.h,
            autoPlayDirect: c.dr.next,
            effBtn: "linear",
            effThumb: "linear",
            effAutoPlay: "linear",
            wrapFrames: "bondWrapFrames",
            frames: "bondFrames",
            frame: "bondFrame",
            navi: "bondNavi",
            thumb: "bondThumb",
            next: "bondNext",
            prev: "bondPrev",
            disableBtn: "disable",
            activeThumb: "activeThumb",
            callbackChangeActFrame: null,
            callbackClickFrame: null
        }
        var o=$.extend(d,options);
        o.speedOpacity = c.sp[ o.speedOpacity ] || o.speedOpacity;
        o.speedRotate = c.sp[ o.speedRotate ] || o.speedRotate;
        var this$=this;
        var nextBtn$=this$.find("."+o.next);
        var prevBtn$=this$.find("."+o.prev);
        var navi$=this$.find("."+o.navi);
        var thumbs$=navi$.find(" ."+o.thumb);
        var wrapFrames$=this$.find("."+o.wrapFrames);
        var contentFrames$=this$.find("."+o.frames);
        var frames$=this$.find("."+o.frame);
        var memory = { totalFrames:null, widthCont:null, autoPlayTimer:null, btnOpacity:{next:null,prev:null,navi:null} };
        var animMove = function (pos, eff) {
            if (pos == null) return;
            if (o.typeScroller == c.tpL.h)
                contentFrames$.stop().animate({left:-pos.left}, o.speedRotate, eff);
            else if (o.typeScroller == c.tpL.v)
                contentFrames$.stop().animate({top:-pos.top}, o.speedRotate, eff);
        }
        var animOpacity = function (pos) {
            if (pos == null) return;
            if (o.typeScroller == c.tpL.h){
                setTimeout( function(){contentFrames$.stop().animate({opacity:0}, o.speedOpacity);}, 0);
                setTimeout( function(){contentFrames$.stop().css({left:-pos.left});}, o.speedOpacity);
                setTimeout( function(){contentFrames$.stop().animate({opacity:1}, o.speedOpacity);}, o.speedOpacity);
            }
            else if (o.typeScroller == c.tpL.v){
                setTimeout( function(){contentFrames$.stop().animate({opacity:0}, o.speedOpacity);}, 0);
                setTimeout( function(){contentFrames$.stop().css({top:-pos.top});}, o.speedOpacity);
                setTimeout( function(){contentFrames$.stop().animate({opacity:1}, o.speedOpacity);}, o.speedOpacity);
            }
        }
        var goTo = function(obj, typeBtn){
            if ( typeof(obj) == "number" ) goToFrame(obj, typeBtn);
            else if ( typeof(obj) == "string" ) goToDistance(obj, typeBtn);
            function goToFrame(frame, typeBtn){
                disableBtn(frame);
                thumbs$.not($(thumbs$.get(frame))).removeClass(o.activeThumb);
                $(thumbs$.get(frame)).addClass(o.activeThumb);
                var pos = $(frames$.get(frame*o.sizeFrame)).position();
                move(pos, typeBtn);
                function disableBtn (frame) {
                    if (!o.loop) {
                        if ( memory.totalFrames == null) {
                            prevBtn$.addClass(o.disableBtn);
                            nextBtn$.addClass(o.disableBtn);
                        }
                        else {
                            if (frame <= 0) {
                                prevBtn$.addClass(o.disableBtn);
                                nextBtn$.removeClass(o.disableBtn);
                            }
                            else if (frame >=  memory.totalFrames - 1) {
                                nextBtn$.addClass(o.disableBtn);
                                prevBtn$.removeClass(o.disableBtn);
                            }
                            else if (frame > 0 && frame <  memory.totalFrames - 1) {
                                prevBtn$.removeClass(o.disableBtn);
                                nextBtn$.removeClass(o.disableBtn);
                            }
                        }
                    }
                }
            }
            function goToDistance(dr, typeBtn){
                var pos={};
                if (dr==c.dr.next){
                    if ( o.typeScroller == c.tpL.h ){
                        var dis = -contentFrames$.css("left").replace("px", "")+o.distance;
                        if ( o.loop ){
                            if ( -contentFrames$.css("left").replace("px", "") == contentFrames$.outerWidth()-wrapFrames$.width() )
                                pos.left = 0;
                            else    pos.left = Math.min( dis , contentFrames$.outerWidth()-wrapFrames$.width() );
                        }
                        else pos.left = Math.min( dis , contentFrames$.outerWidth()-wrapFrames$.width() );
                    }
                    else if ( o.typeScroller == c.tpL.v ){
                        var dis = -contentFrames$.css("top").replace("px", "")+o.distance;
                        if ( o.loop ){
                            if ( -contentFrames$.css("top").replace("px", "") == contentFrames$.outerHeight()-wrapFrames$.height() )
                                pos.top = 0;
                            else    pos.top = Math.min( dis , contentFrames$.outerHeight()-wrapFrames$.height() );
                        }
                        else pos.top = Math.min( dis , contentFrames$.outerHeight()-wrapFrames$.height() );
                    }
                }
                else if (dr==c.dr.prev){
                    if ( o.typeScroller == c.tpL.h ){
                        var dis = -contentFrames$.css("left").replace("px", "")-o.distance;
                        if ( o.loop ){
                            if ( contentFrames$.css("left").replace("px", "") == 0 )
                                pos.left = contentFrames$.outerWidth()-wrapFrames$.width();
                            else    pos.left = Math.max( dis , 0 );
                        }
                        else pos.left = Math.max( dis , 0 );
                    }
                    else if ( o.typeScroller == c.tpL.v ){
                        var dis = -contentFrames$.css("top").replace("px", "")-o.distance;
                        if ( o.loop ){
                            if ( contentFrames$.css("top").replace("px", "") == 0 )
                                pos.top = contentFrames$.outerHeight()-wrapFrames$.height();
                            else pos.top = Math.max( dis , 0 );
                        }
                        else pos.top = Math.max( dis , 0 );
                    }
                }
                disableBtn(pos);
                move(pos, typeBtn);
                function disableBtn(p){
                    if (p == null) return;
                    if (!o.loop){
                        if (o.typeScroller == c.tpL.h){
                            if ( p.left == 0 && contentFrames$.outerWidth() == wrapFrames$.width() ){
                                prevBtn$.addClass(o.disableBtn);
                                nextBtn$.addClass(o.disableBtn);
                            }
                            else if ( p.left <= 0 ){
                                prevBtn$.addClass(o.disableBtn);
                                nextBtn$.removeClass(o.disableBtn);
                            }
                            else if ( p.left+wrapFrames$.width() >= contentFrames$.outerWidth() ){
                                nextBtn$.addClass(o.disableBtn);
                                prevBtn$.removeClass(o.disableBtn);
                            }
                            else if ( p.left >= 0 && ( p.left+wrapFrames$.width() <= contentFrames$.outerWidth() ) )
                            {
                                nextBtn$.removeClass(o.disableBtn);
                                prevBtn$.removeClass(o.disableBtn);
                            }
                        }
                        else if (o.typeScroller == c.tpL.v){
                            if ( p.top == 0 && contentFrames$.outerHeight() == wrapFrames$.height() ){
                                prevBtn$.addClass(o.disableBtn);
                                nextBtn$.addClass(o.disableBtn);
                            }
                            else if ( p.top <= 0 ){
                                prevBtn$.addClass(o.disableBtn);
                                nextBtn$.removeClass(o.disableBtn);
                            }
                            else if ( p.top+wrapFrames$.height() >= contentFrames$.outerHeight() ){
                                nextBtn$.addClass(o.disableBtn);
                                prevBtn$.removeClass(o.disableBtn);
                            }
                            else if ( p.top >= 0 && (p.top+wrapFrames$.height() <= contentFrames$.outerHeight()) ){
                                prevBtn$.removeClass(o.disableBtn);
                                nextBtn$.removeClass(o.disableBtn);
                            }
                        }
                    }
                }
            }
            function move(p, tpB){
                if (p == null) return;
                switch(tpB)
                {
                    case c.typeBtn.btn:
                        if ( o.typeBtn == c.tp.opacity )
                            animOpacity(p);
                        else animMove(p, (jQuery.easing[o.effBtn]==null)? "linear" : o.effBtn);
                        break;
                    case c.typeBtn.navi:
                        if ( o.typeThumb == c.tp.opacity )
                            animOpacity(p);
                        else animMove(p, (jQuery.easing[o.effThumb]==null)? "linear" : o.effThumb);
                        break;
                    case c.typeBtn.auto:
                        if ( o.typeAutoPlay == c.tp.opacity )
                            animOpacity(p);
                        else animMove(p, (jQuery.easing[o.effAutoPlay]==null)? "linear" : o.effAutoPlay);
                        break;
                }
            }
        }
        var initialization = (function(){
            contentFrames$.css({position:"relative"});
            wrapFrames$.css({position:"relative"});
            wrapFrames$.css({overflow:"hidden"});
            totalFramesAndWidthCont();
            removeNavi();
            if (o.hideBtn){
                if ( nextBtn$ != null ){
                    memory.btnOpacity.next=nextBtn$.css("opacity");
                    nextBtn$.css({opacity:o.hideBtnOpacity});
                }
                if ( prevBtn$ != null ){
                    memory.btnOpacity.prev=prevBtn$.css("opacity");
                    prevBtn$.css({opacity:o.hideBtnOpacity});
                }
                if ( navi$ != null ){
                    memory.btnOpacity.navi=navi$.css("opacity");
                    navi$.css({opacity:o.hideBtnOpacity});
                }
            }
            if ( o.typeScroller == c.tpL.h ){
                frames$.css({float:"left"});
                contentFrames$.width(memory.widthCont);
                goTo(o.activeFrame);
            }
            if ( o.typeScroller == c.tpL.v ){
                frames$.css({float:"none"});
                goTo(o.activeFrame);
            }
            function totalFramesAndWidthCont(){
                var frameW = 0;
                memory.totalFrames = Math.ceil(frames$.length/o.sizeFrame);
                var tail = frames$.length % o.sizeFrame;
                for (var i=0, width = 0; i < memory.totalFrames; i++) {
                    if ( o.typeScroller == c.tpL.h ){
                        var s = sizeFrame(frames$,i,o.sizeFrame);
                        memory.widthCont = memory.widthCont + s;
                    }
                }
                function sizeFrame(frames$,i,cnt){
                    var size = 0;
                    for(var j=0;j<cnt;j++){
                        var g = i*cnt+j;
                        if ( frames$.length-1 < g  ) break;
                        if ( o.typeScroller == c.tpL.h )
                            size = size + $(frames$.get(g)).outerWidth();
                        else if ( o.typeScroller == c.tpL.v )
                            size = size + $(frames$.get(g)).outerHeight();
                    }
                    return size;
                }
            }
            function removeNavi(){
                thumbs$.each(function(i,elem){
                    if ( i > memory.totalFrames-1)
                        $(elem).hide();
                });
            }
        })();
        var bindEvent = (function(){
            playAutoPlay();
            if ( nextBtn$ != null ){
                nextBtn$.click( function(e){
                    stopAutoPlay();
                    next();
                    //e.stopPropagation();
                    callbackBtnNavi("next");
                    return false;
                });
            }
            if ( prevBtn$ != null ){
                prevBtn$.click( function(e){
                    stopAutoPlay();
                    prev();
                    //e.stopPropagation();
                    callbackBtnNavi("prev");
                    return false;
                });
            }
            if ( thumbs$ != null ){
                thumbs$.each( function(i, el){
                    if (  memory.totalFrames <= i ) return;
                    if (o.naviOverActive)
                    {
                        $(el).mouseenter(action);
                    }
                    else
                        $(el).click(action);
                    function action(){
                        stopAutoPlay();
                        o.activeFrame=i;
                        goTo(o.activeFrame, c.typeBtn.navi);
                        callbackBtnNavi("navi");
                        //return false;
                    }
                });
            }
            if (o.hideBtn){
                this$.mouseenter(function(){
                    nextBtn$.stop().animate({opacity:memory.btnOpacity.next}, o.hideBtnSpeed);
                    prevBtn$.stop().animate({opacity:memory.btnOpacity.prev}, o.hideBtnSpeed);
                    navi$.stop().animate({opacity:memory.btnOpacity.navi}, o.hideBtnSpeed);
                });
                this$.mouseleave(function(){
                    nextBtn$.stop().animate({opacity:o.hideBtnOpacity}, o.hideBtnSpeed);
                    prevBtn$.stop().animate({opacity:o.hideBtnOpacity}, o.hideBtnSpeed);
                    navi$.stop().animate({opacity:o.hideBtnOpacity}, o.hideBtnSpeed);
                });
            }
            if (o.callbackClickFrame){
                frames$.each( function(i, el){
                    $(el).click(function(e){
                        o.callbackClickFrame(i);
                    });
                });
            }
            if (o.autoPlaySuspend)
            {
                wrapFrames$.mouseenter(function(){
                    stopAutoPlay();
                });
                wrapFrames$.mouseleave(function(){
                    playAutoPlay();
                });
            }
            function next(tp){
                if ( !(o.distance == null) ){
                    goTo(c.dr.next, c.typeBtn.btn);
                    return;
                }
                o.activeFrame++;
                if ( o.activeFrame >=  memory.totalFrames && ( o.loop || memory.autoPlayTimer) )
                    o.activeFrame=0;
                else if ( o.activeFrame >=  memory.totalFrames && !o.loop ){
                    o.activeFrame--;
                    return;
                }
                goTo( o.activeFrame, (tp == null)? c.typeBtn.btn : tp );
            }
            function prev(tp){
                if ( !(o.distance == null) ){
                    goTo(c.dr.prev, c.typeBtn.btn);
                    return;
                }
                o.activeFrame--;
                if ( o.activeFrame < 0 && ( o.loop || memory.autoPlayTimer) )
                    o.activeFrame=memory.totalFrames-1;
                else if ( o.activeFrame < 0 && !o.loop ){
                    o.activeFrame++;
                    return;
                }
                goTo(o.activeFrame, (tp == null)? c.typeBtn.btn : tp );
            }
            function playAutoPlay(){
                if ( o.autoPlay == true ){
                    memory.autoPlayTimer = setInterval( function(){
                        if (o.autoPlayDirect == c.dr.prev) {
                            prev(c.typeBtn.auto);
                            callbackBtnNavi("prev");
                        }
                        else {
                            next(c.typeBtn.auto);
                            callbackBtnNavi("next");
                        }
                    }, o.autoPlayTime);
                }
            }
            function stopAutoPlay(){clearInterval(memory.autoPlayTimer); delete memory.autoPlayTimer;}
            function callbackBtnNavi(tp){
                if (o.callbackChangeActFrame){
                    var f = (o.distance == null)? o.activeFrame : null;
                    o.callbackChangeActFrame(tp,f);
                }
            }
        })();
        return this;
    }
})(jQuery);