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
                this.back = Pk.PkUtils.createSquare(this.game, 60, 60);
                this.back.alpha = 0.7;

                this.add(this.back);
            }
        }
    }
}