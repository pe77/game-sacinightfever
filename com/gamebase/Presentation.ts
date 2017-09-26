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

            gameOver:boolean = false;

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

                // sempre que termina a contagem de tempo
                this.timeBar.event.add(Bar.E.TimeEvent.OnEndCount, ()=>{
                    this.endTimeBar();
                }, this);

                this.likometer.event.add(GameBase.Bar.E.LikometerEvent.OnOver, ()=>{

                    this.gameOver = true;

                    alert("PERDEUUU...\nScore: [Dilmas: "+this.score.value+', Level:'+this.level+"]\nRecarregue para tentar novamente!(vai ser rápido, está cacheado ;) ");

                    // para o tempo
                    this.timeBar.stopCount();
                }, this);


                // sempre que o pack acabar...
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, (e, hit, originalPackSize)=>{

                    console.log('END PACK')

                    if(!this.gameOver)
                        this.endPack(hit, originalPackSize);
                    //
                }, this);

                // sempre que o pack iniciar 
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndPack, (e, hit, originalPackSize)=>{
                    var time = 116 - (this.level * 15);
                    time = time < 50 ? 50 : time;

                    if(!this.gameOver)
                        this.timeBar.startCount(time);
                    //
                }, this);

                // sempre que acabar os packs do controller
                this.controller.event.add(GameBase.Step.E.ControllerEvent.OnEndAllPacks, (e, hit, originalPackSize)=>{
                    console.log('TERMINOU TODOS OS PACK', hit, originalPackSize)

                    setTimeout(()=>{ // bug fix - se não colocar, da tela preta

                        if(!this.gameOver)
                            this.playNextLevel(hit, originalPackSize);
                        //
                    }, 800);

                }, this);

                this.updatePosition();
            }

            start(level:number)
            {
                // reseta / para o tempo
				this.timeBar.stopCount();

                // add umas notinhas
                this.prepare();

                // começa a colocar os steps
                this.controller.playNext();
            }

            prepare()
            {
                // a cada level, vai diminuindo os packs
                var totalPacks:number = 10 - (this.level * 2);
                totalPacks = totalPacks < 1 ? 1 : totalPacks;

                // quanto maior o level, maior a quantidade de notas
                var totalStepInterval:Array<number> = [2 + this.level, 4 + this.level];

                // gera uma serie de packs
                for(var i = 0; i < totalPacks; i++)
                    this.controller.addStepPack(Step.StepPack.generateStepPack(this.game, this.game.rnd.integerInRange(totalStepInterval[0], totalStepInterval[1])));
                //
            }


            playNextLevel(hit:boolean, originalPackSize:number)
            {
                // almenta a dificuldade, se acertou
                if(hit)
                    this.level++;
                //

                // add umas notinhas
                this.prepare();

                // toca
                this.controller.playNext();
            }

            private endTimeBar()
            {
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

                    // da um bonus por level
                    scoreVal += 5 * this.level;

					scoreVal = scoreVal < 5 ? 5 : scoreVal;
					
					this.score.addValue(scoreVal);
					
				}else{
					// quanto mais facil, mais dinheiro perde
					var scoreVal:number = this.timeBar.value / originalPackSize;
					scoreVal = Math.floor(scoreVal * 0.1);
					scoreVal = scoreVal < 10 ? 10 : scoreVal;
					
					this.score.removeValue(scoreVal);
					
				}

				// re-inicia o tempo
                this.timeBar.startCount(100);

				// espera um pouquinho
				setTimeout(()=>{
					// this.resetPacks();
                    this.controller.playNext();
				}, 500);

            }

            pressStep(direction:Step.Direction)
            {
                // se não tem stepPack, ignora
                if(!this.controller.currentPack || this.gameOver)
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