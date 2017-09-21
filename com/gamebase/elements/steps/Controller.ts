module GameBase
{
    export module Step
    {
        export class Controller extends Pk.PkElement
        {
            base:Step.Base;
            stepPacks:Array<Step.StepPack> = [];

            addStepPack(stepPack:Step.StepPack):void
            {
                this.stepPacks.push(stepPack);

                this.add(stepPack);
            }

            create()
            {
                // cria os packs, 
                for(var i in this.stepPacks)
                    this.stepPacks[i].create();
                //
            }

            // toca a proxima
            playNext():boolean
            {
                var play:boolean = false;

                for(var i in this.stepPacks)
                {
                    if(!this.stepPacks[i].hasPlay)
                    {
                        play = true;
                        this.stepPacks[i].show();
                        break;
                    }
                }

                return play;
            }
        }
    }
}