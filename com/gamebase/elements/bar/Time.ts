/// <reference path='Vertical.ts' />

module GameBase
{
    export module Bar
    {
        export class Time extends Vertical
        {
            
            clock:Phaser.Sprite;
            interval:number; 
            intervalId:number;

            constructor(game:Pk.PkGame)
            {
                var bar = game.add.sprite(0, 0, 'time-bar');
                var back = Pk.PkUtils.createSquare(game, bar.width, bar.height);
                var border = Pk.PkUtils.createSquare(game, bar.width, bar.height);

                back.visible = border.visible = false;

                super(game, back, bar, border);

            }

            create()
            {
            
               super.create();

               this.clock = this.game.add.sprite(0, 0, 'time-clock');

               this.add(this.clock);
               this.clock.anchor.x = 0.5;
               this.clock.x += this.barSprite.width / 2;
               this.clock.y -= this.clock.height;

               // this.barSprite.mask = null;
               // this.angle = 180;
            }

            startCount(interval:number = 1000)
            {
                this.interval = interval;
                this.value = 100;
                

                // se houver alguma outra contagem, pausa
                if(this.intervalId)
                    clearInterval(this.intervalId);
                //

                this.intervalId = setInterval(()=>{
                    this.removeValue(1);
                }, this.interval);
            }

            stopCount()
            {
                console.log('stopCount--')
                if(this.intervalId)
                    clearInterval(this.intervalId);
                //

                this.setValue(100);
            }

            processValue(time:number = 500)
            {
                var x = this.value * 0.01;
                var v = this.maxSize - (x * this.maxSize);// - this.maxSize;
                v *= -1; // sobe invertico

                // não precisa animar

                // se houver alguma a  nimação, pausa
                if(this.tween)
                    this.tween.stop(true);
                //

                this.tween = this.addTween(this.barSprite).to(
                    {
                        y:v
                    }, 
                    time, 
                    Phaser.Easing.Back.Out, 
                    true
                );
                
                if(this.value == 0)
                {
                    clearInterval(this.intervalId);
                    this.event.dispatch(GameBase.Bar.E.TimeEvent.OnEndCount);
                }
                    
                //
            }
            
        }

        
        export module E
        {
            export module TimeEvent
            {
                export const OnEndCount:string 	= "TimeEventOnEndCount";
            }
        }

    }
}