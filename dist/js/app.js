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
            _this.canvasSize = ["100%", 720];
            _this.initialState = 'Main';
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
            // creating sprites from preloadead images
            // this.logo           = this.add.sprite(0, 0, 'game-loading-logo');
            // create custom loading bar
            this.loadingBar = Pk.PkUtils.createSquare(this.game, this.game.width, 20, "#ffffff");
            // set sprite as preloading
            this.load.setPreloadSprite(this.loadingBar);
            // pos loading bar on bot
            this.loadingBar.y = this.world.height - this.loadingBar.height;
            //  ** ADDING Other things  ** //
            // scripts
            this.load.script('gray', 'assets/default/scripts/filters/Gray.js');
            // step
            this.load.image('step-top', 'assets/states/main/images/step/step-top.png');
            this.load.image('step-down', 'assets/states/main/images/step/step-down.png');
            this.load.image('step-left', 'assets/states/main/images/step/step-left.png');
            this.load.image('step-right', 'assets/states/main/images/step/step-right.png');
            // generic
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
    var Step;
    (function (Step) {
        var Base = (function (_super) {
            __extends(Base, _super);
            function Base(game) {
                return _super.call(this, game) || this;
            }
            Base.prototype.create = function () {
                console.log('creating BASE');
                this.back = Pk.PkUtils.createSquare(this.game, 60, 60);
                this.back.alpha = 0.7;
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
                // step size
                var stepSize = 50; //this.stepPacks.length ? this.stepPacks[0].steps[0].width : 50;
                // ajusta o tamanho pra ficar um pouco maior que o step~
                var basePadding = 15;
                this.base.width = this.base.height = stepSize + basePadding;
                // centraliza a base
                this.base.x -= basePadding / 2;
                this.base.y -= basePadding / 2;
            };
            // toca o proximo pack
            Controller.prototype.playNext = function () {
                if (this.stepPacks.length) {
                    this.currentPack = this.stepPacks[0];
                    this.currentPack.create();
                    this.add(this.currentPack);
                    this.currentPack.show();
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
                return this.currentPack.currentStep.direction == direction;
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
                    console.log('remove pack');
                    var lastPack = this.stepPacks.shift();
                    // this.currentPack.destroy();
                    // espera a ultima nota animar
                    setTimeout(function () {
                        lastPack.destroy();
                    }, 1500);
                    // se ainda houver packs, seta o current para o proximo
                    if (this.stepPacks.length) {
                        console.log('atualiza current para o proximo');
                        this.currentPack = this.stepPacks[0];
                        this.stepPacks[0].show();
                    }
                    else
                        this.currentPack = null; // se não houver mais packs
                    //    
                    // se errou, dispara o evento de fim de pack
                    this.event.dispatch(GameBase.Step.E.ControllerEvent.OnEndPack, hit);
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
                // var bodySprite:Phaser.Sprite = Pk.PkUtils.createSquare(this.game, 50, 50);
                console.log('CREATING STEP');
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
                var time = 500;
                // se acertou anima pra direção 
                if (hit) {
                    var x = 0;
                    var y = 0;
                    var distance = 150;
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
                    this.bg.anchor.set(0.5, 0.5);
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
                _this.visible = false;
                return _this;
            }
            StepPack.prototype.addStep = function (step) {
                if (!this.currentStep)
                    this.currentStep = step;
                //
                this.steps.push(step);
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
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super !== null && _super.apply(this, arguments) || this;
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
            // get the keyboard key to come back to menu
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            // when press the key...
            this.enterKey.onDown.add(function () {
                // this.transition.change('Menu', 1111, 'text', {a:true, b:[1, 2]});  // return with some foo/bar args
            }, this);
            this.controller = new GameBase.Step.Controller(this.game);
            this.controller.addStepPack(this.generateStepPack());
            this.controller.create();
            this.controller.x = this.game.world.centerX;
            this.controller.y = 150;
            this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () {
                _this.pressStep(GameBase.Step.Direction.DOWN);
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () {
                _this.pressStep(GameBase.Step.Direction.TOP);
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () {
                _this.pressStep(GameBase.Step.Direction.LEFT);
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () {
                _this.pressStep(GameBase.Step.Direction.RIGHT);
            }, this);
            // toca o primeiro pack
            this.controller.playNext();
            // sempre que o pack acabar...
            this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, function (hit) {
                console.log('PACK OVER ENVET');
                // espera um pouquinho
                setTimeout(function () {
                    // add outro pack
                    _this.controller.addStepPack(_this.generateStepPack());
                    // toca
                    _this.controller.playNext();
                }, 500);
            }, this);
        };
        Main.prototype.pressStep = function (direction) {
            // se apertou a direção certa
            if (this.controller.playDirection(direction)) {
                this.controller.killStep(true);
            }
            else {
                this.controller.killStep(false);
            }
        };
        Main.prototype.generateStepPack = function () {
            // cria um pack
            var stepPack = new GameBase.Step.StepPack(this.game);
            // add uns passos
            for (var i = 0; i < 7; i++)
                stepPack.addStep(new GameBase.Step.Step(this.game, GameBase.Step.Step.getRandomDirection()));
            //
            return stepPack;
        };
        Main.prototype.render = function () {
            this.game.debug.text('(Main Screen) ', 35, 35);
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