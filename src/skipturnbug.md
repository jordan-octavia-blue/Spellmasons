What I know:
- Happens in both multiplayer and singleplayer

Order of events:
https://discord.com/channels/@me/1096183078579359844
- Players end turn and enemies move and attack
- as soon as enemy turn is done, LOBBY syncs showing that all players turns are ended already (this is unusual)
- Start turn events trigger and "your turn" message shows, showing that executePlayerTurn has been called
- as soon as that's done, the enemies "reset" their positions and take their turn, skipping the players turn
- The "reset" is likely due to a SET_PHASE message. 
    - This must mean that the SET_PHASE message is sent (saves positions), BEFORE the player startTurn async events are called

I believe if all players have their endTurn still true, the next set phase message will come through and reset player 

The question to answer is WHY are the player's immediately set to or still at endedTurn when the enemy turn is done?
I believe that it's left ended, and somehow tryEndPlayterTurnPhase is invoked before the startTurnEvents async finishes but also without setting the players to endedTurn false somehow which doesn't make sense.  It's as if tryEndPlayerTurnPhase is called from somewhere else.
Which must be called through progressGameState.  **If progress game state is called BEFFOre endeDTurn=false is set, this could cause this to happen.**


SOLVED:
This occurred because progressGameState() was being called while startTurnForUnits was still running meaning that the players' .endedTurn state had not yet been reset to false causing the
turn to be skipped