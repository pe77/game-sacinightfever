module GameBase
{
    export module Score
    {
        export class Score extends Pk.PkElement
        {
            text:Phaser.Text;
            money:Phaser.Sprite;
            value:number = 0;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                this.text = this.game.add.text(0, 0,
                    "", // text
                    {
                        font: "32px California",
                        fill: "#fff"
                    } // font style
                );

                this.text.padding.x = 10;

                this.money = this.game.add.sprite(0, 0, 'score-money');

                this.text.text = "x " + this.value;
                // this.text.textBounds.
                // this.text.width += 100;
                this.text.x = this.money.width;
                this.text.y = this.money.height / 2 - 10;
                this.text.setShadow(2, 2, '#53514b', 1);

                this.add(this.money);
                this.add(this.text);
            }

            addValue(value:number)
            {
                this.value += value;
                this.text.text = 'x ' + this.value;
            }

            setValue(value:number)
            {
                this.value = value < 0 ? 0 : value;
                this.text.text = 'x ' + this.value;
            }

            removeValue(value:number)
            {
                this.value -= value;
                this.value = this.value < 0 ? 0 : this.value;
                this.text.text = 'x ' + this.value;

                // se der zero, dispara o evento
                if(this.value == 0)
                    this.event.dispatch(GameBase.Score.E.ScoreEvent.OnOverScore);
                //
            }

            reset()
            {
                this.value = 0;
                this.text.text = 'x ' + this.value;
            }
        }

        export module E
        {
            export module ScoreEvent
            {
                export const OnOverScore:string = "ScoreEventOnOverScore";
            }
        }
        
    }
}