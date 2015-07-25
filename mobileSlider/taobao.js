/**
 * Created by xiaoningning on 2015/7/11.
 */
! function(a, b, c) {
    function d(a) {
        var b, c = {
                x: 0,
                y: 0
            },
            d = getComputedStyle(a)[k + "Transform"];
        return "none" !== d && (b = d.match(/^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/) || d.match(/^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/)) && (c.x = parseFloat(b[1]) || 0, c.y = parseFloat(b[2]) || 0), c
    }

    function e(a, b) {
        return a = parseFloat(a), b = parseFloat(b), 0 != a && (a += "px"), 0 != b && (b += "px"), m ? "translate3d(" + a + ", " + b + ", 0)" : "translate(" + a + ", " + b + ")"
    }

    function f(a, c) {
        function f(a, b) {
            var c = g.createEvent("HTMLEvents");
            if (c.initEvent(a, !1, !1), b)
                for (var d in b) c[d] = b[d];
            l.dispatchEvent(c)
        }

        function h(a) {
            var b = o.get(a),
                c = o.get(a - 1),
                d = o.get(a + 1);
            b.style.left = -m + "px", c.style.left = -m - q + "px", d.style.left = -m + q + "px", r = b.index, f("change")
        }
        var i = this,
            j = Date.now() + "-" + ++n,
            l = document.createDocumentFragment();
        1 !== arguments.length || arguments[0] instanceof HTMLElement || (c = arguments[0], a = null), a || (a = document.createElement("ul"), l.appendChild(a)), c = c || {}, a.setAttribute("data-ctrl-name", "carrousel"), a.setAttribute("data-ctrl-id", j), a.style.position = "relative", a.style[k + "Transform"] = e(0, 0);
        var m = 0,
            o = {},
            p = 0,
            q = c.step || a.getBoundingClientRect().width,
            r = 0;
        o.add = function(b) {
            var c = document.createElement("li");
            return c.style.display = "none", c.style.float = "left", c.index = p, "string" == typeof b ? c.innerHTML = b : b instanceof HTMLElement && c.appendChild(b), a.appendChild(c), Object.defineProperty(o, p + "", {
                get: function() {
                    return c
                }
            }), p++, c
        }, o.get = function(a) {
            for (; 0 > a;) a += p;
            for (; a >= p;) a -= p;
            return o[a]
        }, o.slide = function(c) {
            var f = d(a).x,
                g = m + q * -c,
                i = g - f,
                j = new b.animation(400, b.cubicbezier.ease, 0, function(b, c) {
                    a.style[k + "Transform"] = e(f + i * c, 0)
                });
            j.onend(function() {
                m = g, a.style[k + "Transform"] = e(g, 0), c && h(r + c)
            }), j.play()
        }, o.next = function() {
            o.slide(1)
        }, o.prev = function() {
            o.slide(-1)
        }, Array.prototype.slice.call(a.querySelectorAll("li")).forEach(function(a) {
            a.style.position = "absolute", a.style.top = "0", a.style.left = p * q + "px", a.style.float = "left", a.index = p, Object.defineProperty(o, p + "", {
                get: function() {
                    return a
                }
            }), p++
        }), Object.defineProperty(this, "items", {
            get: function() {
                return o
            }
        }), Object.defineProperty(o, "length", {
            get: function() {
                return p
            }
        }), Object.defineProperty(o, "index", {
            get: function() {
                return r
            }
        }), Object.defineProperty(o, "step", {
            get: function() {
                return q
            },
            set: function(a) {
                q = a
            }
        });
        var s = !1,
            t = !1,
            u = !1;
        this.play = function() {
            return s ? void(t || (t = setTimeout(function() {
                u = !0, o.next(), setTimeout(function() {
                    u = !1
                }, 500), t = setTimeout(arguments.callee, 400 + w)
            }, 400 + w))) : (s = !0, h(0))
        }, this.stop = function() {
            t && (clearTimeout(t), setTimeout(function() {
                t = !1
            }, 500))
        };
        var v = !1;
        Object.defineProperty(this, "autoplay", {
            get: function() {
                return v
            },
            set: function(a) {
                v = !!a, v ? setTimeout(function() {
                    i.play()
                }, 2e3) : i.stop()
            }
        }), this.autoplay = !!c.autoplay;
        var w = 1500;
        if (Object.defineProperty(this, "playInterval", {
                get: function() {
                    return w
                },
                set: function(a) {
                    w = a
                }
            }), this.playInterval = !!c.playInterval || 1500, c.useGesture) {
            var x, y = !1;
            a.addEventListener("panstart", function(a) {
                a.isVertical || y && u || (a.preventDefault(), a.stopPropagation(), v && i.stop(), x = 0, y = !0)
            }), a.addEventListener("pan", function(b) {
                !b.isVertical && y && (b.preventDefault(), b.stopPropagation(), x = b.displacementX, a.style[k + "Transform"] = e(m + x, 0))
            }), a.addEventListener("panend", function(a) {
                !a.isVertical && y && (a.preventDefault(), a.stopPropagation(), y = !1, a.isflick ? 0 > x ? o.next() : o.prev() : o.slide(Math.abs(x) < q / 2 ? 0 : 0 > x ? 1 : -1), v && setTimeout(function() {
                    i.play()
                }, 2e3))
            }, !1), a.addEventListener("flick", function(a) {
                a.isVertical || (a.preventDefault(), a.stopPropagation())
            })
        }
        this.addEventListener = function(a, b) {
            this.root.addEventListener(a, b, !1)
        }, this.removeEventListener = function(a, b) {
            this.root.removeEventListener(a, b, !1)
        }, this.root = l, this.element = a
    }
    var g = a.document,
        h = a.navigator.userAgent,
        i = !!h.match(/Firefox/i),
        j = !!h.match(/IEMobile/i),
        k = i ? "Moz" : j ? "ms" : "webkit",
        l = j ? "MSCSSMatrix" : "WebKitCSSMatrix",
        m = !!i || l in a && "m11" in new a[l],
        n = 0;
    c.carrousel = f;
    //console.log(g, h, i, j, k, l, m, n);
}(window, window.lib, window.ctrl || (window.ctrl = {}));
