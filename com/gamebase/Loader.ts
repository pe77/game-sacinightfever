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
