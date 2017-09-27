module GameBase
{
    export module Saci
    {
        export class Move3 extends Move
        {

            constructor(game:Pk.PkGame)
            {
                super(game, 'saci-move3');
            }

            create()
            {
                super.create();
            }
        }
    }
}