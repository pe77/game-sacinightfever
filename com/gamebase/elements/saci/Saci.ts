module GameBase
{
    export module Saci
    {
        export class Saci extends Pk.PkElement
        {
            moves:Array<Move> = [];
            currentMove:Move;

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
            }
            
            addMove(move:Saci.Move)
            {
                this.moves.push(move);
            }

            playNextMove()
            {
                if(!this.moves.length)
                    return;
                //

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
                
                this.currentMove.play();

            }
        }
    }
}