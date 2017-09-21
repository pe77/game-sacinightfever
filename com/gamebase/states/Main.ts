/// <reference path='../../pkframe/refs.ts' />

module GameBase
{

	export class Main extends Pk.PkState {
 
		enterKey:Phaser.Key;


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

			// cria um pack
			var stepPack:Step.StepPack = new Step.StepPack(this.game);

			// add uns passos
			for(var i = 0; i < 7; i++)
				stepPack.addStep(new Step.Step(this.game, Step.Step.getRandomDirection()));
			//

			var controller:Step.Controller = new Step.Controller(this.game);
			controller.addStepPack(stepPack);
			controller.create();

			// toca o primeiro pack
			controller.playNext();

			controller.x = this.game.world.centerX;

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