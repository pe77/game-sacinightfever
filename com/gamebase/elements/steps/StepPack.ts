module GameBase
{
    export module Step
    {
        export class StepPack extends Pk.PkElement
        {
            steps:Array<Step.Step> = [];
            padding:number = 10;
            hasPlay:boolean = false;

            created:boolean = false;

            currentStep:Step.Step;
            originalPackSize:number = 0;

            constructor(game:Pk.PkGame)
            {
                super(game);

                this.visible = false;
            }

            addStep(step:Step.Step):void
            {
                if(!this.currentStep)
                    this.currentStep = step;
                //

                this.steps.push(step);

                this.originalPackSize = this.steps.length;

                this.add(step);
            }

            create():boolean
            {
                if(this.created)
                    return false;
                //

                this.created = true;

                // cria os passos, 
                for(var i in this.steps)
                    this.steps[i].create();
                //

                return true;
            }

            // posiciona as notas
            show()
            {
                this.visible = true;

                this.updatePosition();
            }

            updatePosition()
            {
                // reseta a posição de todo mundo
                this.steps.forEach(step => {
                    step.y = 0;
                });

                // (re)pos as "notas"
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




            
            // remove o step do pack current
            killStep(hit:boolean):boolean
            {
                // se já acabou as notas do pack
                if(!this.currentStep)
                    return false;
                //
                
                

                // se errou, treme a camera mata todas as outras notas
                if(!hit)
                {
                    // da uma tremida na camera
                    this.game.camera.shake(0.01, 170);

                    this.steps.forEach(step => {
                        step.kill(hit);
                    });

                    this.steps = [];

                }else{
                    // mata só essa nota
                    var step:Step.Step = this.steps.shift();
                    step.kill(hit);
                }

                this.currentStep = this.steps.length ? this.steps[0] : null; // atualiza o atual
                this.updatePosition(); // atualiza posição
                
                return true;
            }
        }
    }
}