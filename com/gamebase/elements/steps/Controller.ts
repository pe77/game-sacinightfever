module GameBase
{
    export module Step
    {
        export class Controller extends Pk.PkElement
        {
            base:Step.Base;
            stepPacks:Array<Step.StepPack> = [];
            currentPack:Step.StepPack;
            gmask:Phaser.Graphics;

            event:Pk.PkEvent;

            constructor(game:Pk.PkGame)
            {
                super(game);

                this.base = new GameBase.Step.Base(this.game);

                this.event = new Pk.PkEvent('controller-event', this);
            }

            addStepPack(stepPack:Step.StepPack):void
            {
                this.stepPacks.push(stepPack);
            }

            create()
            {
                this.base.create();
                this.add(this.base);

                // cria e add os packs
                /*
                for(var i in this.stepPacks)
                {
                    this.stepPacks[i].create();
                    this.add(this.stepPacks[i]);   
                }
                */

                this.gmask = this.game.add.graphics(0, 0);

                this.gmask.beginFill(0x000000);
                this.gmask.drawRoundedRect(this.x -150, this.y -150, 400, 600, 10);
                this.gmask.endFill();

                // step size
                var stepSize = 50; //this.stepPacks.length ? this.stepPacks[0].steps[0].width : 50;

                // ajusta o tamanho pra ficar um pouco maior que o step~
                var basePadding = 15;
                // this.base.width = this.base.height = stepSize + basePadding;
                

                // centraliza a base
                this.base.x -= basePadding / 2;
                this.base.y -= basePadding / 2;

                this.base.x -= 6;
                this.base.y -= 10;

                console.log('--- this.base:', this.base.alpha)
            }

            // toca o proximo pack
            playNext():boolean
            {
                if(this.stepPacks.length)
                {
                    this.currentPack = this.stepPacks[0];

                    this.currentPack.create();
                    this.add(this.currentPack);
                    
                    this.currentPack.show();

                    this.gmask.visible = true;
                    this.currentPack.mask = this.gmask;
                    
                    this.event.dispatch(GameBase.Step.E.ControllerEvent.StartNext);

                    return true;
                }

                return false;
            }

            playDirection(direction:Step.Direction):boolean
            {
                // não tem pack, não tem nota
                if(!this.currentPack)
                    return false;
                //

                // se já acabou as notas do pack
                if(!this.currentPack.currentStep)
                    return false;
                //

                // se é a mesma
                return this.currentPack.currentStep.direction == direction;
            }

            // remove o step do pack current
            killStep(hit:boolean)
            {
                // não tem pack, não tem nota
                if(!this.currentPack)
                    return false;
                //

                // se já acabou as notas do pack
                if(!this.currentPack.currentStep)
                    return false;
                //

                // remove a ultimo step
                this.currentPack.killStep(hit);

                // se esse pack não tiver mais steps OU errou
                if(!this.currentPack.steps.length || !hit)
                {
                    var lastPack:Step.StepPack = this.stepPacks.shift();
                    // this.currentPack.destroy();

                    // espera a ultima nota animar
                    setTimeout(()=>{
                        lastPack.destroy();
                    }, 1500);

                    var originalPackSize = this.currentPack.originalPackSize;

                    // se ainda houver packs, seta o current para o proximo
                    if(this.stepPacks.length)
                    {
                        this.currentPack = this.stepPacks[0];
                        this.stepPacks[0].show();

                        this.gmask.visible = true;
                        this.currentPack.mask = this.gmask;
                    }else
                    {
                        this.gmask.visible = false;
                        this.currentPack = null;
                    }
                        
                    //    
                    
                    // se errou, dispara o evento de fim de pack
                    this.event.dispatch(GameBase.Step.E.ControllerEvent.OnEndPack, hit, originalPackSize);

                    // se acabou o pack, dispara o evento de fim de pack
                    if(!this.currentPack)
                        this.event.dispatch(GameBase.Step.E.ControllerEvent.OnEndAllPacks, hit, originalPackSize);    
                    //
                }

                
            }
        }

        export module E
        {
            export module ControllerEvent
            {
                export const OnEndPack:string 	    = "OnControllerEventEndPack";
                export const StartNext:string 	    = "OnControllerStartNext";
                export const OnEndAllPacks:string 	= "OnControllerOnEndAllPacks";
            }
        }
        
    }

    
}