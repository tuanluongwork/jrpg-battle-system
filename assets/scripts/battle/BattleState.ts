/**
 * Battle states for the state machine
 */
export enum BattleState {
    NONE = "NONE",
    BATTLE_START = "BATTLE_START",
    TURN_START = "TURN_START",
    PLAYER_TURN = "PLAYER_TURN",
    ENEMY_TURN = "ENEMY_TURN",
    EXECUTE_ACTION = "EXECUTE_ACTION",
    TURN_END = "TURN_END",
    CHECK_BATTLE_END = "CHECK_BATTLE_END",
    VICTORY = "VICTORY",
    DEFEAT = "DEFEAT",
    BATTLE_END = "BATTLE_END"
}

/**
 * Battle action types
 */
export enum ActionType {
    ATTACK = "ATTACK",
    SKILL = "SKILL",
    ITEM = "ITEM",
    DEFEND = "DEFEND",
    FLEE = "FLEE"
}

/**
 * Battle action interface
 */
export interface BattleAction {
    type: ActionType;
    actorId: string;
    targetIds: string[];
    skillId?: string;
    itemId?: string;
}

/**
 * Battle result interface
 */
export interface BattleResult {
    victory: boolean;
    experienceGained: number;
    goldGained: number;
    itemsGained: string[];
} 