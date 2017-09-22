/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {
 
		enterKey:Phaser.Key;

		controller:Step.Controller;

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

			this.controller.x = this.game.world.centerX;
			this.controller.y = 150;

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

				// espera um pouquinho
				setTimeout(()=>{
					// add outro pack
					this.controller.addStepPack(this.generateStepPack());

					// toca
					this.controller.playNext();
				}, 500)


				

			}, this);
		}
		
		pressStep(direction:Step.Direction)
		{
			// se apertou a direção certa
			if(this.controller.playDirection(direction))
			{
				this.controller.killStep(true);
			}else{
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