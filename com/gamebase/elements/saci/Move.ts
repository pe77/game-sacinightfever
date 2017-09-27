module GameBase
{
    export module Saci
    {
        export class Move extends Pk.PkElement
        {
            spriteBase:Phaser.Sprite;
            spriteKey:string;
            animation:Phaser.Animation;
            
            fps:number = 4;
            loop:boolean = true;


            constructor(game:Pk.PkGame, spriteKey:string)
            {
                super(game);

                this.spriteKey = spriteKey;
            }

            create()
            {
                this.spriteBase = this.game.add.sprite(0, 0, this.spriteKey);
                this.animation = this.spriteBase.animations.add('dance');  

                this.add(this.spriteBase);
            }

            play()
            {
                this.spriteBase.visible = true;
                this.animation.play(this.fps, this.loop);
            }

            stop(hide:boolean = true)
            {
                this.spriteBase.visible = !hide;
                this.animation.stop();
            }
            
        }
    }
}