module GameBase
{
    export module Saci
    {
        export class Move1 extends Move
        {

            constructor(game:Pk.PkGame)
            {
                super(game, 'saci-move1');
            }

            create()
            {
                super.create();
            }
        }
    }
}