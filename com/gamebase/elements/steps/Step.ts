module GameBase
{
    export module Step
    {
        export class Step extends Pk.PkElement
        {
            direction:Step.Direction;
            bg:Phaser.Sprite;

            constructor(game:Pk.PkGame, direction:Step.Direction)
            {
                super(game);

                this.direction = direction;
            }

            create()
            {
                // var bodySprite:Phaser.Sprite = Pk.PkUtils.createSquare(this.game, 50, 50);

                var spriteName = 'step-';
                switch(this.direction)
                {
                    case GameBase.Step.Direction.DOWN:
                        spriteName += 'down';
                        break;

                    case GameBase.Step.Direction.LEFT:
                        spriteName += 'left';
                        break;

                    case GameBase.Step.Direction.TOP:
                        spriteName += 'top';
                        break;

                    case GameBase.Step.Direction.RIGHT:
                        spriteName += 'right';
                        break;
                }

                this.bg = this.game.add.sprite(0, 0, spriteName);

                this.add(this.bg);
                
                
            }

            static getRandomDirection():Step.Direction
            {
                var randomDirection:Step.Direction;
                var game:Pk.PkGame = Pk.PkGame.game;

				switch(game.rnd.integerInRange(1, 4))
				{
					case 1:
						randomDirection = GameBase.Step.Direction.TOP;
						break;
					
					case 2:
						randomDirection = GameBase.Step.Direction.DOWN;
						break;

					case 3:
						randomDirection = GameBase.Step.Direction.LEFT;
						break;

					case 4:
						randomDirection = GameBase.Step.Direction.RIGHT;
						break;
				}

                return randomDirection;
            }
        }

        export module E 
        {
            /*
            export module AttackBoxEvent
            {
                export const OnAttackSelect:string 	= "OnAttackSelect";
            }
            */
        }

        export enum Direction
        {
            TOP,
            LEFT,
            DOWN,
            RIGHT
        }

    }
}