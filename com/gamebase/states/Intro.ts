/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Intro extends Pk.PkState {
 
		enterKey:Phaser.Key;

        jam:Phaser.Sprite;
        phaser:Phaser.Sprite;
        henrique:Phaser.Sprite;
        magrao:Phaser.Sprite;
        andrezito:Phaser.Sprite;

		musicBG:Phaser.Sound;

		init(...args:any[])
		{
			super.init(args); // if whant override init, you need this line!
		}

    	create()
    	{
			super.create();

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

            this.alphaInOut(this.phaser, ()=>{
            this.alphaInOut(this.jam, ()=>{
                

                this.game.add.tween(this.henrique).to(
                    {
                        alpha:1
                    }, 
                    1000, 
                    Phaser.Easing.Linear.None, true
                ).onComplete.add(()=>{
              
                    this.game.add.tween(this.magrao).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);
                    this.game.add.tween(this.magrao).to(
                        {
                            y:this.magrao.y + 150
                        }, 
                        600, 
                        Phaser.Easing.Elastic.Out, true
                    )

                    this.game.add.tween(this.andrezito).to({alpha:1}, 200, Phaser.Easing.Linear.None, true);
                    this.game.add.tween(this.andrezito).to(
                        {
                            y:this.magrao.y - 150
                        }, 
                        600, 
                        Phaser.Easing.Elastic.Out, true, 250
                    ).onComplete.add(()=>{

                        setTimeout(()=>{
                            this.game.add.tween(this.henrique).to({alpha:0}, 200, Phaser.Easing.Linear.None, true);
                            this.game.add.tween(this.magrao).to({alpha:0}, 200, Phaser.Easing.Linear.None, true);
                            this.game.add.tween(this.andrezito).to({alpha:0}, 200, Phaser.Easing.Linear.None, true).onComplete.add(()=>{
                                this.showIntro()
                            }, this);
                        }, 3000)
                        
                    }, this);
                    

                }, this);

                
            });
            });

		}

        showIntro()
        {
            var bg:Phaser.Sprite = Pk.PkUtils.createSquare(this.game, this.game.world.width, this.game.world.height, "#938da0");
            this.game.add.tween(bg).from({alpha:0}, 200, Phaser.Easing.Linear.None, true);

            var luz:Phaser.Sprite       = this.game.add.sprite(0, 0, 'intro-luz');
            // this.game.add.tween(luz).from({alpha:0}, 200, Phaser.Easing.Linear.None, true);

            var logo:Phaser.Sprite      = this.game.add.sprite(0, 0, 'intro-gamelogo');
            this.game.add.tween(logo).from({alpha:0}, 200, Phaser.Easing.Linear.None, true);

            var saci:Phaser.Sprite      = this.game.add.sprite(0, 0, 'intro-saci');
            this.game.add.tween(saci).from({alpha:0}, 200, Phaser.Easing.Linear.None, true);

            var audience:Phaser.Sprite  = this.game.add.sprite(0, 0, 'intro-audience');
            this.game.add.tween(audience).from({alpha:0}, 200, Phaser.Easing.Linear.None, true);

            var btn:Phaser.Sprite       = this.game.add.sprite(0, 0, 'intro-btn');
            this.game.add.tween(btn).from({alpha:0}, 200, Phaser.Easing.Linear.None, true);

            

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
            btn.events.onInputUp.add(()=>{
                btn.inputEnabled = false;
                this.transition.change('Main');
            }, this)


            
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

            this.game.add.tween(saci).to(
                {
                    y:saci.y - 15
                }, 
                200, 
                Phaser.Easing.Linear.None, 
                true, 0, -1
            ).yoyo(true);

            this.game.add.tween(luz).to(
                {
                    alpha:0
                }, 
                100, 
                Phaser.Easing.Exponential.Out, 
                true, 0, -1
            ).yoyo(true);

            this.game.add.tween(logo).from(
                {
                    y:logo.y-100
                }, 
                1200, 
                Phaser.Easing.Bounce.Out, 
                true
            )

            this.game.add.tween(audience).to(
                {
                    y:audience.y+10
                }, 
                200, 
                Phaser.Easing.Linear.None, 
                true, 0, -1
            ).yoyo(true);
            
            

            /*
            btn.alpha = 0;
            logo.alpha = 0;
            audience.alpha = 0;
            luz.alpha = 0;
            saci.alpha = 0;
            */
        }

        alphaInOut(object, callBack:Function)
        {
            var tween:Phaser.Tween = this.game.add.tween(object).to(
                {
                    alpha:1
                }, 
                1000, 
                Phaser.Easing.Linear.None, true
            );

            tween.onComplete.add(()=>{
                
              var tween:Phaser.Tween = this.game.add.tween(object).to(
                    {
                        alpha:0
                    }, 
                    1000, 
                    Phaser.Easing.Linear.None, true, 3000
              );  

              tween.onComplete.add(()=>{
                  callBack();
              }, this);

            }, this);
        }

		playSound()
        {
            // play music
            this.musicBG.volume = 0.6;
            this.musicBG.fadeIn(600, true);
			// this.musicBG.play('', 0, 0.6, true);
        }

		// calls when leaving state
        shutdown()
        {
            if(this.musicBG.isPlaying)
                this.musicBG.stop();
            //
        }

    }

}