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

    		// get the keyboard key to come back to menu
            this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

			// when press the key...
            this.enterKey.onDown.add(()=>{
                // this.transition.change('Menu', 1111, 'text', {a:true, b:[1, 2]});  // return with some foo/bar args
            }, this);

			// cria a apresentação E add os componentes
			this.presentation = new Presentation.Presentation(this.game);
			this.presentation.controller = new Step.Controller(this.game);
			this.presentation.audience = new Audience.Audience(this.game);
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
		
		
		// calls when leaving state
        shutdown()
        {
            
        }

    }

}