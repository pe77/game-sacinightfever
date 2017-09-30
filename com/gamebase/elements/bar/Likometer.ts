/// <reference path='Vertical.ts' />

module GameBase
{
    export module Bar
    {
        export class Likometer extends Vertical
        {
            
            sad:Phaser.Sprite;
            smile:Phaser.Sprite;

            sfxWow:Phaser.Sound;
            sfxBoo:Phaser.Sound;

            lastValue:number;

            constructor(game:Pk.PkGame, backSprite:Phaser.Sprite, barSprite:Phaser.Sprite, borderSprite:Phaser.Sprite)
            {
                super(game, backSprite, barSprite, borderSprite);
            }

            create()
            {
                
               // cria uma mascara do tamanho da barra
                this.maskGraph = this.game.add.graphics(0, 0);
                this.maskGraph.beginFill(0xffffff);
                this.maskGraph.lineStyle(1, 0xffd900, 1);
                console.log('this.borderSprite.width:', this.borderSprite.width)
                console.log('this.borderSprite.height:', this.borderSprite.height)
                this.maskGraph.drawRect(0, 0, this.borderSprite.width, this.borderSprite.height - 7);
                this.maskGraph.endFill();

                // this.mask = this.maskGraph;
                this.barSprite.mask = this.maskGraph;

                // usa o tamanho da mascara como tamanho 100%
                this.maxSize = this.borderSprite.height;

                // this.barSprite.y += 100
                
                this.add(this.backSprite);
                this.add(this.barSprite);
                this.add(this.borderSprite);
                this.add(this.maskGraph)

               this.smile = this.game.add.sprite(0, 0, 'likebar-smile');
               this.sad = this.game.add.sprite(0, 0, 'likebar-sad');

               // coloca acime a abaixo da barra
               var padding = 10;
               this.smile.y -= this.smile.height + padding;
               this.sad.y += this.borderSprite.height + padding;

               this.smile.anchor.x = this.sad.anchor.x = 0.5;
               this.sad.x = this.smile.x = this.borderSprite.width / 2;

               this.sfxBoo = this.game.add.sound('sfx-audience-boo');
               this.sfxWow = this.game.add.sound('sfx-audience-wow');

               this.add(this.smile);
               this.add(this.sad);
            }

            addValue(value:number)
            {

                super.addValue(value);
            }

            removeValue(value:number)
            {
                super.removeValue(value);

                // se der zero, dispara o evento
                if(this.value == 0)
                    this.event.dispatch(GameBase.Bar.E.LikometerEvent.OnOver);
                //

            }

            setValue(value:number)
            {
                super.setValue(value);
            }

            wow()
            {
                this.game.add.tween(this.smile).from(
                    {
                        y:this.smile.y - 10
                    }, 
                    150, 
                    Phaser.Easing.Linear.None, 
                    true, 0, 5
                ).yoyo(true).onComplete.add(()=>{
                    
                }, this);

                this.sfxWow.play();
            }

            boo()
            {
                this.game.add.tween(this.sad).from(
                    {
                        y:this.sad.y - 10
                    }, 
                    150, 
                    Phaser.Easing.Linear.None, 
                    true, 0, 5
                ).yoyo(true).onComplete.add(()=>{
                    
                }, this);

                this.sfxBoo.play();
            }

            processValue(time:number = 500)
            {
                super.processValue(time);

                if(this.value >= 100 && this.lastValue != 100)
                    this.wow();  
                //

                if(this.value <= 30 && this.lastValue > 30)
                    this.boo();
                // 

                this.lastValue = this.value;
            }
            
        }


        export module E
        {
            export module LikometerEvent
            {
                export const OnOver:string = "LikometerEventOnOver";
            }
        }
        
    }
}