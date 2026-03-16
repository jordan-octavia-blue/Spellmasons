import Underworld from "./Underworld";
import * as config from './config';
export function calculateGameDifficulty(underworld: Underworld) {
    const plusLevelNumber = Math.max(0, (underworld.levelIndex - config.LAST_LEVEL_INDEX));
    // loopDifficultyModifier should be 0 if plusLevelNumber is not >0.
    // +2 so that n*log(n) is not negative
    const loopDifficultyModifier = plusLevelNumber <= 0 ? 0 : (plusLevelNumber + 2) * Math.log10(plusLevelNumber + 2);
    const connectedPlayers = underworld.players.filter(p => p.clientConnected).length;
    const cappedPlayers = Math.min(connectedPlayers, 2);
    let difficulty = cappedPlayers + loopDifficultyModifier;
    console.log('Difficulty: Health scaling from players:', cappedPlayers + 'x (', connectedPlayers, 'connected, capped at 2)');
    if (underworld.gameMode == 'hard') {
        difficulty *= 1.2;
    }
    if (underworld.gameMode == 'impossible') {
        difficulty *= 1.5;
    }
    // 'custom' mode uses base difficulty (no multiplier)
    return difficulty;
}
export function getPlayerSimulatedLevelBonus(underworld: Underworld): number {
    const connectedPlayers = underworld.players.filter(p => p.clientConnected).length;
    return Math.max(0, connectedPlayers - 2);
}
export function unavailableUntilLevelIndexDifficultyModifier(underworld: Underworld): {
    budgetMultiplier: number,
    unitMinLevelIndexSubtractor: number
} {
    if (underworld.gameMode == 'tutorial') {
        return {
            budgetMultiplier: 0.8,
            unitMinLevelIndexSubtractor: 0
        }
    } else if (underworld.gameMode == 'hard') {
        return {
            budgetMultiplier: 1.5,
            unitMinLevelIndexSubtractor: 2
        }
    } else if (underworld.gameMode == 'impossible') {
        return {
            budgetMultiplier: 2,
            unitMinLevelIndexSubtractor: 4
        }

    }
    // 'custom' and 'normal' (undefined) use default values
    return {
        budgetMultiplier: 1,
        unitMinLevelIndexSubtractor: 0
    }
}