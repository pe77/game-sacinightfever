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
                console.log('CREATING STEP')

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

            kill(hit:boolean)
            {
                var time:number = 300;

                // se acertou anima pra direção 
                if(hit)
                {
                    var x:number = 0;
                    var y:number = 0;

                    var distance:number = 100;
                    

                    switch(this.direction)
                    {
                        case GameBase.Step.Direction.TOP:
                            y -= distance;
                            break;

                        case GameBase.Step.Direction.DOWN:
                            y += distance;
                            break;

                        case GameBase.Step.Direction.LEFT:
                            x -= distance;
                            break;

                        case GameBase.Step.Direction.RIGHT:
                            x += distance;
                            break;
                    }

                    var tween:Phaser.Tween = this.addTween(this).to(
                        {
                            alpha:0,
                            y:y,
                            x:x
                        }, 
                        time, 
                        Phaser.Easing.Back.Out, true
                    );

                    tween.onComplete.add(()=>{
                        this.destroy();
                    }, this);
                    
                }else{

                    // centraliza
                    this.bg.anchor.set(0.5, 0.5);
                    this.x += this.width  / 2;
                    this.y += this.height / 2;

                    var tween:Phaser.Tween = this.addTween(this).to(
                        {
                            rotation:5,
                            width:this.width * 2,
                            height:this.height * 2,
                            alpha:0
                        }, 
                        time, 
                        Phaser.Easing.Back.Out, true
                    );

                    tween.onComplete.add(()=>{
                        this.destroy();
                    }, this);
                }

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