/**
 * Created by xiaoningning on 2015/7/24.
 */
(function () {
    function Slider(options) {
        this.options = {
            width: 0,
            height: 0,
            loop: false,
            arrow: false,
            dot: false,
            autoplay: false,
            duration: 5000
        };
        $.extend(this.options, options);
    }

    Slider.prototype = {
        init: function () {
            this.options.$elem = $(this.options.elem);
            this.sliderCon = this.options.$elem.find(".slider-con");
            this.ulWrap = this.options.$elem.find(".slider-con>ul");
            this.liItems = this.options.$elem.find(".slider-con>ul>li");
            this.total = this.liItems.length; //实际节点的个数
            this.curIndex = 0;

            if(this.total<=1){
                return;
            }

            this.renderer();
            this.bindEvent();

            if (this.options.autoplay) {
                this.play();
            }
        },
        renderer: function () {
            var $elem = this.options.$elem;
            var t = this;

            //是否循环
            if (t.options.loop) {
                var clone1 = t.liItems.first().clone(),
                    clone2 = t.liItems.last().clone();
                t.ulWrap.append(clone1);
                t.ulWrap.prepend(clone2);
                t.liItems = t.options.$elem.find("ul>li");
            }

            //是否添加左右键
            if (t.options.arrow) {
                var arrowPrev, arrowNext;
                arrowPrev = document.createElement("a");
                arrowPrev.className = 'slider-arrow prev';
                arrowPrev.innerHTML = "上一页";
                arrowNext = document.createElement("a");
                arrowNext.className = 'slider-arrow next';
                arrowNext.innerHTML = "下一页";

                if (!t.options.loop) {
                    arrowPrev.style.display = 'none';
                }
                $elem.append(arrowPrev);
                $elem.append(arrowNext);

                t.arrows = {
                    prev: arrowPrev,
                    next: arrowNext
                };
            }

            //添加点击节点
            if (t.options.dot) {
                var dotWrap = document.createElement("span"), dot;
                dotWrap.className = "slider-dot-container";

                t.dots = [];
                for (var i = 0, len = t.total; i < len; i++) {
                    dot = document.createElement("div");
                    dot.className = i==0 ? "slider-dot slider-dot-selected": "slider-dot";
                    dot.innerHTML = i;
                    dotWrap.appendChild(dot);
                    t.dots.push(dot);
                }
                $elem.append(dotWrap);
            }

            //渲染节点
            var len = t.liItems.length,
                marginLeft = t.options.loop ? -t.options.width : 0;

            t.sliderCon.css({
                width: t.options.width + "px",
                overflow: "hidden"
            });
            t.ulWrap.css({
                width: (t.options.width * len) + "px",
                height: t.options.height + "px",
                marginLeft: marginLeft + "px"
            });
            $.each(t.liItems, function (i, liItem) {
                $(liItem).css({
                    float: "left",
                    width: t.options.width + "px",
                    height: t.options.height + "px"
                });
            });
        },
        bindEvent: function () {
            var t = this;

            if (t.options.arrow) {
                $.each(t.arrows, function (i, arrow) {
                    var $arrow = $(arrow),
                        clsName = arrow.className;
                    var dir = clsName.split(" ")[1];

                    $arrow.on("click", $.proxy(t[dir], t));
                });
            }

            //绑定dots点击事件
            if (t.options.dot) {
                $.each(t.dots, function (i, dot) {
                    var $dot = $(dot);

                    $dot.on("click", function (e) {
                        e.preventDefault();
                        var i = $(this).index();

                        t.stop();
                        t.stoped = true;
                        t.move(i);
                    });
                });
            }
        },
        prev: function (e) {
            e.preventDefault();
            this.stop();
            this.stoped = true;
            this.to("-1");
        },
        next: function (e) {
            e.preventDefault();
            this.stop();
            this.stoped = true;
            this.to("+1");
        },
        play: function () {
            var t = this;
            this.timer = setInterval(function () {
                t.to("+1");
            }, this.options.duration);
        },
        to: function (dir) {
            var t = this,
                i = t.curIndex + dir * 1,
                width = this.options.width;

            if (t.options.loop) {
                if (i == -1) {
                    t.curIndex = t.total-1;
                    t.ulWrap.animate({
                        marginLeft: 0
                    }, 700, function () {
                        t.ulWrap.css({
                            marginLeft: -(t.curIndex + 1) * width + "px"
                        });
                        if (t.stoped) {
                            t.play();
                            t.stoped = false;
                        }
                    });
                } else if (i == t.total) {
                    t.curIndex = 0;
                    t.ulWrap.animate({
                        marginLeft: -(t.total+1) * width + "px"
                    }, 700, function () {
                        t.ulWrap.css({
                            marginLeft: -width + "px"
                        });
                        if (t.stoped) {
                            t.play();
                            t.stoped = false;
                        }
                    });
                } else {
                    t.curIndex = i;
                    t.ulWrap.animate({
                        marginLeft: -(i + 1) * width + "px"
                    }, 700, function () {
                        if (t.stoped) {
                            t.play();
                            t.stoped = false;
                        }
                    });
                }
            } else {
                if (i == -1) {
                    t.curIndex = t.total - 1;
                } else if (i == t.total) {
                    t.curIndex = 0;
                } else {
                    t.curIndex = i;
                }
                t.ulWrap.animate({
                    marginLeft: -t.curIndex * width + "px"
                }, 700, function () {
                    if (t.stoped) {
                        t.stop();
                        t.stoped = false;
                    }
                });
            }

            t.updateArrowStatus();
            t.updateDotStatus();
        },
        updateArrowStatus: function () {
            var $prev=$(this.arrows.prev), $next=$(this.arrows.next);
            if (this.options.arrow && !this.options.loop) {
                if (this.curIndex == 0) {
                    $prev.hide();
                    $next.show();
                } else if (this.curIndex == this.total - 1) {
                    $next.hide();
                    $prev.show();
                }else{
                    $next.show();
                    $prev.show();
                }
            }
        },
        updateDotStatus: function(){
            if(this.curIndex>=0 && this.curIndex<this.total){
                $(this.dots).eq(this.curIndex).addClass("slider-dot-selected").siblings().removeClass("slider-dot-selected");
            }
        },
        move: function (i) {
            var t = this,
                width = this.options.width;

            t.curIndex = i;
            t.ulWrap.animate({
                marginLeft: -(t.options.loop ? i + 1 : i) * width + "px"
            }, 700);

            if(t.stoped){
                t.play();
                t.stoped = false;
            }

            t.updateArrowStatus();
            t.updateDotStatus();
        },
        stop: function () {
            if (this.timer != null) {
                clearInterval(this.timer);
            }
        }
    };
    window.Slider = Slider;

    $.fn.slider = function (o) {
        return this.each(function(){
            $.extend(o,{elem: this});
            (new Slider(o)).init();
        });
    }
})();