/// <reference path='Vertical.ts' />

module GameBase
{
    export module Bar
    {
        export class Likometer extends Vertical
        {
            
            sad:Phaser.Sprite;
            smile:Phaser.Sprite;

            constructor(game:Pk.PkGame, backSprite:Phaser.Sprite, barSprite:Phaser.Sprite, borderSprite:Phaser.Sprite)
            {
                super(game, backSprite, barSprite, borderSprite);
            }

            create()
            {
                
               super.create();

               this.smile = this.game.add.sprite(0, 0, 'likebar-smile');
               this.sad = this.game.add.sprite(0, 0, 'likebar-sad');

               // coloca acime a abaixo da barra
               var padding = 10;
               this.smile.y -= this.smile.height + padding;
               this.sad.y += this.borderSprite.height + padding;

               this.smile.anchor.x = this.sad.anchor.x = 0.5;
               this.sad.x = this.smile.x = this.borderSprite.width / 2;

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