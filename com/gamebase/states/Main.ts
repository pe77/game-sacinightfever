/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {
 
		enterKey:Phaser.Key;

		controller:Step.Controller;
		likometer:Bar.Likometer;
		time:Bar.Time;
		timee:number = 30; // ms

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

			this.controller = new Step.Controller(this.game);
			this.controller.addStepPack(this.generateStepPack());
			this.controller.create();

			this.controller.x = this.game.world.centerX - this.controller.width/2;
			this.controller.y = 100;

			this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(()=>{
                this.pressStep(Step.Direction.DOWN);
			}, this);
			
			this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(()=>{
                this.pressStep(Step.Direction.TOP);
			}, this);
			
			this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(()=>{
                this.pressStep(Step.Direction.LEFT);
			}, this);
			
			this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(()=>{
                this.pressStep(Step.Direction.RIGHT);
			}, this);
			
			// toca o primeiro pack
			this.controller.playNext();

			// sempre que o pack acabar...
			this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, (hit)=>{
				console.log('PACK OVER ENVET');

				// para o tempo
				this.time.stopCount();

				// espera um pouquinho
				setTimeout(()=>{
					this.resetPacks();
				}, 500);

			}, this);

			var audience:Audience.Audience = new Audience.Audience(this.game);
			audience.create();

			
			this.likometer = new Bar.Likometer(
				this.game, 
				this.game.add.sprite(0, 0, 'likebar-back'),
				this.game.add.sprite(0, 0, 'likebar-bar'),
				this.game.add.sprite(0, 0, 'likebar-border')
			); 

			this.likometer.create();
			this.likometer.setValue(80);
			console.log('*--- ', this.likometer.value)

			this.likometer.y += 80;
			// likometer.x = this.game.world.width - likometer.width - 20;
			this.likometer.x = this.game.world.width - this.likometer.backSprite.width - 20;
			// likometer.x += 100;

			// cria a barra de tempo e coloca ao lado do controller
			this.time = new Bar.Time(this.game);
			this.time.create();
			this.time.x = this.controller.x + this.controller.width;
			this.time.y = this.controller.y + 27;

			// this.time.setValue(80);
			
			setTimeout(()=>{
				// this.time.setValue(80);
			}, 2000);

			// inicia contagem de tempo
			this.time.startCount(this.timee); // ms

			this.time.event.add(Bar.E.TimeEvent.OnEndCount, ()=>{
				console.log('terminou contato')
				// se tiver alguma nota, erra remove contagem
				this.likometer.removeValue(40);

				// força o erro
				this.controller.killStep(false);

				// reseta os steps
				// this.resetPacks();
			}, this);
		}

		resetPacks()
		{
			console.log()
			// add outro pack
			this.controller.addStepPack(this.generateStepPack());

			// começa a contagem
			this.time.startCount(this.timee);

			// toca
			this.controller.playNext();
		}
		
		pressStep(direction:Step.Direction)
		{
			// se apertou a direção certa
			if(this.controller.playDirection(direction))
			{
				this.likometer.addValue(3);
				this.controller.killStep(true);

			}else{
				
				this.likometer.removeValue(30);
				this.controller.killStep(false);
			}
			
		}

		generateStepPack():Step.StepPack
		{
			// cria um pack
			var stepPack:Step.StepPack = new Step.StepPack(this.game);

			// add uns passos
			for(var i = 0; i < 7; i++)
				stepPack.addStep(new Step.Step(this.game, Step.Step.getRandomDirection()));
			//

			return stepPack;
		}
		
		render()
        {
            this.game.debug.text('(Main Screen) ', 35, 35);
        }

		// calls when leaving state
        shutdown()
        {
            
        }

    }

}