/// <reference path='../pkframe/refs.ts' />

module GameBase {

    export class Preloader  extends Pk.PkLoaderPreLoader {

        preload()
        {
            // utils / vendor
            this.load.script('WebFont', 'com/gamebase/vendor/webfontloader.js');

            // load game loading bar
            // this.load.image('game-loading-bar', 'assets/states/loader/images/loading-bar.png');

            // load game loading logo
            // this.load.image('game-loading-logo', 'assets/states/loader/images/logo.png');
        }

    }
 
    export class Loader extends Pk.PkLoader implements Pk.I.Loader {

        loadingBar:Phaser.Sprite;
        logo:Phaser.Sprite;
        loadingText:Phaser.Text;
        
        init()
        {
            super.init();
        }

        preload()
        {
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
            this.load.script('gray', 'assets/default/scripts/filters/Gray.js')


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
            this.load.image('intro-henrique', 'assets/states/intro/images/henrique.png');
            this.load.image('intro-andrezito', 'assets/states/intro/images/andrezito.png');
            this.load.image('intro-magrao', 'assets/states/intro/images/magrao.png');

            this.load.audio('intro-audiobg', 'assets/states/intro/audio/bg-cut.mp3');

            this.load.image('intro-btn', 'assets/states/intro/images/btniniciar.png');
            this.load.image('intro-gamelogo', 'assets/states/intro/images/gamelogo.png');
            this.load.image('intro-audience', 'assets/states/intro/images/plateia.png');
            this.load.image('intro-luz', 'assets/states/intro/images/luz.png');
            this.load.image('intro-saci', 'assets/states/intro/images/saci.png');
            // generic
            // this.load.image('cinematic-bg', 'assets/states/intro/images/cinematic-bg.jpg');
            // this.load.audio('intro-sound', 'assets/states/intro/sounds/intro.mp3');
            // this.load.spritesheet('char1-idle', 'assets/default/images/chars/heroes/1/iddle.png', 158, 263, 12);
            
        }

        create()
        {
            super.create();
        }
    }
 
}
