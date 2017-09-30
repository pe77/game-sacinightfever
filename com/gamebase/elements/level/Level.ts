module GameBase
{
    export module Level
    {
        export class Level extends Pk.PkElement
        {
            text:Phaser.Text;
            bg:Phaser.Sprite;
            level:number = 1;
            originalX:number;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                this.text = this.game.add.text(0, 0,
                    "", // text
                    {
                        font: "28px Love Story Rough",
                        fill: "#fff"
                    } // font style
                );

                this.text.padding.x = 10;

                this.bg = this.game.add.sprite(0, 0, 'level-bg');
                this.bg.alpha = 0.7;

                this.text.text = "";
                // this.text.textBounds.
                // this.text.width += 100;
                // this.text.x = this.bg.width;
                // this.text.y = this.bg.height / 2 - 10;
                this.text.setShadow(2, 2, '#53514b', 1);

                this.text.x += 20;
                this.text.anchor.y = 0.5;
                this.text.y = (this.bg.height / 2);
                this.text.y += 5;

                this.add(this.bg);
                this.add(this.text);

                this.addTween(this).from(
                    {
                        x:this.x - this.width
                    }, 
                    400, 
                    Phaser.Easing.Back.Out, 
                    true,
                    200
                );


                this.processLevel();
            }

            setLevel(level:number)
            {
                if(!this.originalX)
                    this.originalX = this.x;
                //

                this.level = level < 1 ? 1 : level;
                this.processLevel();
            }

            reset()
            {
                this.level = 1;
                this.processLevel();
            }

            private processLevel()
            {
                this.text.text = 'Nivel  ' + this.level + ' / 12';

                // faz uma animaçãozinha basica
                this.x = this.originalX;
                
                var t:Phaser.Tween = this.addTween(this).from(
                    {
                        x:this.x-20
                    }, 
                    200, 
                    Phaser.Easing.Back.Out, 
                    true, 0, 0
                );

                t.yoyo(true);

            }
        }
        
    }
}