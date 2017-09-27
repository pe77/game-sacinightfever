module GameBase
{
    export module Saci
    {
        export class Move2 extends Move
        {

            constructor(game:Pk.PkGame)
            {
                super(game, 'saci-move2');
            }

            create()
            {
                super.create();
            }
        }
    }
}