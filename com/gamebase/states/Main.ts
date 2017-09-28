/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {
 
		enterKey:Phaser.Key;

		controller:Step.Controller;
		likometer:Bar.Likometer;
		time:Bar.Time;
		score:Score.Score;
		timee:number = 50; // ms

		presentation:GameBase.Presentation.Presentation;


		musicBG:Phaser.Sound;

		init(...args:any[])
		{
			super.init(args); // if whant override init, you need this line!
		}

    	create()
    	{
			super.create();

    		// change state bg
            this.game.stage.backgroundColor = "#938da0";

			// prevent stop update when focus out
            this.stage.disableVisibilityChange = true;

			var scenarioBg:Phaser.Sprite = this.game.add.sprite(0, 0, 'main-bg');
			scenarioBg.y -= 67;

			// cria a apresentação E add os componentes
			this.presentation = new Presentation.Presentation(this.game);
			this.presentation.controller = new Step.Controller(this.game);
			this.presentation.audience = new Audience.Audience(this.game);
			this.presentation.level = new Level.Level(this.game);
			this.presentation.likometer = new Bar.Likometer(
				this.game, 
				this.game.add.sprite(0, 0, 'likebar-back'),
				this.game.add.sprite(0, 0, 'likebar-bar'),
				this.game.add.sprite(0, 0, 'likebar-border')
			); 
			this.presentation.timeBar = new Bar.Time(this.game);
			this.presentation.score = new Score.Score(this.game);


			this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(()=>{
                this.presentation.pressStep(Step.Direction.DOWN);
			}, this);
			
			this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(()=>{
                this.presentation.pressStep(Step.Direction.TOP);
			}, this);
			
			this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(()=>{
                this.presentation.pressStep(Step.Direction.LEFT);
			}, this);
			
			this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(()=>{
                this.presentation.pressStep(Step.Direction.RIGHT);
			}, this);


			// bla
			// this.likometer.setValue(80);
			// this.time.startCount(this.timee); // ms
			this.presentation.create();

			this.presentation.start(1);

			var saci:Saci.Saci = new Saci.Saci(this.game);
			saci.addMove(new Saci.Move1(this.game));
			saci.addMove(new Saci.Move2(this.game));
			saci.addMove(new Saci.Move3(this.game));
			saci.addMove(new Saci.Move2(this.game));
			saci.create();

			saci.x = this.game.world.centerX - 80;
			saci.y += 300;

			// coloca ele paradinho com a bunda kk
			saci.moves[0].spriteBase.visible = true;

			// quando tocar a primeira nota, começa a dançar
			this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnFirstNote, ()=>{
				console.log('FIRST NOTE')
				
				saci.playNextMove();
				/*
				setInterval(()=>{
					saci.playNextMove();
				}, 3000)
				*/
			}, this);

			this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnChangeStepPack, ()=>{
				console.log('CHANGE PACK')
				saci.playNextMove();
			}, this);

			// audio
            this.musicBG = this.game.add.audio('main-dance');
            this.musicBG.onDecoded.add(this.playSound, this); // load
		}

		playSound()
        {
            // play music
            // this.musicBG.fadeIn(1000, true);
			this.musicBG.play('', 0, 1, true);
        }

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

		render()
        {
             // this.game.debug.text('LEVEL ' + this.presentation.level, this.game.world.centerX, 35);
        }
		
		
		// calls when leaving state
        shutdown()
        {
            
        }

    }

}