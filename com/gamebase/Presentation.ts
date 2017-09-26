module GameBase
{
    export module Presentation
    {
        export class Presentation extends Pk.PkElement
        {
            controller:Step.Controller;
            likometer:Bar.Likometer;
            timeBar:Bar.Time;
            score:Score.Score;
            timee:number = 50; // ms
            audience:Audience.Audience;

            level:number = 1; // dificuldade

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                // cria as coisas
                this.controller.create();
                this.audience.create();
                this.likometer.create();
                this.timeBar.create();
                this.score.create();

                // eventos
                this.timeBar.event.add(Bar.E.TimeEvent.OnEndCount, ()=>{
                    this.endTimeBar();
                }, this);

                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, (e, hit, originalPackSize)=>{
                    // sempre que o pack acabar...
                    this.endPack(hit, originalPackSize);
                }, this);

                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndAllPacks, (e, hit, originalPackSize)=>{
                    console.log('TERMINOU TODOS OS PACKS')
                }, this);

                this.updatePosition();
            }

            start(level:number)
            {
                // reseta / para o tempo
				this.timeBar.stopCount();

                var totalPacks:number = 5;

                var totalStepInterval:Array<number> = [3, 5];

                // gera uma serie de packs
                for(var i = 0; i < totalPacks; i++)
                    this.controller.addStepPack(Step.StepPack.generateStepPack(this.game, this.game.rnd.integerInRange(totalStepInterval[0], totalStepInterval[1])));
                //

                // inici a colocar
                this.controller.playNext();
            }

            playNextLevel()
            {
                
            }

            private endTimeBar()
            {
                console.log('terminou contato')
                // se tiver alguma nota, erra remove contagem
                this.likometer.removeValue(25);

                // força o erro
                this.controller.killStep(false);
            }

            private endPack(hit, originalPackSize)
            {
                // se fechou, calcula a grana
				if(hit)
				{
					var scoreVal:number = this.timeBar.value * originalPackSize;
					scoreVal = Math.floor(scoreVal * 0.1);
					scoreVal = scoreVal < 5 ? 5 : scoreVal;
					
					this.score.addValue(scoreVal);
					
				}else{
					// quanto mais facil, mais dinheiro perde
					var scoreVal:number = this.timeBar.value / originalPackSize;
					scoreVal = Math.floor(scoreVal * 0.1);
					scoreVal = scoreVal < 10 ? 10 : scoreVal;
					
					this.score.removeValue(scoreVal);
					
				}

				// para o tempo
				this.timeBar.stopCount();

				// espera um pouquinho
				setTimeout(()=>{
					// this.resetPacks();
                    this.controller.playNext();
				}, 500);

            }

            pressStep(direction:Step.Direction)
            {
                // se não tem stepPack, ignora
                if(!this.controller.currentPack)
                {
                    console.log('-- IGNORA CLICK')
                    return;
                }

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

            updatePosition()
            {
                // posiciona as coisas
                this.controller.x = this.game.world.centerX - this.controller.width/2;
			    this.controller.y = 100;

                this.likometer.y += 80;
			    this.likometer.x = this.game.world.width - this.likometer.backSprite.width - 20;

                this.timeBar.x = this.controller.x + this.controller.width;
			    this.timeBar.y = this.controller.y + 27;

                this.score.x += 20;
			    this.score.y += 20;
            }
        }
    }
}