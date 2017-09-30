module GameBase
{
    export module Step
    {
        export class Base extends Pk.PkElement
        {
            back:Phaser.Sprite;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                console.log('creating BASE')
                this.back = this.game.add.sprite(0, 0, 'step-back');
                // this.back = Pk.PkUtils.createSquare(this.game, 60, 60);
                // this.back.alpha = 0.7;

                this.back.anchor.set(0.5, 0.5);
                this.back.x += this.back.width / 2;
                this.back.y += this.back.height / 2;

                this.game.add.tween(this.back.scale).to(
                {
                    x:1.1,
                    y:1.1
                }, 
                    300, 
                    Phaser.Easing.Linear.None, 
                    true, 0, -1
                ).yoyo(true);
                

                this.add(this.back);
            }
        }
    }
}