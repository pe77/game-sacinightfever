var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.onload = function () {
    var game = new GameBase.Game();
};
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkEvent = (function () {
        function PkEvent(name, target) {
            this.id = ++PkEvent.id;
            this.listeners = [];
            this.target = target;
            this.name = name;
            Pk.PkEvent.events.push(this);
        }
        PkEvent.ignoreContext = function (context) {
            for (var i = 0; i < Pk.PkEvent.events.length; i++) {
                var event = Pk.PkEvent.events[i];
                var listeners = Pk.PkEvent.events[i].listeners;
                var tmpListeners = [];
                for (var j = 0; j < listeners.length; j++) {
                    var listener = listeners[j];
                    if (!listener.context.event) {
                        tmpListeners.push(listener);
                        continue;
                    }
                    if (listener.context.event.id !== context.event.id) {
                        tmpListeners.push(listener);
                    }
                    else {
                        // console.debug('ignore context:', context)
                    }
                }
                Pk.PkEvent.events[i].listeners = tmpListeners;
            }
        };
        PkEvent.prototype.add = function (key, callBack, context) {
            var context = context || {};
            var exist = false;
            // verifica se já não foi add
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].callBack.toString() === callBack.toString()
                    &&
                        this.listeners[i].context === context) {
                    exist = true;
                    break;
                }
            }
            ;
            if (!exist)
                this.listeners.push({ key: key, callBack: callBack, context: context });
            //
        };
        PkEvent.prototype.clear = function (key) {
            // clear all
            if (!key) {
                this.listeners = [];
            }
            else {
                var tmpListeners = [];
                for (var i = 0; i < this.listeners.length; i++) {
                    if (key != this.listeners[i].key) {
                        tmpListeners.push(this.listeners[i]);
                    }
                }
                this.listeners = tmpListeners;
                return;
            }
        };
        PkEvent.prototype.dispatch = function (key) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.target.name == 'Lizzard') {
                // console.debug('dispath lizzard event:', key)
            }
            for (var i = 0; i < this.listeners.length; i++) {
                if (key == this.listeners[i].key) {
                    var data = {
                        target: this.target // ho dispatch the event
                    };
                    // se houver contexto, manda pelo contexto
                    if (this.listeners[i].context) {
                        (_a = this.listeners[i].callBack).call.apply(_a, [this.listeners[i].context, data].concat(args));
                        continue;
                    }
                    // dispara sem contexto mesmo
                    (_b = this.listeners[i]).callBack.apply(_b, [data].concat(args));
                }
            }
            var _a, _b;
        };
        return PkEvent;
    }());
    PkEvent.id = 0;
    PkEvent.events = [];
    Pk.PkEvent = PkEvent;
})(Pk || (Pk = {}));
/// <reference path='../PkTransition.ts' />
var Pk;
(function (Pk) {
    var PkTransitionAnimation;
    (function (PkTransitionAnimation) {
        var Default = (function () {
            function Default() {
                this.event = new Pk.PkEvent('PkTADefault', this);
            }
            Default.prototype.start = function () {
                // animation here
                // ...
                this.event.dispatch(Pk.E.OnTransitionEndStart);
            };
            Default.prototype.end = function () {
                // animation here
                // ...
                this.event.dispatch(Pk.E.OnTransitionEndEnd);
            };
            return Default;
        }());
        PkTransitionAnimation.Default = Default;
    })(PkTransitionAnimation = Pk.PkTransitionAnimation || (Pk.PkTransitionAnimation = {}));
})(Pk || (Pk = {}));
/// <reference path='../event/PkEvent.ts' />
/// <reference path='../PkGame.ts' />
/// <reference path='PkState.ts' />
/// <reference path='transitions/Default.ts' />
var Pk;
(function (Pk) {
    var PkTransition = (function () {
        function PkTransition(state) {
            this.transitionAnimation = new Pk.PkTransitionAnimation.Default();
            // defaults
            this.clearWorld = true;
            this.clearCache = false;
            this.game = state.game;
            this.state = state;
        }
        PkTransition.prototype.change = function (to) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.to = to;
            this.params = args;
            this.transitionAnimation.event.add(Pk.E.OnTransitionEndStart, this.endStartAnimation, this);
            this.transitionAnimation.event.add(Pk.E.OnTransitionEndEnd, this.endStartAnimation, this);
            this.transitionAnimation.start();
        };
        // This is called when the state preload has finished and creation begins
        PkTransition.prototype.endStartAnimation = function (e) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.game.state.onStateChange.addOnce(function (state) {
                // get current state
                var currentState = _this.game.state.getCurrentState();
                _this.game.state.onCreateCallback = function () {
                    // call current state create
                    currentState.create();
                    // play transition end
                    _this.transitionAnimation.end();
                };
            });
            // change state
            (_a = this.game.state).start.apply(_a, [this.to, this.clearWorld, this.clearCache].concat(this.params));
            var _a;
        };
        return PkTransition;
    }());
    Pk.PkTransition = PkTransition;
    var E;
    (function (E) {
        E.OnTransitionEndStart = "OnTransitionEndStart";
        E.OnTransitionEndEnd = "OnTransitionEndEnd";
    })(E = Pk.E || (Pk.E = {}));
})(Pk || (Pk = {}));
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkElement = (function (_super) {
        __extends(PkElement, _super);
        function PkElement(game) {
            var _this = _super.call(this, game) || this;
            _this.id = ++PkElement.id;
            _this.tweens = [];
            _this.name = "PkElement-" + _this.id;
            // inicia gerenciador de eventos
            _this.event = new Pk.PkEvent('element-event-' + _this.id, _this);
            return _this;
        }
        PkElement.prototype.getId = function () {
            return this.id;
        };
        PkElement.prototype.addTween = function (displayObject) {
            this.tweens.push(this.game.add.tween(displayObject));
            return this.tweens[this.tweens.length - 1];
        };
        PkElement.prototype.destroy = function () {
            // stop all tweens
            for (var i = this.tweens.length - 1; i >= 0; i--)
                this.tweens[i].stop();
            //
            // clear all events propagation many-to-many
            this.event.clear();
            Pk.PkEvent.ignoreContext(this);
            _super.prototype.destroy.call(this);
        };
        return PkElement;
    }(Phaser.Group));
    PkElement.id = 0;
    Pk.PkElement = PkElement;
})(Pk || (Pk = {}));
/// <reference path='PkTransition.ts' />
/// <reference path='../element/PkElement.ts' />
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkState = (function (_super) {
        __extends(PkState, _super);
        function PkState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.layers = [];
            _this.addLayer = function (layerName) {
                var exist = false;
                // check if already exist
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name == layerName) {
                        exist = true;
                        break;
                    }
                }
                ;
                if (!exist) {
                    // add to layer
                    this.layers.push({
                        name: layerName,
                        total: 0,
                        group: this.game.add.group()
                    });
                }
            };
            _this.addToLayer = function (layerName, element) {
                var exist = false;
                // check if already exist
                for (var i = 0; i < this.layers.length; i++) {
                    if (this.layers[i].name == layerName) {
                        exist = true;
                        break;
                    }
                }
                ;
                // if dont exist, wharever
                if (!exist)
                    return;
                //
                // add element to layer
                this.layers[i].group.add(element);
                this.layers[i].total = this.layers[i].group.total;
                // order layers
                for (var i = 0; i < this.layers.length; i++)
                    this.game.world.bringToTop(this.layers[i].group);
                //
            };
            return _this;
        }
        PkState.prototype.getGame = function () {
            return this.game;
        };
        PkState.prototype.getLayer = function (layerName) {
            for (var i = 0; i < this.layers.length; i++)
                if (this.layers[i].name == layerName)
                    return this.layers[i];
            //
            return null;
        };
        PkState.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.transition = new Pk.PkTransition(this);
        };
        PkState.prototype.create = function () {
            // console.log('PkState create');
        };
        return PkState;
    }(Phaser.State));
    Pk.PkState = PkState;
})(Pk || (Pk = {}));
/// <reference path='vendor/phaser/phaser.d.ts' />
/// <reference path='state/PkState.ts' />
var Pk;
(function (Pk) {
    var PkGame = (function (_super) {
        __extends(PkGame, _super);
        function PkGame(pkConfig) {
            if (pkConfig === void 0) { pkConfig = new Pk.PkConfig(); }
            var _this = _super.call(this, pkConfig.canvasSize[0], pkConfig.canvasSize[1], pkConfig.renderMode, pkConfig.canvasId) || this;
            PkGame.pkConfig = pkConfig;
            // add states
            _this.state.add('PkLoaderPreLoader', PkGame.pkConfig.preLoaderState);
            // init loader
            _this.state.start('PkLoaderPreLoader');
            PkGame.game = _this;
            return _this;
        }
        return PkGame;
    }(Phaser.Game));
    Pk.PkGame = PkGame;
    var PkLoaderPreLoader = (function (_super) {
        __extends(PkLoaderPreLoader, _super);
        function PkLoaderPreLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PkLoaderPreLoader.prototype.init = function () {
            // add loader screen
            this.game.state.add('PkLoader', PkGame.pkConfig.loaderState);
        };
        PkLoaderPreLoader.prototype.preload = function () {
            // load loadingbar sprite
            this.load.image('pk-loading-bar', PkGame.pkConfig.loaderLoadingBar);
        };
        PkLoaderPreLoader.prototype.create = function () {
            // change to preloader screen*
            this.game.state.start('PkLoader');
        };
        return PkLoaderPreLoader;
    }(Pk.PkState));
    Pk.PkLoaderPreLoader = PkLoaderPreLoader;
})(Pk || (Pk = {}));
var Pk;
(function (Pk) {
    var PkConfig = (function () {
        function PkConfig() {
            this.canvasSize = [800, 600]; // width, height
            this.canvasId = 'game';
            this.renderMode = RenderMode.AUTO;
            this.initialState = ''; // initial state after loadscreen
            // loading settings
            this.loaderLoadingBar = 'assets/states/loader/images/loading-bar.png'; // loading bar
            this.loaderWaitingTime = 1000; // 1 sec
            this.loaderState = Pk.PkLoader;
            this.preLoaderState = Pk.PkLoaderPreLoader;
        }
        return PkConfig;
    }());
    Pk.PkConfig = PkConfig;
    // for remember ...    :'(     ... never forget
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["AUTO"] = Phaser.AUTO] = "AUTO";
        RenderMode[RenderMode["CANVAS"] = Phaser.CANVAS] = "CANVAS";
        RenderMode[RenderMode["WEBGL"] = Phaser.WEBGL] = "WEBGL";
        RenderMode[RenderMode["HEADLESS"] = Phaser.HEADLESS] = "HEADLESS";
    })(RenderMode = Pk.RenderMode || (Pk.RenderMode = {}));
})(Pk || (Pk = {}));
/// <reference path='state/PkState.ts' />
var Pk;
(function (Pk) {
    var PkLoader = (function (_super) {
        __extends(PkLoader, _super);
        function PkLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PkLoader.prototype.init = function () {
        };
        PkLoader.prototype.preload = function () {
            this.load.setPreloadSprite(this.add.sprite(200, 250, 'pk-loading-bar'));
        };
        PkLoader.prototype.create = function () {
            var _this = this;
            setTimeout(function () {
                // if initial state set, load
                if (Pk.PkGame.pkConfig.initialState != '')
                    _this.game.state.start(Pk.PkGame.pkConfig.initialState);
                //
            }, Pk.PkGame.pkConfig.loaderWaitingTime);
        };
        return PkLoader;
    }(Pk.PkState));
    Pk.PkLoader = PkLoader;
})(Pk || (Pk = {}));
/// <reference path='../vendor/phaser/phaser.d.ts' />
var Pk;
(function (Pk) {
    var PkUtils = (function () {
        function PkUtils() {
        }
        // check if is a empty object
        PkUtils.isEmpty = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }
            return true && JSON.stringify(obj) === JSON.stringify({});
        };
        PkUtils.createSquareBitmap = function (game, width, height, color) {
            if (color === void 0) { color = "#000000"; }
            var bmd = game.add.bitmapData(width, height);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, width, height);
            bmd.ctx.fillStyle = color;
            bmd.ctx.fill();
            return bmd;
        };
        PkUtils.createSquare = function (game, width, height, color) {
            if (color === void 0) { color = "#000000"; }
            var bmd = Pk.PkUtils.createSquareBitmap(game, width, height, color);
            return game.add.sprite(0, 0, bmd);
        };
        return PkUtils;
    }());
    Pk.PkUtils = PkUtils;
})(Pk || (Pk = {}));
/// <reference path='PkGame.ts' />
/// <reference path='PkConfig.ts' />
/// <reference path='PkLoader.ts' />
/// <reference path='state/PkState.ts' />
/// <reference path='state/PkTransition.ts' />
/// <reference path='state/transitions/Default.ts' />
/// <reference path='event/PkEvent.ts' />
/// <reference path='element/PkElement.ts' />
/// <reference path='utils/PkUtils.ts' /> 
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super.call(this, new Config()) || this;
            // add default state
            _this.state.add('Main', GameBase.Main);
            _this.state.add('Intro', GameBase.Intro);
            return _this;
        }
        return Game;
    }(Pk.PkGame));
    GameBase.Game = Game;
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config() {
            var _this = _super.call(this) || this;
            // loading load screen assets (logo, loading bar, etc) [pre-preloading]
            _this.preLoaderState = GameBase.Preloader;
            // loading all* game assets
            _this.loaderState = GameBase.Loader;
            // this.canvasSize = ["100%", 720];
            _this.canvasSize = [450, 720];
            _this.initialState = 'Intro';
            return _this;
        }
        return Config;
    }(Pk.PkConfig));
})(GameBase || (GameBase = {}));
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var IntroBox = (function (_super) {
        __extends(IntroBox, _super);
        function IntroBox(game, image, time) {
            if (time === void 0) { time = 5000; }
            var _this = _super.call(this, game) || this;
            // set img
            _this.image = image;
            _this.time = time;
            _this.image.anchor.x = .5;
            _this.image.x = _this.game.world.centerX;
            // add objs
            _this.add(_this.image);
            // "display none"
            _this.alpha = 0;
            return _this;
        }
        IntroBox.prototype.in = function (delay) {
            // anim block
            var _this = this;
            if (delay === void 0) { delay = 1500; }
            this.addTween(this).to({
                alpha: 1
            }, // props
            500, // animation time
            Phaser.Easing.Linear.None, // tween
            true, // auto start
            delay // delay 
            );
            setTimeout(function () {
                _this.event.dispatch(GameBase.E.IntroBoxEvent.OnIntroBoxEnd);
            }, this.time);
        };
        IntroBox.prototype.out = function (delay) {
            var _this = this;
            if (delay === void 0) { delay = 0; }
            // anim block
            var outTween = this.addTween(this).to({
                alpha: 0
            }, // props
            500, // animation time
            Phaser.Easing.Linear.None, // tween
            false, // auto start
            delay // delay 
            );
            // remove when anim out complete
            outTween.onComplete.add(function () {
                _this.destroy();
            }, this);
            outTween.start();
        };
        return IntroBox;
    }(Pk.PkElement));
    GameBase.IntroBox = IntroBox;
    var E;
    (function (E) {
        var IntroBoxEvent;
        (function (IntroBoxEvent) {
            IntroBoxEvent.OnIntroBoxEnd = "OnIntroBoxEnd";
        })(IntroBoxEvent = E.IntroBoxEvent || (E.IntroBoxEvent = {}));
        var IntroBoxDirection;
        (function (IntroBoxDirection) {
            IntroBoxDirection[IntroBoxDirection["LEFT"] = 0] = "LEFT";
            IntroBoxDirection[IntroBoxDirection["RIGHT"] = 1] = "RIGHT";
        })(IntroBoxDirection = E.IntroBoxDirection || (E.IntroBoxDirection = {}));
    })(E = GameBase.E || (GameBase.E = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            // utils / vendor
            this.load.script('WebFont', 'com/gamebase/vendor/webfontloader.js');
            // load game loading bar
            // this.load.image('game-loading-bar', 'assets/states/loader/images/loading-bar.png');
            // load game loading logo
            // this.load.image('game-loading-logo', 'assets/states/loader/images/logo.png');
        };
        return Preloader;
    }(Pk.PkLoaderPreLoader));
    GameBase.Preloader = Preloader;
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Loader.prototype.init = function () {
            _super.prototype.init.call(this);
        };
        Loader.prototype.preload = function () {
            // ignore preloading bar
            // super.preload();
            var _this = this;
            // creating sprites from preloadead images
            // this.logo           = this.add.sprite(0, 0, 'game-loading-logo');
            // create custom loading bar
            this.loadingBar = Pk.PkUtils.createSquare(this.game, this.game.width, 20, "#ffffff");
            // set sprite as preloading
            this.load.setPreloadSprite(this.loadingBar);
            // pos loading bar on bot
            this.loadingBar.y = this.world.height - this.loadingBar.height - 250;
            this.loadingText = this.game.add.text(0, 0, '0%', // text
            {
                font: "120px Love Story Rough",
                fill: "#ffffff"
            } // font style
            );
            this.loadingText.anchor.set(.5, .5);
            this.loadingText.x = this.world.centerX;
            this.loadingText.y = this.world.centerY;
            // fileComplete
            // this.fil
            this.game.load.onFileComplete.add(function (progress) {
                var v = Math.round((progress * 0.01) * 100);
                _this.loadingText.text = v + '%';
            }, this);
            //  ** ADDING Other things  ** //
            // scripts
            this.load.script('gray', 'assets/default/scripts/filters/Gray.js');
            // step
            this.load.image('step-top', 'assets/states/main/images/step/step-top.png');
            this.load.image('step-down', 'assets/states/main/images/step/step-down.png');
            this.load.image('step-left', 'assets/states/main/images/step/step-left.png');
            this.load.image('step-right', 'assets/states/main/images/step/step-right.png');
            this.load.image('step-back', 'assets/states/main/images/step/step-back.png');
            // audience
            this.load.image('aud-middle', 'assets/states/main/images/audience/middle.png');
            this.load.image('aud-left', 'assets/states/main/images/audience/left.png');
            this.load.image('aud-right', 'assets/states/main/images/audience/right.png');
            // likometter
            this.load.image('likebar-back', 'assets/states/main/images/likometer/back.png');
            this.load.image('likebar-border', 'assets/states/main/images/likometer/border.png');
            this.load.image('likebar-bar', 'assets/states/main/images/likometer/bar.png');
            this.load.image('likebar-smile', 'assets/states/main/images/likometer/happy.png');
            this.load.image('likebar-sad', 'assets/states/main/images/likometer/sad.png');
            // time
            this.load.image('time-bar', 'assets/states/main/images/time/bar.png');
            this.load.image('time-clock', 'assets/states/main/images/time/clock.png');
            // score
            this.load.image('score-money', 'assets/states/main/images/score/money.png');
            // score
            this.load.image('level-bg', 'assets/states/main/images/level/bg.png');
            // saci moves
            this.load.spritesheet('saci-move1', 'assets/default/images/saci/saci1.png', 184, 253, 2);
            this.load.spritesheet('saci-move2', 'assets/default/images/saci/saci2.png', 184, 253, 2);
            this.load.spritesheet('saci-move3', 'assets/default/images/saci/saci3.png', 184, 253, 2);
            this.load.image('saci-wrong', 'assets/default/images/saci/saci-wrong.png');
            // musicas
            this.load.audio('main-dance', 'assets/states/main/audio/music1.mp3');
            // scenario
            this.load.image('main-bg', 'assets/states/main/images/scenario/bg.png');
            // intro
            this.load.image('intro-jam', 'assets/states/intro/images/jam.png');
            this.load.image('intro-phaser', 'assets/states/intro/images/phaser.png');
            this.load.image('intro-henrique', 'assets/states/intro/images/henrique.png');
            this.load.image('intro-andrezito', 'assets/states/intro/images/andrezito.png');
            this.load.image('intro-magrao', 'assets/states/intro/images/magrao.png');
            this.load.audio('intro-audiobg', 'assets/states/intro/audio/bg-cut.mp3');
            this.load.image('intro-btn', 'assets/states/intro/images/btniniciar.png');
            this.load.image('intro-gamelogo', 'assets/states/intro/images/gamelogo.png');
            this.load.image('intro-audience', 'assets/states/intro/images/plateia.png');
            this.load.image('intro-luz', 'assets/states/intro/images/luz.png');
            this.load.image('intro-saci', 'assets/states/intro/images/saci.png');
            // endgame
            this.load.image('endgame-btn', 'assets/states/main/images/endgame/jogarnovamente.png');
            // sfx
            this.load.audio('sfx-step', 'assets/default/audio/ziclick.mp3');
            this.load.audio('sfx-step-fail', 'assets/default/audio/wrongstep.wav');
            this.load.audio('sfx-endgame-lose', 'assets/default/audio/endgame-lose.wav');
            this.load.audio('sfx-audience-boo', 'assets/default/audio/boo.wav');
            this.load.audio('sfx-audience-wow', 'assets/default/audio/roaringcrowd.mp3');
            // this.load.image('cinematic-bg', 'assets/states/intro/images/cinematic-bg.jpg');
            // this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            // this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/iddle.png', 158, 263, 12);
        };
        Loader.prototype.create = function () {
            _super.prototype.create.call(this);
        };
        return Loader;
    }(Pk.PkLoader));
    GameBase.Loader = Loader;
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Presentation;
    (function (Presentation_1) {
        var Presentation = (function (_super) {
            __extends(Presentation, _super);
            function Presentation(game) {
                var _this = _super.call(this, game) || this;
                _this.timee = 50; // ms
                _this.gameOver = false;
                _this.firstNote = true;
                return _this;
            }
            Presentation.prototype.create = function () {
                var _this = this;
                // cria as coisas
                this.controller.create();
                this.audience.create();
                this.likometer.create();
                this.timeBar.create();
                this.score.create();
                this.level.create();
                this.sfxEndGameLose = this.game.add.sound('sfx-endgame-lose');
                // eventos
                // sempre que termina a contagem de tempo
                this.timeBar.event.add(GameBase.Bar.E.TimeEvent.OnEndCount, function () {
                    _this.endTimeBar();
                }, this);
                this.likometer.event.add(GameBase.Bar.E.LikometerEvent.OnOver, function () {
                    _this.endGame(false);
                }, this);
                // sempre que o pack acabar...
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, function (e, hit, originalPackSize) {
                    console.log('END PACK');
                    if (!_this.gameOver)
                        _this.endPack(hit, originalPackSize);
                    //
                }, this);
                // sempre que o pack iniciar 
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, function (e, hit, originalPackSize) {
                    var time = 116 - (_this.level.level * 15);
                    time = time < 50 ? 50 : time;
                    if (!_this.gameOver)
                        _this.timeBar.startCount(time);
                    //
                }, this);
                // sempre que acabar os packs do controller
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndAllPacks, function (e, hit, originalPackSize) {
                    console.log('TERMINOU TODOS OS PACK', hit, originalPackSize);
                    setTimeout(function () {
                        if (!_this.gameOver)
                            _this.playNextLevel(hit, originalPackSize);
                        //
                    }, 800);
                }, this);
                this.audience.pulse();
                this.updatePosition();
            };
            Presentation.prototype.start = function (level) {
                // seta o level
                this.level.setLevel(level);
                this.score.setValue(0);
                this.likometer.setValue(80);
                this.gameOver = false;
                // reseta / para o tempo
                this.timeBar.stopCount();
                // add umas notinhas
                this.prepare();
                // começa a colocar os steps
                this.controller.playNext();
            };
            Presentation.prototype.prepare = function () {
                // a cada level, vai diminuindo os packs
                var totalPacks = 10 - (this.level.level * 2);
                totalPacks = totalPacks < 1 ? 1 : totalPacks;
                // quanto maior o level, maior a quantidade de notas
                var totalStepInterval = [2 + this.level.level, 4 + this.level.level];
                // gera uma serie de packs
                for (var i = 0; i < totalPacks; i++)
                    this.controller.addStepPack(GameBase.Step.StepPack.generateStepPack(this.game, this.game.rnd.integerInRange(totalStepInterval[0], totalStepInterval[1])));
                //
            };
            Presentation.prototype.playNextLevel = function (hit, originalPackSize) {
                if (this.level.level == 12 && hit) {
                    this.endGame(true);
                    return;
                }
                // almenta a dificuldade, se acertou
                if (hit)
                    this.level.setLevel(this.level.level + 1);
                //
                // add umas notinhas
                this.prepare();
                // toca
                this.controller.playNext();
            };
            Presentation.prototype.endTimeBar = function () {
                // se tiver alguma nota, erra remove contagem
                this.likometer.removeValue(25);
                // força o erro
                this.controller.killStep(false);
            };
            Presentation.prototype.endPack = function (hit, originalPackSize) {
                var _this = this;
                // se fechou, calcula a grana
                if (hit) {
                    var scoreVal = this.timeBar.value * originalPackSize;
                    scoreVal /= 8;
                    scoreVal = Math.floor(scoreVal * 0.1);
                    // da um bonus por level
                    scoreVal += 2 * this.level.level;
                    scoreVal = scoreVal < 2 ? 2 : scoreVal;
                    this.score.addValue(scoreVal);
                }
                else {
                    // quanto mais facil, mais dinheiro perde
                    var scoreVal = this.timeBar.value / originalPackSize;
                    scoreVal = Math.floor(scoreVal * 0.1);
                    scoreVal = scoreVal < 10 ? 10 : scoreVal;
                    this.score.removeValue(scoreVal);
                }
                // re-inicia o tempo
                this.timeBar.startCount(100);
                // espera um pouquinho
                setTimeout(function () {
                    // this.resetPacks();
                    _this.controller.playNext();
                    _this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnChangeStepPack, _this.controller.currentPack);
                }, 500);
            };
            Presentation.prototype.pressStep = function (direction) {
                // se não tem stepPack, ignora
                if (!this.controller.currentPack || this.gameOver) {
                    console.log('-- IGNORA CLICK');
                    return;
                }
                // se apertou a direção certa
                if (this.controller.playDirection(direction)) {
                    this.likometer.addValue(1);
                    this.controller.killStep(true);
                }
                else {
                    this.likometer.removeValue(30);
                    this.controller.killStep(false);
                    this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnMissStep);
                }
                // se for a primeira nota, toca eventos
                if (this.firstNote) {
                    this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnFirstNote);
                    this.firstNote = false;
                }
            };
            Presentation.prototype.updatePosition = function () {
                // posiciona as coisas
                this.controller.x = this.game.world.centerX - this.controller.width / 2;
                this.controller.y = 30;
                this.likometer.y += 80;
                this.likometer.x = this.game.world.width - this.likometer.backSprite.width - 20;
                this.timeBar.x = this.controller.x + this.controller.width;
                this.timeBar.y = this.controller.y + 27;
                // this.score.x += 20;
                this.score.y += 20;
                this.level.y = this.score.y + this.score.height + 30;
            };
            Presentation.prototype.endGame = function (win) {
                if (win === void 0) { win = false; }
                this.gameOver = true;
                // para o tempo
                this.timeBar.stopCount();
                /*
                if(win)
                {
                    alert("GANHOUUU...\nScore: [Temers: "+this.score.value+']\nRecarregue para tentar novamente!(vai ser rápido, está cacheado ;) ');
                }else{
                    
                    this.sfxEndGameLose.play();
                    alert("ERRRROUU...\nScore: [Temers: "+this.score.value+']\nRecarregue para tentar novamente!(vai ser rápido, está cacheado ;) ');
                }
                */
                this.event.dispatch(GameBase.Presentation.E.PresentationEvent.OnEndGame, win);
                // this.restart();
            };
            Presentation.prototype.restart = function () {
                // volta pro level 1
                this.start(1);
            };
            return Presentation;
        }(Pk.PkElement));
        Presentation_1.Presentation = Presentation;
        var E;
        (function (E) {
            var PresentationEvent;
            (function (PresentationEvent) {
                PresentationEvent.OnFirstNote = "OnPresentationEventFirstNote";
                PresentationEvent.OnEndGame = "PresentationOnEndGame";
                PresentationEvent.OnChangeStepPack = "OnPresentationChangeStepPack";
                PresentationEvent.OnMissStep = "PresentationOnMissStep";
            })(PresentationEvent = E.PresentationEvent || (E.PresentationEvent = {}));
        })(E = Presentation_1.E || (Presentation_1.E = {}));
    })(Presentation = GameBase.Presentation || (GameBase.Presentation = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Audience;
    (function (Audience_1) {
        var Audience = (function (_super) {
            __extends(Audience, _super);
            function Audience(game) {
                return _super.call(this, game) || this;
            }
            Audience.prototype.create = function () {
                // add os sprites da lateral, nas laterais. ORA BOLAS...
                this.leftSprite = this.game.add.sprite(0, 0, 'aud-left');
                this.rightSprite = this.game.add.sprite(0, 0, 'aud-right');
                this.leftSprite.x = 0;
                this.leftSprite.y = this.game.world.height - this.leftSprite.height;
                this.rightSprite.x = this.game.world.width - this.rightSprite.width;
                this.rightSprite.y = this.game.world.height - this.rightSprite.height;
                // a parte do meio
                this.middleTileSprite = this.game.add.tileSprite(0, 0, this.game.world.width, 100, 'aud-middle');
                this.middleTileSprite.y = this.game.world.height - this.middleTileSprite.height;
                console.log('---- foi');
                this.add(this.rightSprite);
                this.add(this.leftSprite);
                this.add(this.middleTileSprite);
            };
            Audience.prototype.pulse = function () {
                // se houver alguma animação, pausa
                if (this.tween)
                    this.tween.stop(true);
                //
                this.tween = this.addTween(this).to({
                    y: this.y + 10
                }, 200, Phaser.Easing.Linear.None, true, 0, -1);
                this.tween.yoyo(true);
                console.log('AUDIENCE PULSE');
            };
            return Audience;
        }(Pk.PkElement));
        Audience_1.Audience = Audience;
    })(Audience = GameBase.Audience || (GameBase.Audience = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Bar;
    (function (Bar) {
        var Vertical = (function (_super) {
            __extends(Vertical, _super);
            function Vertical(game, backSprite, barSprite, borderSprite) {
                var _this = _super.call(this, game) || this;
                _this.value = 100;
                _this.backSprite = backSprite;
                _this.barSprite = barSprite;
                _this.borderSprite = borderSprite;
                return _this;
            }
            Vertical.prototype.create = function () {
                // cria uma mascara do tamanho da barra
                this.maskGraph = this.game.add.graphics(0, 0);
                this.maskGraph.beginFill(0xffffff);
                this.maskGraph.lineStyle(1, 0xffd900, 1);
                console.log('this.borderSprite.width:', this.borderSprite.width);
                console.log('this.borderSprite.height:', this.borderSprite.height);
                this.maskGraph.drawRect(0, 0, this.borderSprite.width, this.borderSprite.height);
                this.maskGraph.endFill();
                // this.mask = this.maskGraph;
                this.barSprite.mask = this.maskGraph;
                // usa o tamanho da mascara como tamanho 100%
                this.maxSize = this.borderSprite.height;
                // this.barSprite.y += 100
                this.add(this.backSprite);
                this.add(this.barSprite);
                this.add(this.borderSprite);
                this.add(this.maskGraph);
            };
            Vertical.prototype.addValue = function (value) {
                this.value += value;
                this.value = this.value > 100 ? 100 : this.value;
                this.processValue();
            };
            Vertical.prototype.removeValue = function (value) {
                this.value -= value;
                this.value = this.value < 0 ? 0 : this.value;
                this.processValue();
            };
            Vertical.prototype.setValue = function (value) {
                this.value = value;
                this.value = this.value < 0 ? 0 : this.value;
                this.value = this.value > 100 ? 100 : this.value;
                this.processValue();
            };
            Vertical.prototype.getValue = function () {
                return this.value;
            };
            Vertical.prototype.processValue = function (time) {
                if (time === void 0) { time = 500; }
                var x = this.value * 0.01;
                var v = this.maxSize - (x * this.maxSize); // - this.maxSize;
                // se houver alguma animação, pausa
                if (this.tween)
                    this.tween.stop(true);
                //
                this.tween = this.addTween(this.barSprite).to({
                    y: v
                }, time, Phaser.Easing.Back.Out, true);
            };
            return Vertical;
        }(Pk.PkElement));
        Bar.Vertical = Vertical;
    })(Bar = GameBase.Bar || (GameBase.Bar = {}));
})(GameBase || (GameBase = {}));
/// <reference path='Vertical.ts' />
var GameBase;
(function (GameBase) {
    var Bar;
    (function (Bar) {
        var Likometer = (function (_super) {
            __extends(Likometer, _super);
            function Likometer(game, backSprite, barSprite, borderSprite) {
                return _super.call(this, game, backSprite, barSprite, borderSprite) || this;
            }
            Likometer.prototype.create = function () {
                // cria uma mascara do tamanho da barra
                this.maskGraph = this.game.add.graphics(0, 0);
                this.maskGraph.beginFill(0xffffff);
                this.maskGraph.lineStyle(1, 0xffd900, 1);
                console.log('this.borderSprite.width:', this.borderSprite.width);
                console.log('this.borderSprite.height:', this.borderSprite.height);
                this.maskGraph.drawRect(0, 0, this.borderSprite.width, this.borderSprite.height - 7);
                this.maskGraph.endFill();
                // this.mask = this.maskGraph;
                this.barSprite.mask = this.maskGraph;
                // usa o tamanho da mascara como tamanho 100%
                this.maxSize = this.borderSprite.height;
                // this.barSprite.y += 100
                this.add(this.backSprite);
                this.add(this.barSprite);
                this.add(this.borderSprite);
                this.add(this.maskGraph);
                this.smile = this.game.add.sprite(0, 0, 'likebar-smile');
                this.sad = this.game.add.sprite(0, 0, 'likebar-sad');
                // coloca acime a abaixo da barra
                var padding = 10;
                this.smile.y -= this.smile.height + padding;
                this.sad.y += this.borderSprite.height + padding;
                this.smile.anchor.x = this.sad.anchor.x = 0.5;
                this.sad.x = this.smile.x = this.borderSprite.width / 2;
                this.sfxBoo = this.game.add.sound('sfx-audience-boo');
                this.sfxWow = this.game.add.sound('sfx-audience-wow');
                this.add(this.smile);
                this.add(this.sad);
            };
            Likometer.prototype.addValue = function (value) {
                _super.prototype.addValue.call(this, value);
            };
            Likometer.prototype.removeValue = function (value) {
                _super.prototype.removeValue.call(this, value);
                // se der zero, dispara o evento
                if (this.value == 0)
                    this.event.dispatch(GameBase.Bar.E.LikometerEvent.OnOver);
                //
            };
            Likometer.prototype.setValue = function (value) {
                _super.prototype.setValue.call(this, value);
            };
            Likometer.prototype.wow = function () {
                this.game.add.tween(this.smile).from({
                    y: this.smile.y - 10
                }, 150, Phaser.Easing.Linear.None, true, 0, 5).yoyo(true).onComplete.add(function () {
                }, this);
                this.sfxWow.play();
            };
            Likometer.prototype.boo = function () {
                this.game.add.tween(this.sad).from({
                    y: this.sad.y - 10
                }, 150, Phaser.Easing.Linear.None, true, 0, 5).yoyo(true).onComplete.add(function () {
                }, this);
                this.sfxBoo.play();
            };
            Likometer.prototype.processValue = function (time) {
                if (time === void 0) { time = 500; }
                _super.prototype.processValue.call(this, time);
                if (this.value >= 100 && this.lastValue != 100)
                    this.wow();
                //
                if (this.value <= 30 && this.lastValue > 30)
                    this.boo();
                // 
                this.lastValue = this.value;
            };
            return Likometer;
        }(Bar.Vertical));
        Bar.Likometer = Likometer;
        var E;
        (function (E) {
            var LikometerEvent;
            (function (LikometerEvent) {
                LikometerEvent.OnOver = "LikometerEventOnOver";
            })(LikometerEvent = E.LikometerEvent || (E.LikometerEvent = {}));
        })(E = Bar.E || (Bar.E = {}));
    })(Bar = GameBase.Bar || (GameBase.Bar = {}));
})(GameBase || (GameBase = {}));
/// <reference path='Vertical.ts' />
var GameBase;
(function (GameBase) {
    var Bar;
    (function (Bar) {
        var Time = (function (_super) {
            __extends(Time, _super);
            function Time(game) {
                var _this = this;
                var bar = game.add.sprite(0, 0, 'time-bar');
                var back = Pk.PkUtils.createSquare(game, bar.width, bar.height);
                var border = Pk.PkUtils.createSquare(game, bar.width, bar.height);
                back.visible = border.visible = false;
                _this = _super.call(this, game, back, bar, border) || this;
                return _this;
            }
            Time.prototype.create = function () {
                _super.prototype.create.call(this);
                this.clock = this.game.add.sprite(0, 0, 'time-clock');
                this.add(this.clock);
                this.clock.anchor.x = 0.5;
                this.clock.x += this.barSprite.width / 2;
                this.clock.y -= this.clock.height;
                // this.barSprite.mask = null;
                // this.angle = 180;
            };
            Time.prototype.startCount = function (interval) {
                var _this = this;
                if (interval === void 0) { interval = 1000; }
                this.interval = interval;
                this.value = 100;
                // se houver alguma outra contagem, pausa
                if (this.intervalId)
                    clearInterval(this.intervalId);
                //
                this.intervalId = setInterval(function () {
                    _this.removeValue(1);
                }, this.interval);
            };
            Time.prototype.stopCount = function () {
                console.log('stopCount--');
                if (this.intervalId)
                    clearInterval(this.intervalId);
                //
                this.setValue(100);
            };
            Time.prototype.processValue = function (time) {
                if (time === void 0) { time = 500; }
                var x = this.value * 0.01;
                var v = this.maxSize - (x * this.maxSize); // - this.maxSize;
                v *= -1; // sobe invertico
                // não precisa animar
                // se houver alguma a  nimação, pausa
                if (this.tween)
                    this.tween.stop(true);
                //
                this.tween = this.addTween(this.barSprite).to({
                    y: v
                }, time, Phaser.Easing.Back.Out, true);
                if (this.value == 0) {
                    clearInterval(this.intervalId);
                    this.event.dispatch(GameBase.Bar.E.TimeEvent.OnEndCount);
                }
                //
            };
            return Time;
        }(Bar.Vertical));
        Bar.Time = Time;
        var E;
        (function (E) {
            var TimeEvent;
            (function (TimeEvent) {
                TimeEvent.OnEndCount = "TimeEventOnEndCount";
            })(TimeEvent = E.TimeEvent || (E.TimeEvent = {}));
        })(E = Bar.E || (Bar.E = {}));
    })(Bar = GameBase.Bar || (GameBase.Bar = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Level;
    (function (Level_1) {
        var Level = (function (_super) {
            __extends(Level, _super);
            function Level(game) {
                var _this = _super.call(this, game) || this;
                _this.level = 1;
                return _this;
            }
            Level.prototype.create = function () {
                this.text = this.game.add.text(0, 0, "", // text
                {
                    font: "28px Love Story Rough",
                    fill: "#fff"
                } // font style
                );
                this.text.padding.x = 10;
                this.bg = this.game.add.sprite(0, 0, 'level-bg');
                this.bg.alpha = 0.7;
                this.text.text = "";
                // this.text.textBounds.
                // this.text.width += 100;
                // this.text.x = this.bg.width;
                // this.text.y = this.bg.height / 2 - 10;
                this.text.setShadow(2, 2, '#53514b', 1);
                this.text.x += 20;
                this.text.anchor.y = 0.5;
                this.text.y = (this.bg.height / 2);
                this.text.y += 5;
                this.add(this.bg);
                this.add(this.text);
                this.addTween(this).from({
                    x: this.x - this.width
                }, 400, Phaser.Easing.Back.Out, true, 200);
                this.processLevel();
            };
            Level.prototype.setLevel = function (level) {
                if (!this.originalX)
                    this.originalX = this.x;
                //
                this.level = level < 1 ? 1 : level;
                this.processLevel();
            };
            Level.prototype.reset = function () {
                this.level = 1;
                this.processLevel();
            };
            Level.prototype.processLevel = function () {
                this.text.text = 'Nivel  ' + this.level + ' / 12';
                // faz uma animaçãozinha basica
                this.x = this.originalX;
                var t = this.addTween(this).from({
                    x: this.x - 20
                }, 200, Phaser.Easing.Back.Out, true, 0, 0);
                t.yoyo(true);
            };
            return Level;
        }(Pk.PkElement));
        Level_1.Level = Level;
    })(Level = GameBase.Level || (GameBase.Level = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Saci;
    (function (Saci) {
        var Move = (function (_super) {
            __extends(Move, _super);
            function Move(game, spriteKey) {
                var _this = _super.call(this, game) || this;
                _this.fps = 4;
                _this.loop = true;
                _this.spriteKey = spriteKey;
                return _this;
            }
            Move.prototype.create = function () {
                this.spriteBase = this.game.add.sprite(0, 0, this.spriteKey);
                this.animation = this.spriteBase.animations.add('dance');
                this.add(this.spriteBase);
            };
            Move.prototype.play = function () {
                this.spriteBase.visible = true;
                this.animation.play(this.fps, this.loop);
            };
            Move.prototype.stop = function (hide) {
                if (hide === void 0) { hide = true; }
                this.spriteBase.visible = !hide;
                this.animation.stop();
            };
            return Move;
        }(Pk.PkElement));
        Saci.Move = Move;
    })(Saci = GameBase.Saci || (GameBase.Saci = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Saci;
    (function (Saci_1) {
        var Saci = (function (_super) {
            __extends(Saci, _super);
            function Saci(game) {
                var _this = _super.call(this, game) || this;
                _this.moves = [];
                return _this;
            }
            Saci.prototype.create = function () {
                var _this = this;
                this.moves.forEach(function (move) {
                    move.create();
                    move.stop();
                    _this.add(move);
                });
                this.wrong = this.game.add.sprite(0, 0, 'saci-wrong');
                this.wrong.visible = false;
                this.wrong.anchor.set(0.5, 0.5);
                this.wrong.x = (this.wrong.width / 2) - 30;
                this.wrong.y = (this.wrong.height / 2) + 65;
                this.add(this.wrong);
            };
            Saci.prototype.addMove = function (move) {
                this.moves.push(move);
            };
            Saci.prototype.wrongMove = function () {
                var _this = this;
                console.log('--- wrongMove 22');
                if (this.currentMove)
                    this.currentMove.visible = false;
                //
                this.wrong.visible = true;
                this.game.add.tween(this.wrong).to({
                    rotation: 1.1
                }, 150, Phaser.Easing.Linear.None, true, 0, 5).yoyo(true).onComplete.add(function () {
                    console.log('------ complete');
                    _this.wrong.visible = false;
                    _this.wrong.rotation = 1;
                }, this);
            };
            Saci.prototype.playNextMove = function () {
                if (!this.moves.length)
                    return;
                //
                this.wrong.visible = false;
                for (var i in this.moves) {
                    this.moves[i].stop();
                    if (this.currentMove == this.moves[i]) {
                        var index = parseInt(i);
                        if ((index + 1) == this.moves.length) {
                            this.currentMove = this.moves[0];
                            break;
                        }
                        else {
                            this.currentMove = this.moves[index + 1];
                            break;
                        }
                    }
                }
                if (!this.currentMove)
                    this.currentMove = this.moves[0];
                //
                this.currentMove.visible = true;
                this.currentMove.play();
            };
            return Saci;
        }(Pk.PkElement));
        Saci_1.Saci = Saci;
    })(Saci = GameBase.Saci || (GameBase.Saci = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Saci;
    (function (Saci) {
        var Move1 = (function (_super) {
            __extends(Move1, _super);
            function Move1(game) {
                return _super.call(this, game, 'saci-move1') || this;
            }
            Move1.prototype.create = function () {
                _super.prototype.create.call(this);
            };
            return Move1;
        }(Saci.Move));
        Saci.Move1 = Move1;
    })(Saci = GameBase.Saci || (GameBase.Saci = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Saci;
    (function (Saci) {
        var Move2 = (function (_super) {
            __extends(Move2, _super);
            function Move2(game) {
                return _super.call(this, game, 'saci-move2') || this;
            }
            Move2.prototype.create = function () {
                _super.prototype.create.call(this);
            };
            return Move2;
        }(Saci.Move));
        Saci.Move2 = Move2;
    })(Saci = GameBase.Saci || (GameBase.Saci = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Saci;
    (function (Saci) {
        var Move3 = (function (_super) {
            __extends(Move3, _super);
            function Move3(game) {
                return _super.call(this, game, 'saci-move3') || this;
            }
            Move3.prototype.create = function () {
                _super.prototype.create.call(this);
            };
            return Move3;
        }(Saci.Move));
        Saci.Move3 = Move3;
    })(Saci = GameBase.Saci || (GameBase.Saci = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Score;
    (function (Score_1) {
        var Score = (function (_super) {
            __extends(Score, _super);
            function Score(game) {
                var _this = _super.call(this, game) || this;
                _this.value = 0;
                return _this;
            }
            Score.prototype.create = function () {
                this.text = this.game.add.text(0, 0, "", // text
                {
                    font: "28px Love Story Rough",
                    fill: "#fff"
                } // font style
                );
                this.text.padding.x = 10;
                this.money = this.game.add.sprite(0, 0, 'score-money');
                this.bg = this.game.add.sprite(0, 0, 'level-bg');
                this.bg.alpha = 0.7;
                this.money.x = 10;
                this.text.text = "x " + this.value;
                // this.text.textBounds.
                // this.text.width += 100;
                this.text.x = this.money.x + this.money.width;
                this.text.y = this.money.height / 2 - 10;
                this.text.setShadow(2, 2, '#53514b', 1);
                this.text.anchor.y = 0.5;
                this.text.y = (this.bg.height / 2);
                this.text.y += 5;
                this.add(this.bg);
                this.add(this.money);
                this.add(this.text);
                this.addTween(this).from({
                    x: this.x - this.width
                }, 400, Phaser.Easing.Back.Out, true);
            };
            Score.prototype.addValue = function (value) {
                this.value += value;
                this.text.text = 'x ' + this.value;
            };
            Score.prototype.setValue = function (value) {
                this.value = value < 0 ? 0 : value;
                this.text.text = 'x ' + this.value;
            };
            Score.prototype.removeValue = function (value) {
                this.value -= value;
                this.value = this.value < 0 ? 0 : this.value;
                this.text.text = 'x ' + this.value;
                // se der zero, dispara o evento
                if (this.value == 0)
                    this.event.dispatch(GameBase.Score.E.ScoreEvent.OnOverScore);
                //
            };
            Score.prototype.reset = function () {
                this.value = 0;
                this.text.text = 'x ' + this.value;
            };
            return Score;
        }(Pk.PkElement));
        Score_1.Score = Score;
        var E;
        (function (E) {
            var ScoreEvent;
            (function (ScoreEvent) {
                ScoreEvent.OnOverScore = "ScoreEventOnOverScore";
            })(ScoreEvent = E.ScoreEvent || (E.ScoreEvent = {}));
        })(E = Score_1.E || (Score_1.E = {}));
    })(Score = GameBase.Score || (GameBase.Score = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Step;
    (function (Step) {
        var Base = (function (_super) {
            __extends(Base, _super);
            function Base(game) {
                return _super.call(this, game) || this;
            }
            Base.prototype.create = function () {
                console.log('creating BASE');
                this.back = this.game.add.sprite(0, 0, 'step-back');
                // this.back = Pk.PkUtils.createSquare(this.game, 60, 60);
                // this.back.alpha = 0.7;
                this.back.anchor.set(0.5, 0.5);
                this.back.x += this.back.width / 2;
                this.back.y += this.back.height / 2;
                this.game.add.tween(this.back.scale).to({
                    x: 1.1,
                    y: 1.1
                }, 300, Phaser.Easing.Linear.None, true, 0, -1).yoyo(true);
                this.add(this.back);
            };
            return Base;
        }(Pk.PkElement));
        Step.Base = Base;
    })(Step = GameBase.Step || (GameBase.Step = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Step;
    (function (Step) {
        var Controller = (function (_super) {
            __extends(Controller, _super);
            function Controller(game) {
                var _this = _super.call(this, game) || this;
                _this.stepPacks = [];
                _this.base = new GameBase.Step.Base(_this.game);
                _this.event = new Pk.PkEvent('controller-event', _this);
                return _this;
            }
            Controller.prototype.addStepPack = function (stepPack) {
                this.stepPacks.push(stepPack);
            };
            Controller.prototype.create = function () {
                this.base.create();
                this.add(this.base);
                // cria e add os packs
                /*
                for(var i in this.stepPacks)
                {
                    this.stepPacks[i].create();
                    this.add(this.stepPacks[i]);
                }
                */
                this.gmask = this.game.add.graphics(0, 0);
                this.gmask.beginFill(0x000000);
                this.gmask.drawRoundedRect(this.x - 150, this.y - 150, 400, 600, 10);
                this.gmask.endFill();
                // step size
                var stepSize = 50; //this.stepPacks.length ? this.stepPacks[0].steps[0].width : 50;
                // ajusta o tamanho pra ficar um pouco maior que o step~
                var basePadding = 15;
                // this.base.width = this.base.height = stepSize + basePadding;
                // centraliza a base
                this.base.x -= basePadding / 2;
                this.base.y -= basePadding / 2;
                this.base.x -= 6;
                this.base.y -= 10;
                this.stepSound = this.game.add.audio('sfx-step');
                this.stepSoundWrong = this.game.add.audio('sfx-step-fail');
                console.log('--- this.base:', this.base.alpha);
            };
            // toca o proximo pack
            Controller.prototype.playNext = function () {
                if (this.stepPacks.length) {
                    this.currentPack = this.stepPacks[0];
                    this.currentPack.create();
                    this.add(this.currentPack);
                    this.currentPack.show();
                    this.gmask.visible = true;
                    this.currentPack.mask = this.gmask;
                    this.event.dispatch(GameBase.Step.E.ControllerEvent.StartNext);
                    return true;
                }
                return false;
            };
            Controller.prototype.playDirection = function (direction) {
                // não tem pack, não tem nota
                if (!this.currentPack)
                    return false;
                //
                // se já acabou as notas do pack
                if (!this.currentPack.currentStep)
                    return false;
                //
                // se é a mesma
                var hit = this.currentPack.currentStep.direction == direction;
                if (hit) {
                    this.stepSound.volume = 3;
                    this.stepSound.play();
                }
                else {
                    this.stepSoundWrong.play();
                }
                return hit;
            };
            // remove o step do pack current
            Controller.prototype.killStep = function (hit) {
                // não tem pack, não tem nota
                if (!this.currentPack)
                    return false;
                //
                // se já acabou as notas do pack
                if (!this.currentPack.currentStep)
                    return false;
                //
                // remove a ultimo step
                this.currentPack.killStep(hit);
                // se esse pack não tiver mais steps OU errou
                if (!this.currentPack.steps.length || !hit) {
                    var lastPack = this.stepPacks.shift();
                    // this.currentPack.destroy();
                    // espera a ultima nota animar
                    setTimeout(function () {
                        lastPack.destroy();
                    }, 1500);
                    var originalPackSize = this.currentPack.originalPackSize;
                    // se ainda houver packs, seta o current para o proximo
                    if (this.stepPacks.length) {
                        this.currentPack = this.stepPacks[0];
                        this.stepPacks[0].show();
                        this.gmask.visible = true;
                        this.currentPack.mask = this.gmask;
                    }
                    else {
                        this.gmask.visible = false;
                        this.currentPack = null;
                    }
                    //    
                    // se errou, dispara o evento de fim de pack
                    this.event.dispatch(GameBase.Step.E.ControllerEvent.OnEndPack, hit, originalPackSize);
                    // se acabou o pack, dispara o evento de fim de pack
                    if (!this.currentPack)
                        this.event.dispatch(GameBase.Step.E.ControllerEvent.OnEndAllPacks, hit, originalPackSize);
                    //
                }
            };
            return Controller;
        }(Pk.PkElement));
        Step.Controller = Controller;
        var E;
        (function (E) {
            var ControllerEvent;
            (function (ControllerEvent) {
                ControllerEvent.OnEndPack = "OnControllerEventEndPack";
                ControllerEvent.StartNext = "OnControllerStartNext";
                ControllerEvent.OnEndAllPacks = "OnControllerOnEndAllPacks";
            })(ControllerEvent = E.ControllerEvent || (E.ControllerEvent = {}));
        })(E = Step.E || (Step.E = {}));
    })(Step = GameBase.Step || (GameBase.Step = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Step;
    (function (Step_1) {
        var Step = (function (_super) {
            __extends(Step, _super);
            function Step(game, direction) {
                var _this = _super.call(this, game) || this;
                _this.direction = direction;
                return _this;
            }
            Step.prototype.create = function () {
                var spriteName = 'step-';
                switch (this.direction) {
                    case GameBase.Step.Direction.DOWN:
                        spriteName += 'down';
                        break;
                    case GameBase.Step.Direction.LEFT:
                        spriteName += 'left';
                        break;
                    case GameBase.Step.Direction.TOP:
                        spriteName += 'top';
                        break;
                    case GameBase.Step.Direction.RIGHT:
                        spriteName += 'right';
                        break;
                }
                this.bg = this.game.add.sprite(0, 0, spriteName);
                this.add(this.bg);
            };
            Step.getRandomDirection = function () {
                var randomDirection;
                var game = Pk.PkGame.game;
                switch (game.rnd.integerInRange(1, 4)) {
                    case 1:
                        randomDirection = GameBase.Step.Direction.TOP;
                        break;
                    case 2:
                        randomDirection = GameBase.Step.Direction.DOWN;
                        break;
                    case 3:
                        randomDirection = GameBase.Step.Direction.LEFT;
                        break;
                    case 4:
                        randomDirection = GameBase.Step.Direction.RIGHT;
                        break;
                }
                return randomDirection;
            };
            Step.prototype.kill = function (hit) {
                var _this = this;
                var time = 300;
                // se acertou anima pra direção 
                if (hit) {
                    var x = 0;
                    var y = 0;
                    var distance = 100;
                    switch (this.direction) {
                        case GameBase.Step.Direction.TOP:
                            y -= distance;
                            break;
                        case GameBase.Step.Direction.DOWN:
                            y += distance;
                            break;
                        case GameBase.Step.Direction.LEFT:
                            x -= distance;
                            break;
                        case GameBase.Step.Direction.RIGHT:
                            x += distance;
                            break;
                    }
                    var tween = this.addTween(this).to({
                        alpha: 0,
                        y: y,
                        x: x
                    }, time, Phaser.Easing.Back.Out, true);
                    tween.onComplete.add(function () {
                        _this.destroy();
                    }, this);
                }
                else {
                    // centraliza
                    if (this.bg)
                        this.bg.anchor.set(0.5, 0.5);
                    // 
                    this.x += this.width / 2;
                    this.y += this.height / 2;
                    var tween = this.addTween(this).to({
                        rotation: 5,
                        width: this.width * 2,
                        height: this.height * 2,
                        alpha: 0
                    }, time, Phaser.Easing.Back.Out, true);
                    tween.onComplete.add(function () {
                        _this.destroy();
                    }, this);
                }
            };
            return Step;
        }(Pk.PkElement));
        Step_1.Step = Step;
        var Direction;
        (function (Direction) {
            Direction[Direction["TOP"] = 0] = "TOP";
            Direction[Direction["LEFT"] = 1] = "LEFT";
            Direction[Direction["DOWN"] = 2] = "DOWN";
            Direction[Direction["RIGHT"] = 3] = "RIGHT";
        })(Direction = Step_1.Direction || (Step_1.Direction = {}));
    })(Step = GameBase.Step || (GameBase.Step = {}));
})(GameBase || (GameBase = {}));
var GameBase;
(function (GameBase) {
    var Step;
    (function (Step) {
        var StepPack = (function (_super) {
            __extends(StepPack, _super);
            function StepPack(game) {
                var _this = _super.call(this, game) || this;
                _this.steps = [];
                _this.padding = 10;
                _this.hasPlay = false;
                _this.created = false;
                _this.originalPackSize = 0;
                _this.visible = false;
                return _this;
            }
            StepPack.prototype.addStep = function (step) {
                if (!this.currentStep)
                    this.currentStep = step;
                // 
                this.steps.push(step);
                this.originalPackSize = this.steps.length;
                this.add(step);
            };
            StepPack.prototype.create = function () {
                if (this.created)
                    return false;
                //
                this.created = true;
                // cria os passos, 
                for (var i in this.steps)
                    this.steps[i].create();
                //
                return true;
            };
            // posiciona as notas
            StepPack.prototype.show = function () {
                this.visible = true;
                this.updatePosition();
            };
            StepPack.prototype.updatePosition = function () {
                var _this = this;
                // reseta a posição de todo mundo
                this.steps.forEach(function (step) {
                    step.y = 0;
                });
                // (re)pos as "notas"
                var i = 0;
                this.steps.forEach(function (step) {
                    if (i > 0) {
                        // pega o ultimo 
                        var lastStep = _this.steps[i - 1];
                        // pos o atual abaixo do ultimo
                        step.y = lastStep.y + lastStep.height + _this.padding;
                    }
                    i++;
                });
            };
            StepPack.generateStepPack = function (game, steps) {
                if (steps === void 0) { steps = 5; }
                // cria um pack
                var stepPack = new GameBase.Step.StepPack(game);
                // add uns passos
                // var totalSteps:number = game.rnd.integerInRange(3, 10);
                var totalSteps = steps;
                for (var i = 0; i < totalSteps; i++)
                    stepPack.addStep(new GameBase.Step.Step(game, GameBase.Step.Step.getRandomDirection()));
                //
                return stepPack;
            };
            // remove o step do pack current
            StepPack.prototype.killStep = function (hit) {
                // se já acabou as notas do pack
                if (!this.currentStep)
                    return false;
                //
                // se errou, treme a camera mata todas as outras notas
                if (!hit) {
                    // da uma tremida na camera
                    this.game.camera.shake(0.01, 170);
                    this.steps.forEach(function (step) {
                        step.kill(hit);
                    });
                    this.steps = [];
                }
                else {
                    // mata só essa nota
                    var step = this.steps.shift();
                    step.kill(hit);
                }
                this.currentStep = this.steps.length ? this.steps[0] : null; // atualiza o atual
                this.updatePosition(); // atualiza posição
                return true;
            };
            return StepPack;
        }(Pk.PkElement));
        Step.StepPack = StepPack;
    })(Step = GameBase.Step || (GameBase.Step = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Intro = (function (_super) {
        __extends(Intro, _super);
        function Intro() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Intro.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.init.call(this, args); // if whant override init, you need this line!
        };
        Intro.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            // change state bg
            this.game.stage.backgroundColor = "#000";
            // prevent stop update when focus out
            this.stage.disableVisibilityChange = true;
            // audio
            this.musicBG = this.game.add.audio('intro-audiobg');
            this.musicBG.onDecoded.add(this.playSound, this); // load
            this.phaser = this.game.add.sprite(0, 0, 'intro-phaser');
            this.phaser.alpha = 0;
            this.phaser.anchor.set(.5, .5);
            this.phaser.x = this.game.world.centerX;
            this.phaser.y = this.game.world.centerY;
            this.jam = this.game.add.sprite(0, 0, 'intro-jam');
            this.jam.alpha = 0;
            this.jam.anchor.set(.5, .5);
            this.jam.x = this.game.world.centerX;
            this.jam.y = this.game.world.centerY;
            this.henrique = this.game.add.sprite(0, 0, 'intro-henrique');
            this.henrique.alpha = 0;
            this.henrique.anchor.set(.5, .5);
            this.henrique.x = this.game.world.centerX;
            this.henrique.y = this.game.world.centerY;
            this.andrezito = this.game.add.sprite(0, 0, 'intro-andrezito');
            this.andrezito.alpha = 0;
            this.andrezito.anchor.set(.5, .5);
            this.andrezito.x = this.game.world.centerX;
            this.andrezito.y = this.game.world.centerY;
            this.magrao = this.game.add.sprite(0, 0, 'intro-magrao');
            this.magrao.alpha = 0;
            this.magrao.anchor.set(.5, .5);
            this.magrao.x = this.game.world.centerX;
            this.magrao.y = this.game.world.centerY;
            // this.showIntro();
            // return;
            this.alphaInOut(this.phaser, function () {
                _this.alphaInOut(_this.jam, function () {
                    _this.game.add.tween(_this.henrique).to({
                        alpha: 1
                    }, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                        _this.game.add.tween(_this.magrao).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
                        _this.game.add.tween(_this.magrao).to({
                            y: _this.magrao.y + 150
                        }, 600, Phaser.Easing.Elastic.Out, true);
                        _this.game.add.tween(_this.andrezito).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
                        _this.game.add.tween(_this.andrezito).to({
                            y: _this.magrao.y - 150
                        }, 600, Phaser.Easing.Elastic.Out, true, 250).onComplete.add(function () {
                            setTimeout(function () {
                                _this.game.add.tween(_this.henrique).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
                                _this.game.add.tween(_this.magrao).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
                                _this.game.add.tween(_this.andrezito).to({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                                    _this.showIntro();
                                }, _this);
                            }, 3000);
                        }, _this);
                    }, _this);
                });
            });
        };
        Intro.prototype.showIntro = function () {
            var _this = this;
            var bg = Pk.PkUtils.createSquare(this.game, this.game.world.width, this.game.world.height, "#938da0");
            this.game.add.tween(bg).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
            var luz = this.game.add.sprite(0, 0, 'intro-luz');
            // this.game.add.tween(luz).from({alpha:0}, 200, Phaser.Easing.Linear.None, true);
            var logo = this.game.add.sprite(0, 0, 'intro-gamelogo');
            this.game.add.tween(logo).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
            var saci = this.game.add.sprite(0, 0, 'intro-saci');
            this.game.add.tween(saci).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
            var audience = this.game.add.sprite(0, 0, 'intro-audience');
            this.game.add.tween(audience).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
            var btn = this.game.add.sprite(0, 0, 'intro-btn');
            this.game.add.tween(btn).from({ alpha: 0 }, 200, Phaser.Easing.Linear.None, true);
            audience.anchor.y = 1;
            audience.y = this.game.world.height;
            logo.anchor.x = .5;
            logo.x = this.game.world.centerX;
            btn.anchor.x = .5;
            btn.x = this.game.world.centerX;
            btn.y = 550;
            saci.anchor.x = .5;
            saci.anchor.y = 1;
            saci.x = this.game.world.centerX;
            saci.y = 520;
            luz.y += 50;
            btn.inputEnabled = true;
            btn.input.useHandCursor = true;
            btn.events.onInputUp.add(function () {
                btn.inputEnabled = false;
                _this.transition.change('Main');
            }, this);
            /*
            this.game.add.tween(saci).to(
                {
                    rotation:saci.rotation + 0.1
                },
                200,
                Phaser.Easing.Linear.None,
                true, 0, -1
            ).yoyo(true);
            

            saci.x += 35;
            this.game.add.tween(saci).to(
                {
                    x:saci.x - 70
                },
                400,
                Phaser.Easing.Linear.None,
                true, 0, -1
            ).yoyo(true);
            */
            this.game.add.tween(saci).to({
                y: saci.y - 15
            }, 200, Phaser.Easing.Linear.None, true, 0, -1).yoyo(true);
            this.game.add.tween(luz).to({
                alpha: 0
            }, 100, Phaser.Easing.Exponential.Out, true, 0, -1).yoyo(true);
            this.game.add.tween(logo).from({
                y: logo.y - 100
            }, 1200, Phaser.Easing.Bounce.Out, true);
            this.game.add.tween(audience).to({
                y: audience.y + 10
            }, 200, Phaser.Easing.Linear.None, true, 0, -1).yoyo(true);
            /*
            btn.alpha = 0;
            logo.alpha = 0;
            audience.alpha = 0;
            luz.alpha = 0;
            saci.alpha = 0;
            */
        };
        Intro.prototype.alphaInOut = function (object, callBack) {
            var _this = this;
            var tween = this.game.add.tween(object).to({
                alpha: 1
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(function () {
                var tween = _this.game.add.tween(object).to({
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true, 3000);
                tween.onComplete.add(function () {
                    callBack();
                }, _this);
            }, this);
        };
        Intro.prototype.playSound = function () {
            // play music
            this.musicBG.volume = 0.6;
            this.musicBG.fadeIn(600, true);
            // this.musicBG.play('', 0, 0.6, true);
        };
        // calls when leaving state
        Intro.prototype.shutdown = function () {
            if (this.musicBG.isPlaying)
                this.musicBG.stop();
            //
        };
        return Intro;
    }(Pk.PkState));
    GameBase.Intro = Intro;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.timee = 50; // ms
            return _this;
        }
        Main.prototype.init = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _super.prototype.init.call(this, args); // if whant override init, you need this line!
        };
        Main.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            // change state bg
            this.game.stage.backgroundColor = "#938da0";
            // prevent stop update when focus out
            this.stage.disableVisibilityChange = true;
            var scenarioBg = this.game.add.sprite(0, 0, 'main-bg');
            scenarioBg.y -= 67;
            // cria a apresentação E add os componentes
            this.presentation = new GameBase.Presentation.Presentation(this.game);
            this.presentation.controller = new GameBase.Step.Controller(this.game);
            this.presentation.audience = new GameBase.Audience.Audience(this.game);
            this.presentation.level = new GameBase.Level.Level(this.game);
            this.presentation.likometer = new GameBase.Bar.Likometer(this.game, this.game.add.sprite(0, 0, 'likebar-back'), this.game.add.sprite(0, 0, 'likebar-bar'), this.game.add.sprite(0, 0, 'likebar-border'));
            this.presentation.timeBar = new GameBase.Bar.Time(this.game);
            this.presentation.score = new GameBase.Score.Score(this.game);
            this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () {
                _this.presentation.pressStep(GameBase.Step.Direction.DOWN);
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () {
                _this.presentation.pressStep(GameBase.Step.Direction.TOP);
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () {
                _this.presentation.pressStep(GameBase.Step.Direction.LEFT);
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () {
                _this.presentation.pressStep(GameBase.Step.Direction.RIGHT);
            }, this);
            // bla
            // this.likometer.setValue(80);
            // this.time.startCount(this.timee); // ms
            this.presentation.create();
            this.presentation.start(1);
            this.saci = new GameBase.Saci.Saci(this.game);
            this.saci.addMove(new GameBase.Saci.Move1(this.game));
            this.saci.addMove(new GameBase.Saci.Move2(this.game));
            this.saci.addMove(new GameBase.Saci.Move3(this.game));
            this.saci.addMove(new GameBase.Saci.Move2(this.game));
            this.saci.create();
            this.saci.x = this.game.world.centerX - 80;
            this.saci.y += 300;
            // coloca ele paradinho com a bunda kk
            this.saci.moves[0].spriteBase.visible = true;
            // quando tocar a primeira nota, começa a dançar
            this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnFirstNote, function () {
                console.log('FIRST NOTE');
                _this.saci.playNextMove();
                /*
                setInterval(()=>{
                    saci.playNextMove();
                }, 3000)
                */
            }, this);
            this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnChangeStepPack, function () {
                console.log('CHANGE PACK');
                _this.saci.playNextMove();
            }, this);
            this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnMissStep, function () {
                console.log('--- wrongMove');
                _this.saci.wrongMove();
            }, this);
            this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnEndGame, function (e, win) {
                console.log('win::', win);
                if (win) {
                    _this.endGameTextDescription.text = "Você ganhou. Quem diria!\n         Dinheiros: " + _this.presentation.score.value;
                }
                else {
                    _this.endGameTextDescription.text = "Você perdeu. Poxa vida...\n          Dinheiros: " + _this.presentation.score.value;
                }
                _this.endgameScree.visible = true;
            }, this);
            // audio
            this.musicBG = this.game.add.audio('main-dance');
            this.musicBG.onDecoded.add(this.playSound, this); // load
            // bg bg! // same world size
            this.bg = Pk.PkUtils.createSquare(this.game, this.game.world.width, this.game.world.height, "#000");
            this.bg.alpha = .95;
            this.endGameTextTitle = this.game.add.text(0, 0, "Fim de Jogo", // text
            {
                font: "58px Love Story Rough",
                fill: "#c8c8c8"
            } // font style
            );
            this.endGameTextDescription = this.game.add.text(0, 0, "Você ganhou. Quem diria!\n         Dinheiros: 134", // text
            {
                font: "36px Love Story Rough",
                fill: "#c8c8c8",
                boundsAlignH: "center",
                boundsAlignV: "middle"
            } // font style
            );
            this.endGameTextDescription.anchor.x = this.endGameTextTitle.anchor.x = 0.5;
            this.endGameTextTitle.x = this.endGameTextDescription.x = this.game.world.centerX;
            this.endGameTextTitle.y = 100;
            this.endGameTextDescription.y = 200;
            this.endBtn = this.game.add.sprite(0, 0, 'endgame-btn');
            this.endBtn.inputEnabled = true;
            this.endBtn.input.useHandCursor = true;
            this.endBtn.anchor.x = .5;
            this.endBtn.x = this.game.world.centerX;
            this.endBtn.y = 300;
            this.endBtn.events.onInputUp.add(function () {
                // this.transition.change('Main');
                _this.playAgain();
            }, this);
            this.endgameScree = new Pk.PkElement(this.game);
            this.endgameScree.add(this.bg);
            this.endgameScree.add(this.endBtn);
            this.endgameScree.add(this.endGameTextTitle);
            this.endgameScree.add(this.endGameTextDescription);
            this.endgameScree.visible = false;
        };
        Main.prototype.playSound = function () {
            // play music
            this.musicBG.fadeIn(1000, true);
            // this.musicBG.play('', 0, 1, true);
        };
        Main.prototype.playAgain = function () {
            this.endgameScree.visible = false;
            this.saci.playNextMove();
            this.presentation.restart();
        };
        /*
        resetPacks()
        {
            // add outro pack
            this.controller.addStepPack(this.generateStepPack());

            // espera um pouquinho antes de começar o proximo pack
            setTimeout(()=>{
                // começa a contagem
                this.time.startCount(this.timee);

                // toca
                this.controller.playNext();
            }, 2000)
        }
        */
        Main.prototype.render = function () {
            // this.game.debug.text('LEVEL ' + this.presentation.level, this.game.world.centerX, 35);
        };
        // calls when leaving state
        Main.prototype.shutdown = function () {
        };
        return Main;
    }(Pk.PkState));
    GameBase.Main = Main;
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Transitions;
    (function (Transitions) {
        var Alpha = (function () {
            function Alpha(game) {
                this.event = new Pk.PkEvent('Transitions.Alpha', this);
                this.changeTime = 500; // ms
                this.game = game;
            }
            Alpha.prototype.start = function () {
                var _this = this;
                // create a full screen black retangle alpha 0
                this.retangle = Pk.PkUtils.createSquare(this.game, this.game.camera.width, this.game.camera.height, "#000000");
                this.retangle.alpha = 0;
                // create a tween animation
                // tween samples: http://phaser.io/examples/v2/category/tweens
                var t = this.game.add.tween(this.retangle).to({ alpha: 1 }, this.changeTime, "Linear");
                t.onComplete.add(function () {
                    // dispatch end transition | mandatory
                    _this.event.dispatch(Pk.E.OnTransitionEndStart);
                }, this);
                t.start(); // play tween
            };
            Alpha.prototype.end = function () {
                var _this = this;
                // create a full screen black retangle alpha 1. Revert previous transition
                var retangle = Pk.PkUtils.createSquare(this.game, this.game.camera.width, this.game.camera.height, "#000000");
                // create a tween animation
                // tween samples: http://phaser.io/examples/v2/category/tweens
                var t = this.game.add.tween(retangle).to({ alpha: 0 }, this.changeTime, "Linear");
                t.onComplete.add(function () {
                    // dispatch end transition | mandatory
                    _this.event.dispatch(Pk.E.OnTransitionEndEnd);
                }, this);
                t.start(); // play tween
            };
            return Alpha;
        }());
        Transitions.Alpha = Alpha;
    })(Transitions = GameBase.Transitions || (GameBase.Transitions = {}));
})(GameBase || (GameBase = {}));
/// <reference path='../../pkframe/refs.ts' />
var GameBase;
(function (GameBase) {
    var Transitions;
    (function (Transitions) {
        var Slide = (function () {
            function Slide(game) {
                this.event = new Pk.PkEvent('Transitions.Slide', this);
                this.changeTime = 500; // ms
                this.game = game;
            }
            Slide.prototype.start = function () {
                // create bg
                var poly = new Phaser.Polygon();
                poly.setTo([
                    new Phaser.Point((this.game.world.width / 2) * (-1), 0),
                    new Phaser.Point(this.game.world.width, 0),
                    new Phaser.Point(this.game.world.width, this.game.world.height),
                    new Phaser.Point(0, this.game.world.height) // 3
                ]);
                var bg = this.game.add.graphics(0, 0);
                bg.beginFill(0x000000);
                bg.drawPolygon(poly.points);
                bg.endFill();
                bg.x = bg.width;
                var slideTween = this.game.add.tween(bg);
                slideTween.to({
                    x: 0
                }, this.changeTime);
                slideTween.onComplete.add(function (obj) {
                    // dispatch end transition | mandatory
                    this.event.dispatch(Pk.E.OnTransitionEndStart);
                }, this);
                slideTween.start();
            };
            Slide.prototype.end = function () {
                // create bg
                var poly = new Phaser.Polygon();
                poly.setTo([
                    new Phaser.Point(0, 0),
                    new Phaser.Point(this.game.world.width, 0),
                    new Phaser.Point(this.game.world.width + (this.game.world.width / 2), this.game.world.height),
                    new Phaser.Point(0, this.game.world.height) // 3
                ]);
                var bg = this.game.add.graphics(0, 0);
                bg.beginFill(0x000000);
                bg.drawPolygon(poly.points);
                bg.endFill();
                // bg.width; // phaser
                var slideTween = this.game.add.tween(bg);
                slideTween.to({
                    x: bg.width * (-1)
                }, this.changeTime);
                slideTween.onComplete.add(function (obj) {
                    // dispatch end transition | mandatory
                    console.log('terminou animação');
                    this.event.dispatch(Pk.E.OnTransitionEndEnd);
                }, this);
                slideTween.start();
            };
            return Slide;
        }());
        Transitions.Slide = Slide;
    })(Transitions = GameBase.Transitions || (GameBase.Transitions = {}));
})(GameBase || (GameBase = {}));
var Pk;
(function (Pk) {
    var PkLayer = (function (_super) {
        __extends(PkLayer, _super);
        function PkLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.distance = 1; // use for parallax effect
            return _this;
        }
        return PkLayer;
    }(Pk.PkElement));
    Pk.PkLayer = PkLayer;
})(Pk || (Pk = {}));
/// <reference path='../event/PkEvent.ts' />
/// <reference path='../PkGame.ts' />
/// <reference path='PkLayer.ts' />
var Pk;
(function (Pk) {
    var PkParallax = (function () {
        function PkParallax(state) {
            this.layers = [];
            this.state = state;
        }
        PkParallax.prototype.add = function (element, distance, cameraLock) {
            if (cameraLock === void 0) { cameraLock = true; }
            // if using TileSprite, distance is mandatary
            if (element instanceof Phaser.TileSprite && !distance)
                throw new Error("If you use TileSprite for parallax, distance param is mandatory");
            //
            if (element instanceof Pk.PkLayer && distance)
                element.distance = distance;
            //
            if (element instanceof Pk.PkLayer && distance)
                element.distance = distance;
            //
            if (element instanceof Phaser.TileSprite && cameraLock)
                element.fixedToCamera = true;
            //
            this.layers.push({
                tileElement: element instanceof Phaser.TileSprite ? element : null,
                layerElement: element instanceof Pk.PkLayer ? element : null,
                distance: element instanceof Pk.PkLayer ? element.distance : distance
            });
        };
        PkParallax.prototype.update = function () {
            for (var i in this.layers) {
                // if is tile sprite element
                if (this.layers[i].tileElement) {
                    var posX = 1 / this.layers[i].distance;
                    this.layers[i].tileElement.tilePosition.x = -this.state.game.camera.x * posX;
                    this.layers[i].tileElement.tilePosition.y = -this.state.game.camera.y * posX;
                }
                // if is layer
                if (this.layers[i].layerElement) {
                    // @todo
                }
            }
            ;
        };
        return PkParallax;
    }());
    Pk.PkParallax = PkParallax;
})(Pk || (Pk = {}));
//# sourceMappingURL=app.js.map