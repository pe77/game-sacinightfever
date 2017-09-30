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


		endgameScree:Pk.PkElement;
        bg:Phaser.Sprite;
		endGameTextTitle:Phaser.Text;
		endBtn:Phaser.Sprite;
		endGameTextDescription:Phaser.Text;
		saci:Saci.Saci;


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

			this.saci = new Saci.Saci(this.game);
			this.saci.addMove(new Saci.Move1(this.game));
			this.saci.addMove(new Saci.Move2(this.game));
			this.saci.addMove(new Saci.Move3(this.game));
			this.saci.addMove(new Saci.Move2(this.game));
			this.saci.create();

			this.saci.x = this.game.world.centerX - 80;
			this.saci.y += 300;

			// coloca ele paradinho com a bunda kk
			this.saci.moves[0].spriteBase.visible = true;

			// quando tocar a primeira nota, começa a dançar
			this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnFirstNote, ()=>{
				console.log('FIRST NOTE')
				
				this.saci.playNextMove();
				/*
				setInterval(()=>{
					saci.playNextMove();
				}, 3000)
				*/
			}, this);

			this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnChangeStepPack, ()=>{
				console.log('CHANGE PACK')
				this.saci.playNextMove();
			}, this);

			this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnMissStep, ()=>{
				console.log('--- wrongMove')
				this.saci.wrongMove();
			}, this);

			this.presentation.event.add(GameBase.Presentation.E.PresentationEvent.OnEndGame, (e, win)=>{
				console.log('win::', win)

				if(win)
				{
					this.endGameTextDescription.text = "Você ganhou. Quem diria!\n         Dinheiros: " + this.presentation.score.value;
				}else{
					this.endGameTextDescription.text = "Você perdeu. Poxa vida...\n          Dinheiros: " + this.presentation.score.value;
				}

				this.endgameScree.visible = true;
			}, this);

			// audio
            this.musicBG = this.game.add.audio('main-dance');
            this.musicBG.onDecoded.add(this.playSound, this); // load


			// bg bg! // same world size
			this.bg = Pk.PkUtils.createSquare(this.game, this.game.world.width, this.game.world.height, "#000")
			this.bg.alpha = .95;

			this.endGameTextTitle = this.game.add.text(0, 0,
				"Fim de Jogo", // text
				{
					font: "58px Love Story Rough",
					fill: "#c8c8c8"
				} // font style
			);


			this.endGameTextDescription = this.game.add.text(0, 0,
				"Você ganhou. Quem diria!\n         Dinheiros: 134", // text
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

            this.endBtn.events.onInputUp.add(()=>{
                // this.transition.change('Main');
				this.playAgain();
            }, this)


			this.endgameScree = new Pk.PkElement(this.game);
			this.endgameScree.add(this.bg);
			this.endgameScree.add(this.endBtn);
			this.endgameScree.add(this.endGameTextTitle);
			this.endgameScree.add(this.endGameTextDescription);
			


			

			this.endgameScree.visible = false;
			
		}

		playSound()
        {
            // play music
            this.musicBG.fadeIn(1000, true);
			// this.musicBG.play('', 0, 1, true);
        }

		playAgain()
		{
			this.endgameScree.visible = false;
			this.saci.playNextMove();
			this.presentation.restart();
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