module GameBase
{
    export module Saci
    {
        export class Saci extends Pk.PkElement
        {
            moves:Array<Move> = [];
            currentMove:Move;
            wrong:Phaser.Sprite;

            constructor(game:Pk.PkGame)
            {
                super(game);
            }

            create()
            {
                this.moves.forEach(move=>{
                    
                    move.create();

                    move.stop();

                    this.add(move);
                });

                this.wrong = this.game.add.sprite(0, 0, 'saci-wrong');
                this.wrong.visible = false;

                this.wrong.anchor.set(0.5, 0.5)
                this.wrong.x = (this.wrong.width / 2) - 30;
                this.wrong.y = (this.wrong.height / 2) + 65;

                this.add(this.wrong);
            }
            
            addMove(move:Saci.Move)
            {
                this.moves.push(move);
            }

            wrongMove()
            {
                console.log('--- wrongMove 22')
                if(this.currentMove)
                    this.currentMove.visible = false;
                //

                this.wrong.visible = true;
                
                

                this.game.add.tween(this.wrong).to(
                    {
                        rotation:1.1
                    }, 
                    150, 
                    Phaser.Easing.Linear.None, 
                    true, 0, 5
                ).yoyo(true).onComplete.add(()=>{
                    console.log('------ complete')
                    this.wrong.visible = false;

                    this.wrong.rotation = 1;

                }, this);
                
            }

            playNextMove()
            {
                if(!this.moves.length)
                    return;
                //

                this.wrong.visible = false;

                for(var i in this.moves)
                {
                    this.moves[i].stop();

                    if(this.currentMove == this.moves[i])
                    {
                        var index:number = parseInt(i);

                        if( (index+1) == this.moves.length)
                        {
                            this.currentMove = this.moves[0];
                            break;
                        }else{
                            this.currentMove = this.moves[index+1];
                            break;
                        }
                    }
                }

                if(!this.currentMove)
                    this.currentMove = this.moves[0];
                //

                this.currentMove.visible = true;
                
                this.currentMove.play();

            }
        }
    }
}