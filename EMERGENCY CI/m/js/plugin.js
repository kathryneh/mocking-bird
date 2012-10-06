/*
 Color animation jQuery-plugin
 http://www.bitstorm.org/jquery/color-animation/
 Copyright 2011 Edwin Martin <edwin@bitstorm.org>
 Released under the MIT and GPL licenses.
*/
(function(d){function i(){var b=d("script:first"),a=b.css("color"),c=false;if(/^rgba/.test(a))c=true;else try{c=a!=b.css("color","rgba(0, 0, 0, 0.5)").css("color");b.css("color",a)}catch(e){}return c}function g(b,a,c){var e="rgb"+(d.support.rgba?"a":"")+"("+parseInt(b[0]+c*(a[0]-b[0]),10)+","+parseInt(b[1]+c*(a[1]-b[1]),10)+","+parseInt(b[2]+c*(a[2]-b[2]),10);if(d.support.rgba)e+=","+(b&&a?parseFloat(b[3]+c*(a[3]-b[3])):1);e+=")";return e}function f(b){var a,c;if(a=/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(b))c=
[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16),1];else if(a=/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(b))c=[parseInt(a[1],16)*17,parseInt(a[2],16)*17,parseInt(a[3],16)*17,1];else if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))c=[parseInt(a[1]),parseInt(a[2]),parseInt(a[3]),1];else if(a=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(b))c=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),parseFloat(a[4])];return c}
d.extend(true,d,{support:{rgba:i()}});var h=["color","backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","outlineColor"];d.each(h,function(b,a){d.fx.step[a]=function(c){if(!c.init){c.a=f(d(c.elem).css(a));c.end=f(c.end);c.init=true}c.elem.style[a]=g(c.a,c.end,c.pos)}});d.fx.step.borderColor=function(b){if(!b.init)b.end=f(b.end);var a=h.slice(2,6);d.each(a,function(c,e){b.init||(b[e]={a:f(d(b.elem).css(e))});b.elem.style[e]=g(b[e].a,b.end,b.pos)});b.init=true}})(jQuery);

// tipsy, facebook style tooltips for jquery
// version 1.0.0a
// (c) 2008-2010 jason frame [jason@onehackoranother.com]
// released under the MIT license

(function($) {
    
    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    };
    
    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    };
    
    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();
                
                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);
                
                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });
                
                var actualWidth = $tip[0].offsetWidth,
                    actualHeight = $tip[0].offsetHeight,
                    gravity = maybeCall(this.options.gravity, this.$element[0]);
                
                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }
                
                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                
                $tip.css(tp).addClass('tipsy-' + gravity);
                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }
                
                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },
        
        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },
        
        fixTitle: function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
                $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
            }
        },
        
        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            this.fixTitle();
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },
        
        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
            }
            return this.$tip;
        },
        
        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },
        
        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };
    
    $.fn.tipsy = function(options) {
        
        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy) tipsy[options]();
            return this;
        }
        
        options = $.extend({}, $.fn.tipsy.defaults, options);
        
        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }
        
        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };
        
        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };
        
        if (!options.live) this.each(function() { get(this); });
        
        if (options.trigger != 'manual') {
            var binder   = options.live ? 'live' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        
        return this;
        
    };
    
    $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };
    
    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };
    
    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };
    
    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };
    
    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable 
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
     $.fn.tipsy.autoBounds = function(margin, prefer) {
		return function() {
			var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
			    boundTop = $(document).scrollTop() + margin,
			    boundLeft = $(document).scrollLeft() + margin,
			    $this = $(this);

			if ($this.offset().top < boundTop) dir.ns = 'n';
			if ($this.offset().left < boundLeft) dir.ew = 'w';
			if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
			if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

			return dir.ns + (dir.ew ? dir.ew : '');
		}
	};
    
})(jQuery);

/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);
 
 /*
 * FaceScroll v1.0: http://www.dynamicdrive.com/dynamicindex11/facescroll/index.htm
 *
 *Modified By Winston Howes
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 *  jquery.ui.draggable.js
 *  jquery UI Touch Punch
 */


(function($) {
	var methods = {
		init : function(options) {
			this.each(function() {

				if ($(this).hasClass('alternate-scroll')) return;
				$(this).addClass('alternate-scroll');
				
				var settings = $.extend({
					'animation-time' : 500,
					'bar-class' : '',
					'vertical-bar-class' : 'bluevertcustom',
					'horizontal-bar-class' : '',
					'mouse-wheel-sensitivity': 4,
					'auto-size' : true,
					'hide-bars' : true,
					'easing' : 'easeOutCubic'
				}, options);

				
				var scrollHolderWidth = $(this).width();
				var scrollHolderHeight = $(this).height();
				
				var prevOverflow = $(this).css('overflow');
				var prevFloat = $(this).css('float');
				
				var $scrollObj = $(this).scrollTop(0).scrollLeft(0).css({ 'overflow': 'hidden' }).data({'prev-overflow':  prevOverflow, 'prev-float': prevFloat });
				
				$scrollObj.wrapInner('<div class="alt-scroll-holder" style="position: relative;"><div class="alt-scroll-content" style="position: absolute; top: 0; left: 0"></div></div>');
				var $scrollHolder = $('.alt-scroll-holder', $scrollObj);
				var $scrollContent = $('.alt-scroll-content', $scrollObj);
				$scrollHolder.width(scrollHolderWidth).height(scrollHolderHeight);
				var scrollContentWidth = $scrollContent.width();
				$scrollContent.css('width', scrollContentWidth);
				var scrollContentHeight = $scrollContent.height();
				
				var verticalBarMultiplier = scrollHolderHeight / scrollContentHeight;
				var horizontalBarMultiplier = scrollHolderWidth / scrollContentWidth;
				
				var dragScrollPosTop;
				var dragScrollPosLeft;
				var dragTime;
				
				var isTouch = isTouchDevice();
				
				$scrollHolder.append('<div class="alt-scroll-vertical-bar ' + settings['bar-class'] + ' ' + settings['vertical-bar-class'] + '"><ins></ins></div>');
				var $verticalBar = $('.alt-scroll-vertical-bar', $scrollHolder);


				if (document.all && document.documentMode<=8 && settings['bar-class']=='' && settings['vertical-bar-class']=='') // if IE8 and above, add additional style to default style bar to fix display issues
					$verticalBar.css({background:'gray', marginBottom:'4px'})

				$verticalBar.css({ 'display': 'block', 'position': 'absolute', 'top': 0});
				if (($verticalBar.css('background-color') == 'rgba(0, 0, 0, 0)') && ($verticalBar.css('background-image') == 'none')) $verticalBar.css('background-color', 'rgba(0, 0, 0, 0.3)');
				if (($verticalBar.css('background-color') == 'transparent') && ($verticalBar.css('background-image') == 'none')) $verticalBar.css('background-color', 'rgba(0, 0, 0, 0.3)');
				if (parseInt($verticalBar.css('width')) == 0 || $verticalBar.css('width') == 'auto') $verticalBar.css({'width': 7, 'border-radius': 3, 'cursor': 'default' });
				var verticalBarWidth = $verticalBar.width();
				var verticalBarHeight = Math.floor(scrollHolderHeight * verticalBarMultiplier);
				$verticalBar.height(verticalBarHeight - parseInt($verticalBar.css('margin-bottom')));
				
				if (verticalBarMultiplier < 1) {
					if (settings['hide-bars']) $verticalBar.delay(2 * settings['animation-time']).fadeOut(settings['animation-time'] / 2);
				} else {
					$verticalBar.hide();
				}
				
				$scrollHolder.append('<div class="alt-scroll-horizontal-bar ' + settings['bar-class'] + ' ' + settings['horizontal-bar-class'] + '"><ins></ins></div>');
				var $horizontalBar = $('.alt-scroll-horizontal-bar', $scrollHolder);
				$horizontalBar.css({ 'display': 'block', 'position': 'absolute', 'bottom': 0, 'left': 0 });
				if (($horizontalBar.css('background-color') == 'rgba(0, 0, 0, 0)') && ($horizontalBar.css('background-image') == 'none')) $horizontalBar.css('background-color', 'rgba(0, 0, 0, 0.3)');
				if (($horizontalBar.css('background-color') == 'transparent') && ($horizontalBar.css('background-image') == 'none')) $horizontalBar.css('background-color', 'rgba(0, 0, 0, 0.3)');
				if (parseInt($horizontalBar.css('height')) == 0 || $horizontalBar.css('height') == 'auto') $horizontalBar.css({ 'height': 7, 'border-radius': 3, 'cursor': 'default' });
				var horizontalBarHeight = $horizontalBar.height();
				var horizontalBarWidth = Math.floor(scrollHolderWidth * horizontalBarMultiplier);
				var horizontalBarGap = 0;
				if ($verticalBar) {
					horizontalBarGap = parseInt($horizontalBar.css('margin-right')) + Math.ceil(verticalBarWidth * 1.2);
					$horizontalBar.css({ 'margin-right' : horizontalBarGap });
				}
				$horizontalBar.width(horizontalBarWidth - horizontalBarGap);
				if (horizontalBarMultiplier < 1) {
					if (settings['hide-bars']) $horizontalBar.delay(2 * settings['animation-time']).fadeOut(settings['animation-time'] / 2);
				} else {
					$horizontalBar.hide();
				}
							
				var verticalScrollMultiplier = (scrollHolderHeight - scrollContentHeight) / (scrollHolderHeight - verticalBarHeight);
				var horizontalScrollMultiplier = (scrollHolderWidth - scrollContentWidth) / (scrollHolderWidth - horizontalBarWidth);
				
				if (isTouch) {
					var holderOffsetTop = $scrollHolder.offset().top;
					var holderOffsetLeft = $scrollHolder.offset().left;
					
					var dragTopCorner = scrollHolderHeight - scrollContentHeight;
					if (dragTopCorner > 0) dragTopCorner = 0;
					
					var dragLeftCorner = scrollHolderWidth - scrollContentWidth;
					if (dragLeftCorner > 0) dragLeftCorner = 0;
					
					$scrollContent
						.draggable({ scrollSensitivity: 40, containment: [dragLeftCorner + holderOffsetLeft, dragTopCorner + holderOffsetTop, holderOffsetLeft, holderOffsetTop] })
						.bind('drag', function() {
							$verticalBar.stop(true, true).css('top', parseInt($(this).css('top')) / verticalScrollMultiplier);
							$horizontalBar.stop(true, true).css('left', parseInt($(this).css('left')) / horizontalScrollMultiplier);
						})
						.mousedown(function() {
							$(this).stop(true, false);
							var d = new Date();
							dragTime = d.getTime();
							dragScrollPosTop = parseInt($(this).css('top'));
							dragScrollPosLeft = parseInt($(this).css('left'));
							if (settings['hide-bars']) {
								if (verticalBarMultiplier < 1) $verticalBar.stop(true, true).fadeIn(settings['animation-time'] / 2);
								if (horizontalBarMultiplier < 1) $horizontalBar.stop(true, true).fadeIn(settings['animation-time'] / 2);
							}
						})
						.mouseup(function() {
							var d = new Date();
							
							var currentTopPos = parseInt($(this).css('top'));
							var currentLeftPos = parseInt($(this).css('left'))
							
							var newTopPos = currentTopPos + (currentTopPos - dragScrollPosTop) * 50 / (d.getTime() - dragTime);
							if (newTopPos < scrollHolderHeight - scrollContentHeight) newTopPos = scrollHolderHeight - scrollContentHeight;
							if (newTopPos > 0) newTopPos = 0;
							
							var newLeftPos = currentLeftPos + (currentLeftPos - dragScrollPosLeft) * 50 / (d.getTime() - dragTime);
							if (newLeftPos < scrollHolderWidth - scrollContentWidth) newLeftPos = scrollHolderWidth - scrollContentWidth;
							if (newLeftPos > 0) newLeftPos = 0;
							
							$(this).stop(true, false).animate({ 'top': newTopPos, 'left': newLeftPos }, settings['animation-time'])
							
							$verticalBar.stop(true, true).animate({ 'top': newTopPos / verticalScrollMultiplier }, settings['animation-time']);
							$horizontalBar.stop(true, true).animate({ 'left': newLeftPos / horizontalScrollMultiplier }, settings['animation-time']);
							if (settings['hide-bars']) {
								$verticalBar.fadeOut(settings['animation-time']);
								$horizontalBar.fadeOut(settings['animation-time']);
							}
						});
				} else {
					$verticalBar
						.draggable({ containment: $scrollObj, axis: 'y' })
						.bind('drag', function() {
							$scrollContent.css('top', parseInt($(this).css('top')) * verticalScrollMultiplier);
						});
					
					$horizontalBar
						.draggable({ containment: $scrollObj, axis: 'x' })
						.bind('drag', function() {
							$scrollContent.css('left', parseInt($(this).css('left')) * horizontalScrollMultiplier);
						});
					
					$scrollObj.hover(
						function() {
							if (settings['hide-bars']) {
								if (verticalBarMultiplier < 1) { $verticalBar.stop(true, true).css('opacity', '').fadeIn(settings['animation-time'] / 4); }
								if (horizontalBarMultiplier < 1) { $horizontalBar.stop(true, true).css('opacity', '').fadeIn(settings['animation-time'] / 4); }
							}
							mouseWheel(true);
						},
						function() {
							if (settings['hide-bars']) {
								if (verticalBarMultiplier < 1) { $verticalBar.stop(true, true).fadeOut(settings['animation-time'] / 2); }
								if (horizontalBarMultiplier < 1) { $horizontalBar.stop(true, true).fadeOut(settings['animation-time'] / 2); }
							}
							mouseWheel(false);
						}
					);
				}
				
				if (settings['auto-size']) {
					setInterval(function() { handleSizeChanges(); }, 500);
				}
				
				function handleSizeChanges() {
					$scrollContent.css({ 'height': 'auto', 'width': 'auto' });
					if (($scrollContent.height() != scrollContentHeight) || ($scrollContent.width() != scrollContentWidth) || ($scrollObj.width() != scrollHolderWidth) || ($scrollObj.height() != scrollHolderHeight)) {
						scrollHolderWidth = $scrollObj.width();
						scrollHolderHeight = $scrollObj.height();
						$scrollHolder.width(scrollHolderWidth).height(scrollHolderHeight);
						scrollContentWidth = $scrollContent.width();
						$scrollContent.css('width', scrollContentWidth);
						scrollContentHeight = $scrollContent.height();
						
						verticalBarMultiplier = scrollHolderHeight / scrollContentHeight;
						horizontalBarMultiplier = scrollHolderWidth / scrollContentWidth;
						
						verticalBarHeight = Math.floor(scrollHolderHeight * verticalBarMultiplier);
						if (verticalBarMultiplier < 1) {
							$verticalBar.height(verticalBarHeight - parseInt($verticalBar.css('margin-bottom')));
							if (!settings['hide-bars']) $verticalBar.stop(true, true).fadeIn(settings['animation-time'] / 2);
						} else {
							$verticalBar.stop(true, true).fadeOut(settings['animation-time'] / 2);
						}
						
						horizontalBarWidth = Math.floor(scrollHolderWidth * horizontalBarMultiplier);
						if (horizontalBarMultiplier < 1) {
							$horizontalBar.width(horizontalBarWidth - horizontalBarGap);
							if (!settings['hide-bars']) $horizontalBar.stop(true, true).fadeIn(settings['animation-time'] / 2);
						} else {
							$horizontalBar.stop(true, true).fadeOut(settings['animation-time'] / 2);
						}
						
						verticalScrollMultiplier = (scrollHolderHeight - scrollContentHeight) / (scrollHolderHeight - verticalBarHeight);
						horizontalScrollMultiplier = (scrollHolderWidth - scrollContentWidth) / (scrollHolderWidth - horizontalBarWidth);
						
						var currentScrollLeft = parseInt($scrollContent.css('left'));
						if (currentScrollLeft < scrollHolderWidth - scrollContentWidth) currentScrollLeft = scrollHolderWidth - scrollContentWidth;
						if (currentScrollLeft > 0) currentScrollLeft = 0;
						
						var currentScrollTop = parseInt($scrollContent.css('top'));
						if (currentScrollTop < scrollHolderHeight - scrollContentHeight) currentScrollTop = scrollHolderHeight - scrollContentHeight;
						if (currentScrollTop > 0) currentScrollTop = 0;
						
						$scrollContent.stop(true, false).animate( { 'left': currentScrollLeft, 'top': currentScrollTop }, { duration: settings['animation-time'] / 2, queue: true });
						
						$verticalBar.css('top', currentScrollTop / verticalScrollMultiplier);
						$horizontalBar.css('left', currentScrollLeft / horizontalScrollMultiplier);
						
						if (isTouch) {
							holderOffsetTop = $scrollHolder.offset().top;
							holderOffsetLeft = $scrollHolder.offset().left;
							
							dragTopCorner = scrollHolderHeight - scrollContentHeight;
							if (dragTopCorner > 0) dragTopCorner = 0;
							
							dragLeftCorner = scrollHolderWidth - scrollContentWidth;
							if (dragLeftCorner > 0) dragLeftCorner = 0;
							
							$scrollContent.draggable({ containment: [dragLeftCorner + holderOffsetLeft, dragTopCorner + holderOffsetTop, holderOffsetLeft, holderOffsetTop] });
						}
					}
				}
				
				function mouseWheel(init) {
					if (init) {
						if (window.addEventListener) {
							window.addEventListener('DOMMouseScroll', handleMouseWheel, false);
						}
						window.onmousewheel = document.onmousewheel = handleMouseWheel;
					} else {
						if (window.removeEventListener) {
							window.removeEventListener('DOMMouseScroll', handleMouseWheel);
						}
						window.onmousewheel = document.onmousewheel = null;
					}
				}
				
				function handleMouseWheel(event) {
					var delta = 0;
					if (!event) { event = window.event; }
					if (event.wheelDelta) {
						delta = event.wheelDelta / 120;
					} else if (event.detail) {
						delta = -event.detail / 3;
					}
					if (delta == 0) { return; }
					if (verticalBarMultiplier >= 1) { return; }
					var newContentTop = parseInt($scrollContent.css('top')) + Math.floor(delta * scrollHolderHeight / settings['mouse-wheel-sensitivity']);
					if (newContentTop > 0) { newContentTop = 0; }
					if (newContentTop < scrollHolderHeight - scrollContentHeight) { newContentTop = scrollHolderHeight - scrollContentHeight; }
					$scrollContent.stop(true, false).animate({ 'top': newContentTop }, { duration: settings['animation-time'], queue: true,  easing: settings['easing'] });
					$verticalBar.stop(true, false).animate({ 'top': newContentTop / verticalScrollMultiplier }, { duration: settings['animation-time'], queue: true, easing: settings['easing'] });
					
					if (event.preventDefault) { event.preventDefault(); }
					event.returnValue = false;
				}
				
				function isTouchDevice() {
					var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
					try {
						document.createEvent("TouchEvent");
						return true && mobile;
					} catch (e) {
						return false && mobile;
					}
				}
				
				function getStyleProperty(DOMobj, property) {
					if (DOMobj.style.getPropertyValue) {
						return (DOMobj.style.getPropertyValue(property));
					} else {
						return (DOMobj.style.getAttribute(property));
					}
				}
			});
		},
		
		remove : function() {
			this.each(function() {
				var $scrollObj = $(this);
				if (!$scrollObj.hasClass('alternate-scroll')) return;
				$('.alt-scroll-vertical-bar', $scrollObj).remove();
				$('.alt-scroll-horizontal-bar', $scrollObj).remove();
				$('.alt-scroll-content', $scrollObj).wrapInner('<div class="alt-scroll-dummy"></div>');
				$('.alt-scroll-dummy', $scrollObj).insertAfter($('.alt-scroll-holder', $scrollObj));
				$('.alt-scroll-holder', $scrollObj).remove();
				$('.alt-scroll-dummy > *:first-child', $scrollObj).unwrap();
				$scrollObj.css({ 'overflow': $scrollObj.data('prev-overflow'), 'float': $scrollObj.data('prev-float') }).removeClass('alternate-scroll');
			});
		}
	}
	
	$.fn.alternateScroll = function(method) {
		if (document.all && typeof XDomainRequest=="undefined") //if IE7 or less
			return
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.alternateScroll' );
		}
	};
})( jQuery );