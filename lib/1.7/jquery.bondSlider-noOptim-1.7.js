/*
bondSlider Slider jQuery plugin
Author: Bondarenko Aleksey
Homepage: http://alex-bond.net
*/
(function($){
    $.fn.bondSlider=function(options){
        var constants = {
            fade : {fast:"fast", normal:"normal", slow:"slow"},
            typeLay:{hor:"horizontal", vert:"vertical"},
            type:{opacity:"opacity",rotator:"rotator"},
            direct:{next:"next",prev:"prev"},
            typeBtn:{btn:"btn",navi:"navi", auto:"auto"},
            speeds: {slow: 600, fast: 200, normal: 400}
        }
        var defaults={
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
            hideBtnSpeed: constants.fade.fast,
            speedOpacity: constants.fade.slow,
            speedRotate: constants.fade.slow,
            typeBtn: constants.type.rotator,
            typeThumb: constants.type.rotator,
            typeAutoPlay: constants.type.rotator,
            typeScroller: constants.typeLay.hor,
            autoPlayDirect: constants.direct.next,
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
        var options=$.extend(defaults,options);
        options.speedOpacity = constants.speeds[ options.speedOpacity ] || options.speedOpacity;
        options.speedRotate = constants.speeds[ options.speedRotate ] || options.speedRotate;
        var this$=this;
        var nextBtn$=this$.find("."+options.next);
        var prevBtn$=this$.find("."+options.prev);
        var navi$=this$.find("."+options.navi);
        var thumbs$=navi$.find(" ."+options.thumb);
        var wrapFrames$=this$.find("."+options.wrapFrames);
        var contentFrames$=this$.find("."+options.frames);
        var frames$=this$.find("."+options.frame);
        var memory = { totalFrames:null, widthCont:null, autoPlayTimer:null, btnOpacity:{next:null,prev:null,navi:null} };
        var animMove = function (pos, eff) {
            if (pos == null) return;
            if (options.typeScroller == constants.typeLay.hor)
                contentFrames$.stop().animate({left:-pos.left}, options.speedRotate, eff);
            else if (options.typeScroller == constants.typeLay.vert)
                contentFrames$.stop().animate({top:-pos.top}, options.speedRotate, eff);
        }
        var animOpacity = function (pos) {
            if (pos == null) return;
            if (options.typeScroller == constants.typeLay.hor){
                setTimeout( function(){contentFrames$.stop().animate({opacity:0}, options.speedOpacity);}, 0);
                setTimeout( function(){contentFrames$.stop().css({left:-pos.left});}, options.speedOpacity);
                setTimeout( function(){contentFrames$.stop().animate({opacity:1}, options.speedOpacity);}, options.speedOpacity);
            }
            else if (options.typeScroller == constants.typeLay.vert){
                setTimeout( function(){contentFrames$.stop().animate({opacity:0}, options.speedOpacity);}, 0);
                setTimeout( function(){contentFrames$.stop().css({top:-pos.top});}, options.speedOpacity);
                setTimeout( function(){contentFrames$.stop().animate({opacity:1}, options.speedOpacity);}, options.speedOpacity);
            }
        }
        var goTo = function(obj, typeBtn){
            if ( typeof(obj) == "number" ) goToFrame(obj, typeBtn);
            else if ( typeof(obj) == "string" ) goToDistance(obj, typeBtn);
            function goToFrame(frame, typeBtn){
                disableBtn(frame);
                thumbs$.not($(thumbs$.get(frame))).removeClass(options.activeThumb);
                $(thumbs$.get(frame)).addClass(options.activeThumb);
                var pos = $(frames$.get(frame*options.sizeFrame)).position();
                move(pos, typeBtn);
                function disableBtn (frame) {
                    if (!options.loop) {
                        if ( memory.totalFrames == null) {
                            prevBtn$.addClass(options.disableBtn);
                            nextBtn$.addClass(options.disableBtn);
                        }
                        else {
                            if (frame <= 0) {
                                prevBtn$.addClass(options.disableBtn);
                                nextBtn$.removeClass(options.disableBtn);
                            }
                            else if (frame >=  memory.totalFrames - 1) {
                                nextBtn$.addClass(options.disableBtn);
                                prevBtn$.removeClass(options.disableBtn);
                            }
                            else if (frame > 0 && frame <  memory.totalFrames - 1) {
                                prevBtn$.removeClass(options.disableBtn);
                                nextBtn$.removeClass(options.disableBtn);
                            }
                        }
                    }
                }
            }
            function goToDistance(direct, typeBtn){
                var pos={};
                if (direct==constants.direct.next){
                    if ( options.typeScroller == constants.typeLay.hor ){
                        var dis = -contentFrames$.css("left").replace("px", "")+options.distance;
                        if ( options.loop ){
                            if ( -contentFrames$.css("left").replace("px", "") == contentFrames$.outerWidth()-wrapFrames$.width() )
                                pos.left = 0;
                            else    pos.left = Math.min( dis , contentFrames$.outerWidth()-wrapFrames$.width() );
                        }
                        else pos.left = Math.min( dis , contentFrames$.outerWidth()-wrapFrames$.width() );
                    }
                    else if ( options.typeScroller == constants.typeLay.vert ){
                        var dis = -contentFrames$.css("top").replace("px", "")+options.distance;
                        if ( options.loop ){
                            if ( -contentFrames$.css("top").replace("px", "") == contentFrames$.outerHeight()-wrapFrames$.height() )
                                pos.top = 0;
                            else    pos.top = Math.min( dis , contentFrames$.outerHeight()-wrapFrames$.height() );
                        }
                        else pos.top = Math.min( dis , contentFrames$.outerHeight()-wrapFrames$.height() );
                    }
                }
                else if (direct==constants.direct.prev){
                    if ( options.typeScroller == constants.typeLay.hor ){
                        var dis = -contentFrames$.css("left").replace("px", "")-options.distance;
                        if ( options.loop ){
                            if ( contentFrames$.css("left").replace("px", "") == 0 )
                                pos.left = contentFrames$.outerWidth()-wrapFrames$.width();
                            else    pos.left = Math.max( dis , 0 );
                        }
                        else pos.left = Math.max( dis , 0 );
                    }
                    else if ( options.typeScroller == constants.typeLay.vert ){
                        var dis = -contentFrames$.css("top").replace("px", "")-options.distance;
                        if ( options.loop ){
                            if ( contentFrames$.css("top").replace("px", "") == 0 )
                                pos.top = contentFrames$.outerHeight()-wrapFrames$.height();
                            else pos.top = Math.max( dis , 0 );
                        }
                        else pos.top = Math.max( dis , 0 );
                    }
                }
                disableBtn(pos);
                move(pos, typeBtn);
                function disableBtn(pos){
                    if (pos == null) return;
                    if (!options.loop){
                        if (options.typeScroller == constants.typeLay.hor){
                            if ( pos.left == 0 && contentFrames$.outerWidth() == wrapFrames$.width() ){
                                prevBtn$.addClass(options.disableBtn);
                                nextBtn$.addClass(options.disableBtn);
                            }
                            else if ( pos.left <= 0 ){
                                prevBtn$.addClass(options.disableBtn);
                                nextBtn$.removeClass(options.disableBtn);
                            }
                            else if ( pos.left+wrapFrames$.width() >= contentFrames$.outerWidth() ){
                                nextBtn$.addClass(options.disableBtn);
                                prevBtn$.removeClass(options.disableBtn);
                            }
                            else if ( pos.left >= 0 && ( pos.left+wrapFrames$.width() <= contentFrames$.outerWidth() ) )
                            {
                                nextBtn$.removeClass(options.disableBtn);
                                prevBtn$.removeClass(options.disableBtn);
                            }
                        }
                        else if (options.typeScroller == constants.typeLay.vert){
                            if ( pos.top == 0 && contentFrames$.outerHeight() == wrapFrames$.height() ){
                                prevBtn$.addClass(options.disableBtn);
                                nextBtn$.addClass(options.disableBtn);
                            }
                            else if ( pos.top <= 0 ){
                                prevBtn$.addClass(options.disableBtn);
                                nextBtn$.removeClass(options.disableBtn);
                            }
                            else if ( pos.top+wrapFrames$.height() >= contentFrames$.outerHeight() ){
                                nextBtn$.addClass(options.disableBtn);
                                prevBtn$.removeClass(options.disableBtn);
                            }
                            else if ( pos.top >= 0 && (pos.top+wrapFrames$.height() <= contentFrames$.outerHeight()) ){
                                prevBtn$.removeClass(options.disableBtn);
                                nextBtn$.removeClass(options.disableBtn);
                            }
                        }
                    }
                }
            }
            function move(pos, typeBtn){
                if (pos == null) return;
                switch(typeBtn)
                {
                    case constants.typeBtn.btn:
                        if ( options.typeBtn == constants.type.opacity )
                            animOpacity(pos);
                        else animMove(pos, (jQuery.easing[options.effBtn]==null)? "linear" : options.effBtn);
                        break;
                    case constants.typeBtn.navi:
                        if ( options.typeThumb == constants.type.opacity )
                            animOpacity(pos);
                        else animMove(pos, (jQuery.easing[options.effThumb]==null)? "linear" : options.effThumb);
                        break;
                    case constants.typeBtn.auto:
                        if ( options.typeAutoPlay == constants.type.opacity )
                            animOpacity(pos);
                        else animMove(pos, (jQuery.easing[options.effAutoPlay]==null)? "linear" : options.effAutoPlay);
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
            if (options.hideBtn){
                if ( nextBtn$ != null ){
                    memory.btnOpacity.next=nextBtn$.css("opacity");
                    nextBtn$.css({opacity:options.hideBtnOpacity});
                }
                if ( prevBtn$ != null ){
                    memory.btnOpacity.prev=prevBtn$.css("opacity");
                    prevBtn$.css({opacity:options.hideBtnOpacity});
                }
                if ( navi$ != null ){
                    memory.btnOpacity.navi=navi$.css("opacity");
                    navi$.css({opacity:options.hideBtnOpacity});
                }
            }
            if ( options.typeScroller == constants.typeLay.hor ){
                frames$.css({float:"left"});
                contentFrames$.width(memory.widthCont);
                goTo(options.activeFrame);
            }
            if ( options.typeScroller == constants.typeLay.vert ){
                frames$.css({float:"none"});
                goTo(options.activeFrame);
            }
            function totalFramesAndWidthCont(){
                var frameW = 0;
                memory.totalFrames = Math.ceil(frames$.length/options.sizeFrame);
                var tail = frames$.length % options.sizeFrame;
                for (var i=0, width = 0; i < memory.totalFrames; i++) {
                    if ( options.typeScroller == constants.typeLay.hor ){
                        var s = sizeFrame(frames$,i,options.sizeFrame);
                        memory.widthCont = memory.widthCont + s;
                    }
                }
                function sizeFrame(frames$,i,cnt){
                    var size = 0;
                    for(var j=0;j<cnt;j++){
                        var g = i*cnt+j;
                        if ( frames$.length-1 < g  ) break;
                        if ( options.typeScroller == constants.typeLay.hor )
                            size = size + $(frames$.get(g)).outerWidth();
                        else if ( options.typeScroller == constants.typeLay.vert )
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
                thumbs$.each( function(index, element){
                    if (  memory.totalFrames <= index ) return;
                    if (options.naviOverActive)
                    {
                        $(element).mouseenter(action);
                    }
                    else
                        $(element).click(function(){stopAutoPlay(); action();});
                    function action(){
                        options.activeFrame=index;
                        goTo(options.activeFrame, constants.typeBtn.navi);
                        callbackBtnNavi("navi");
                        //return false;
                    }
                });
            }
            if (options.hideBtn){
                this$.mouseenter(function(){
                    nextBtn$.stop().animate({opacity:memory.btnOpacity.next}, options.hideBtnSpeed);
                    prevBtn$.stop().animate({opacity:memory.btnOpacity.prev}, options.hideBtnSpeed);
                    navi$.stop().animate({opacity:memory.btnOpacity.navi}, options.hideBtnSpeed);
                });
                this$.mouseleave(function(){
                    nextBtn$.stop().animate({opacity:options.hideBtnOpacity}, options.hideBtnSpeed);
                    prevBtn$.stop().animate({opacity:options.hideBtnOpacity}, options.hideBtnSpeed);
                    navi$.stop().animate({opacity:options.hideBtnOpacity}, options.hideBtnSpeed);
                });
            }
            if (options.callbackClickFrame){
                frames$.each( function(index, element){
                    $(element).click(function(e){
                        options.callbackClickFrame(index);
                    });
                });
            }
            if (options.autoPlaySuspend)
            {
                wrapFrames$.mouseenter(function(){
                    stopAutoPlay();
                });
                wrapFrames$.mouseleave(function(){
                    playAutoPlay();
                });
            }
            function next(type){
                if ( !(options.distance == null) ){
                    goTo(constants.direct.next, constants.typeBtn.btn);
                    return;
                }
                options.activeFrame++;
                if ( options.activeFrame >=  memory.totalFrames && ( options.loop || memory.autoPlayTimer) )
                    options.activeFrame=0;
                else if ( options.activeFrame >=  memory.totalFrames && !options.loop ){
                    options.activeFrame--;
                    return;
                }
                goTo( options.activeFrame, (type == null)? constants.typeBtn.btn : type );
            }
            function prev(type){
                if ( !(options.distance == null) ){
                    goTo(constants.direct.prev, constants.typeBtn.btn);
                    return;
                }
                options.activeFrame--;
                if ( options.activeFrame < 0 && ( options.loop || memory.autoPlayTimer) )
                    options.activeFrame=memory.totalFrames-1;
                else if ( options.activeFrame < 0 && !options.loop ){
                    options.activeFrame++;
                    return;
                }
                goTo(options.activeFrame, (type == null)? constants.typeBtn.btn : type );
            }
            function playAutoPlay(){
                if ( options.autoPlay == true ){
                    memory.autoPlayTimer = setInterval( function(){
                        if (options.autoPlayDirect == constants.direct.prev) {
                            prev(constants.typeBtn.auto);
                            callbackBtnNavi("prev");
                        }
                        else {
                            next(constants.typeBtn.auto);
                            callbackBtnNavi("next");
                        }
                    }, options.autoPlayTime);
                }
            }
            function stopAutoPlay(){clearInterval(memory.autoPlayTimer); delete memory.autoPlayTimer;}
            function callbackBtnNavi(type){
                if (options.callbackChangeActFrame){
                    var frame = (options.distance == null)? options.activeFrame : null;
                    options.callbackChangeActFrame(type,frame);
                }
            }
        })();
        return this;
    }
})(jQuery);