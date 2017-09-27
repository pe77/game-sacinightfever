module GameBase
{
    export module Audience
    {
        export class Audience extends Pk.PkElement
        {
            leftSprite:Phaser.Sprite;
            rightSprite:Phaser.Sprite;
            middleTileSprite:Phaser.TileSprite;

            tween:Phaser.Tween;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                // add os sprites da lateral, nas laterais. ORA BOLAS...
                this.leftSprite = this.game.add.sprite(0, 0, 'aud-left');
                this.rightSprite = this.game.add.sprite(0, 0, 'aud-right');

                this.leftSprite.x = 0;
                this.leftSprite.y = this.game.world.height - this.leftSprite.height;

                this.rightSprite.x = this.game.world.width - this.rightSprite.width;
                this.rightSprite.y = this.game.world.height - this.rightSprite.height;

                // a parte do meio
                this.middleTileSprite = this.game.add.tileSprite(0, 0, this.game.world.width, 100, 'aud-middle');
                this.middleTileSprite.y = this.game.world.height - this.middleTileSprite.height;
                console.log('---- foi')

                this.add(this.rightSprite);
                this.add(this.leftSprite);
                this.add(this.middleTileSprite);
            }

            pulse()
            {
                // se houver alguma animação, pausa
                if(this.tween)
                    this.tween.stop(true);
                //

                this.tween = this.addTween(this).to(
                    {
                        y:this.y+10
                    }, 
                    200, 
                    Phaser.Easing.Linear.None, 
                    true, 0, -1
                );

                this.tween.yoyo(true);

                console.log('AUDIENCE PULSE')
            }
        }
    }
}