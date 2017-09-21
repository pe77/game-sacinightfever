module GameBase
{
    export module Step
    {
        export class Controller extends Pk.PkElement
        {
            base:Step.Base;
            stepPacks:Array<Step.StepPack> = [];
            currentPack:Step.StepPack;

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

                // step size
                var stepSize = 50; //this.stepPacks.length ? this.stepPacks[0].steps[0].width : 50;

                // ajusta o tamanho pra ficar um pouco maior que o step~
                var basePadding = 15;
                this.base.width = this.base.height = stepSize + basePadding;

                // centraliza a base
                this.base.x -= basePadding / 2;
                this.base.y -= basePadding / 2;
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

                // se esse pack não tiver mais steps, remove
                if(!this.currentPack.steps.length)
                {
                    console.log('remove pack')

                    
                    
                    var lastPack:Step.StepPack = this.stepPacks.shift();
                    // this.currentPack.destroy();

                    // espera a ultima nota animar
                    setTimeout(()=>{
                        lastPack.destroy();
                    }, 1500)

                    // se ainda houver packs, seta o current para o proximo
                    if(this.stepPacks.length)
                    {
                        console.log('atualiza current para o proximo')

                        this.currentPack = this.stepPacks[0];
                        this.stepPacks[0].show();
                    }else
                        this.currentPack = null; // se não houver mais packs
                    //

                    // dispara o evento de "este pack acabou"
                    this.event.dispatch(GameBase.Step.E.ControllerEvent.OnEndPack);
                }
            }
        }

        export module E
        {
            export module ControllerEvent
            {
                export const OnEndPack:string 	= "OnControllerEventEndPack";
            }
        }
        
    }

    
}