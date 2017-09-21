module GameBase
{
    export module Step
    {
        export class StepPack extends Pk.PkElement
        {
            steps:Array<Step.Step> = [];
            padding:number = 10;
            hasPlay:boolean = false;

            addStep(step:Step.Step):void
            {
                this.steps.push(step);

                this.add(step);
            }

            create()
            {
                // cria os passos, 
                for(var i in this.steps)
                    this.steps[i].create();
                //

                this.visible = false;
            }

            // posiciona as notas
            show()
            {
                this.visible = true;

                // pos as "notas"
                var i = 0;
                this.steps.forEach(step => {
                    
                    if(i > 0)
                    {
                        // pega o ultimo 
                        var lastStep:Step.Step = this.steps[i-1];

                        // pos o atual abaixo do ultimo
                        step.y = lastStep.y + lastStep.height + this.padding;
                    }
                    i++;

                });
                
            }
        }
    }
}