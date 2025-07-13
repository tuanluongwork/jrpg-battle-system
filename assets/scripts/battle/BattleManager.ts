import { Component, _decorator } from 'cc';
import { BattleState, BattleAction, ActionType, BattleResult } from './BattleState';
import { PriorityQueue } from '../NLibrary/PriorityQueue';
import { Queue } from '../NLibrary/Queue';
import { Character } from '../characters/Character';
import { SkillManager } from '../skills/SkillManager';

const { ccclass, property } = _decorator;

/**
 * Main Battle Manager - handles battle flow and state machine
 */
@ccclass('BattleManager')
export class BattleManager extends Component {
    private currentState: BattleState = BattleState.NONE;
    private turnQueue: PriorityQueue<Character> = new PriorityQueue<Character>();
    private actionQueue: Queue<BattleAction> = new Queue<BattleAction>();
    
    private playerParty: Character[] = [];
    private enemyParty: Character[] = [];
    private currentTurnCharacter: Character | null = null;
    
    @property({ type: SkillManager })
    skillManager: SkillManager | null = null;
    
    // Events
    private onStateChange: ((state: BattleState) => void) | null = null;
    private onActionExecuted: ((action: BattleAction) => void) | null = null;
    private onBattleEnd: ((result: BattleResult) => void) | null = null;
    
    start() {
        this.initializeBattle();
    }
    
    /**
     * Initialize battle with parties
     */
    public startBattle(players: Character[], enemies: Character[]) {
        this.playerParty = players;
        this.enemyParty = enemies;
        
        this.changeState(BattleState.BATTLE_START);
    }
    
    /**
     * Change battle state
     */
    private changeState(newState: BattleState) {
        console.log(`Battle State: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        this.onStateChange?.(newState);
        
        // Process state
        switch (newState) {
            case BattleState.BATTLE_START:
                this.handleBattleStart();
                break;
            case BattleState.TURN_START:
                this.handleTurnStart();
                break;
            case BattleState.PLAYER_TURN:
                this.handlePlayerTurn();
                break;
            case BattleState.ENEMY_TURN:
                this.handleEnemyTurn();
                break;
            case BattleState.EXECUTE_ACTION:
                this.handleExecuteAction();
                break;
            case BattleState.TURN_END:
                this.handleTurnEnd();
                break;
            case BattleState.CHECK_BATTLE_END:
                this.handleCheckBattleEnd();
                break;
            case BattleState.VICTORY:
                this.handleVictory();
                break;
            case BattleState.DEFEAT:
                this.handleDefeat();
                break;
        }
    }
    
    /**
     * Initialize battle
     */
    private initializeBattle() {
        // Setup skill manager if not assigned
        if (!this.skillManager) {
            const skillManagerNode = this.node.getChildByName('SkillManager');
            if (skillManagerNode) {
                this.skillManager = skillManagerNode.getComponent(SkillManager);
            }
        }
    }
    
    /**
     * Handle battle start
     */
    private handleBattleStart() {
        // Initialize turn order based on speed
        this.turnQueue.clear();
        
        const allCharacters = [...this.playerParty, ...this.enemyParty];
        allCharacters.forEach(character => {
            if (character.isAlive()) {
                this.turnQueue.enqueue(character, character.getSpeed());
            }
        });
        
        // Start first turn
        this.scheduleOnce(() => {
            this.changeState(BattleState.TURN_START);
        }, 1.0);
    }
    
    /**
     * Handle turn start
     */
    private handleTurnStart() {
        this.currentTurnCharacter = this.turnQueue.dequeue() || null;
        
        if (!this.currentTurnCharacter) {
            // Rebuild turn queue
            this.handleBattleStart();
            return;
        }
        
        // Check if character is still alive
        if (!this.currentTurnCharacter.isAlive()) {
            this.changeState(BattleState.TURN_END);
            return;
        }
        
        // Determine if player or enemy turn
        if (this.currentTurnCharacter.isPlayerCharacter) {
            this.changeState(BattleState.PLAYER_TURN);
        } else {
            this.changeState(BattleState.ENEMY_TURN);
        }
    }
    
    /**
     * Handle player turn
     */
    private handlePlayerTurn() {
        // Enable player UI controls
        // This would be handled by the UI system
        console.log(`Player turn: ${this.currentTurnCharacter?.name}`);
    }
    
    /**
     * Handle enemy turn
     */
    private handleEnemyTurn() {
        if (!this.currentTurnCharacter) return;
        
        // Simple AI: randomly attack a player character
        const aliveTargets = this.playerParty.filter(c => c.isAlive());
        if (aliveTargets.length === 0) {
            this.changeState(BattleState.CHECK_BATTLE_END);
            return;
        }
        
        const target = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
        
        const action: BattleAction = {
            type: ActionType.ATTACK,
            actorId: this.currentTurnCharacter.id,
            targetIds: [target.id]
        };
        
        this.actionQueue.enqueue(action);
        
        // Execute after delay
        this.scheduleOnce(() => {
            this.changeState(BattleState.EXECUTE_ACTION);
        }, 1.0);
    }
    
    /**
     * Player selects action
     */
    public playerSelectAction(action: BattleAction) {
        if (this.currentState !== BattleState.PLAYER_TURN) return;
        
        this.actionQueue.enqueue(action);
        this.changeState(BattleState.EXECUTE_ACTION);
    }
    
    /**
     * Execute queued actions
     */
    private handleExecuteAction() {
        const action = this.actionQueue.dequeue();
        if (!action) {
            this.changeState(BattleState.TURN_END);
            return;
        }
        
        const actor = this.findCharacterById(action.actorId);
        if (!actor || !actor.isAlive()) {
            this.changeState(BattleState.TURN_END);
            return;
        }
        
        // Execute action based on type
        switch (action.type) {
            case ActionType.ATTACK:
                this.executeAttack(actor, action.targetIds);
                break;
            case ActionType.SKILL:
                if (action.skillId) {
                    this.executeSkill(actor, action.skillId, action.targetIds);
                }
                break;
            case ActionType.DEFEND:
                this.executeDefend(actor);
                break;
        }
        
        this.onActionExecuted?.(action);
        
        // Check for more actions or end turn
        this.scheduleOnce(() => {
            if (!this.actionQueue.isEmpty()) {
                this.handleExecuteAction();
            } else {
                this.changeState(BattleState.TURN_END);
            }
        }, 0.5);
    }
    
    /**
     * Execute basic attack
     */
    private executeAttack(actor: Character, targetIds: string[]) {
        targetIds.forEach(targetId => {
            const target = this.findCharacterById(targetId);
            if (target && target.isAlive()) {
                const damage = actor.calculatePhysicalDamage(target);
                target.takeDamage(damage);
                console.log(`${actor.name} attacks ${target.name} for ${damage} damage!`);
            }
        });
    }
    
    /**
     * Execute skill
     */
    private executeSkill(actor: Character, skillId: string, targetIds: string[]) {
        if (!this.skillManager) return;
        
        const skill = this.skillManager.getSkill(skillId);
        if (!skill) return;
        
        // Check MP cost
        if (!actor.canUseSkill(skill)) {
            console.log(`${actor.name} doesn't have enough MP!`);
            return;
        }
        
        // Use MP
        actor.useMp(skill.mpCost);
        
        // Execute skill effect
        this.skillManager.executeSkill(skill, actor, targetIds.map(id => this.findCharacterById(id)!).filter(t => t));
    }
    
    /**
     * Execute defend action
     */
    private executeDefend(actor: Character) {
        actor.setDefending(true);
        console.log(`${actor.name} is defending!`);
    }
    
    /**
     * Handle turn end
     */
    private handleTurnEnd() {
        // Reset defending status
        if (this.currentTurnCharacter) {
            this.currentTurnCharacter.setDefending(false);
            
            // Re-add to turn queue if alive
            if (this.currentTurnCharacter.isAlive()) {
                this.turnQueue.enqueue(this.currentTurnCharacter, this.currentTurnCharacter.getSpeed());
            }
        }
        
        this.currentTurnCharacter = null;
        this.changeState(BattleState.CHECK_BATTLE_END);
    }
    
    /**
     * Check if battle should end
     */
    private handleCheckBattleEnd() {
        const aliveEnemies = this.enemyParty.filter(e => e.isAlive());
        const alivePlayers = this.playerParty.filter(p => p.isAlive());
        
        if (aliveEnemies.length === 0) {
            this.changeState(BattleState.VICTORY);
        } else if (alivePlayers.length === 0) {
            this.changeState(BattleState.DEFEAT);
        } else {
            this.changeState(BattleState.TURN_START);
        }
    }
    
    /**
     * Handle victory
     */
    private handleVictory() {
        console.log("Victory!");
        
        const result: BattleResult = {
            victory: true,
            experienceGained: this.calculateExperience(),
            goldGained: this.calculateGold(),
            itemsGained: this.calculateItemDrops()
        };
        
        this.onBattleEnd?.(result);
        this.changeState(BattleState.BATTLE_END);
    }
    
    /**
     * Handle defeat
     */
    private handleDefeat() {
        console.log("Defeat!");
        
        const result: BattleResult = {
            victory: false,
            experienceGained: 0,
            goldGained: 0,
            itemsGained: []
        };
        
        this.onBattleEnd?.(result);
        this.changeState(BattleState.BATTLE_END);
    }
    
    /**
     * Find character by ID
     */
    private findCharacterById(id: string): Character | null {
        const allCharacters = [...this.playerParty, ...this.enemyParty];
        return allCharacters.find(c => c.id === id) || null;
    }
    
    /**
     * Calculate experience reward
     */
    private calculateExperience(): number {
        return this.enemyParty.reduce((total, enemy) => total + enemy.experienceReward, 0);
    }
    
    /**
     * Calculate gold reward
     */
    private calculateGold(): number {
        return this.enemyParty.reduce((total, enemy) => total + enemy.goldReward, 0);
    }
    
    /**
     * Calculate item drops
     */
    private calculateItemDrops(): string[] {
        const drops: string[] = [];
        this.enemyParty.forEach(enemy => {
            if (Math.random() < 0.3) { // 30% drop chance
                drops.push("Potion"); // Placeholder
            }
        });
        return drops;
    }
    
    /**
     * Set state change callback
     */
    public setOnStateChange(callback: (state: BattleState) => void) {
        this.onStateChange = callback;
    }
    
    /**
     * Set action executed callback
     */
    public setOnActionExecuted(callback: (action: BattleAction) => void) {
        this.onActionExecuted = callback;
    }
    
    /**
     * Set battle end callback
     */
    public setOnBattleEnd(callback: (result: BattleResult) => void) {
        this.onBattleEnd = callback;
    }
} 