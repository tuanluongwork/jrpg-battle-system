import { Component, _decorator, Button, Label, Node, Layout } from 'cc';
import { BattleManager } from '../battle/BattleManager';
import { BattleState, ActionType, BattleAction } from '../battle/BattleState';
import { Character } from '../characters/Character';
import { SkillManager, TargetType } from '../skills/SkillManager';
import { Skill } from '../skills/Skill';

const { ccclass, property } = _decorator;

/**
 * Battle UI Controller
 */
@ccclass('BattleUI')
export class BattleUI extends Component {
    @property({ type: BattleManager })
    battleManager: BattleManager | null = null;
    
    @property({ type: SkillManager })
    skillManager: SkillManager | null = null;
    
    // UI Elements
    @property({ type: Node })
    actionMenu: Node | null = null;
    
    @property({ type: Node })
    skillMenu: Node | null = null;
    
    @property({ type: Node })
    targetMenu: Node | null = null;
    
    @property({ type: Node })
    battleLog: Node | null = null;
    
    @property({ type: Label })
    turnIndicator: Label | null = null;
    
    @property({ type: Layout })
    skillListLayout: Layout | null = null;
    
    @property({ type: Layout })
    targetListLayout: Layout | null = null;
    
    // Current selection state
    private currentAction: ActionType | null = null;
    private selectedSkill: Skill | null = null;
    private selectedTargets: string[] = [];
    private currentCharacter: Character | null = null;
    
    onLoad() {
        this.setupUI();
        this.bindBattleEvents();
    }
    
    /**
     * Setup initial UI state
     */
    private setupUI() {
        this.hideAllMenus();
        
        // Setup action buttons
        this.setupActionButtons();
    }
    
    /**
     * Bind battle manager events
     */
    private bindBattleEvents() {
        if (!this.battleManager) return;
        
        this.battleManager.setOnStateChange((state) => {
            this.handleStateChange(state);
        });
        
        this.battleManager.setOnActionExecuted((action) => {
            this.logAction(action);
        });
    }
    
    /**
     * Setup action menu buttons
     */
    private setupActionButtons() {
        if (!this.actionMenu) return;
        
        // Attack button
        const attackBtn = this.actionMenu.getChildByName('AttackButton');
        if (attackBtn) {
            const button = attackBtn.getComponent(Button);
            if (button) {
                button.node.on('click', () => this.onAttackSelected(), this);
            }
        }
        
        // Skill button
        const skillBtn = this.actionMenu.getChildByName('SkillButton');
        if (skillBtn) {
            const button = skillBtn.getComponent(Button);
            if (button) {
                button.node.on('click', () => this.onSkillMenuSelected(), this);
            }
        }
        
        // Defend button
        const defendBtn = this.actionMenu.getChildByName('DefendButton');
        if (defendBtn) {
            const button = defendBtn.getComponent(Button);
            if (button) {
                button.node.on('click', () => this.onDefendSelected(), this);
            }
        }
        
        // Item button
        const itemBtn = this.actionMenu.getChildByName('ItemButton');
        if (itemBtn) {
            const button = itemBtn.getComponent(Button);
            if (button) {
                button.node.on('click', () => this.onItemMenuSelected(), this);
            }
        }
    }
    
    /**
     * Handle battle state changes
     */
    private handleStateChange(state: BattleState) {
        switch (state) {
            case BattleState.PLAYER_TURN:
                this.showActionMenu();
                this.updateTurnIndicator("Player Turn");
                break;
            case BattleState.ENEMY_TURN:
                this.hideAllMenus();
                this.updateTurnIndicator("Enemy Turn");
                break;
            case BattleState.VICTORY:
                this.hideAllMenus();
                this.showVictoryScreen();
                break;
            case BattleState.DEFEAT:
                this.hideAllMenus();
                this.showDefeatScreen();
                break;
            default:
                this.hideAllMenus();
                break;
        }
    }
    
    /**
     * Show action menu
     */
    private showActionMenu() {
        this.hideAllMenus();
        if (this.actionMenu) {
            this.actionMenu.active = true;
        }
    }
    
    /**
     * Hide all menus
     */
    private hideAllMenus() {
        if (this.actionMenu) this.actionMenu.active = false;
        if (this.skillMenu) this.skillMenu.active = false;
        if (this.targetMenu) this.targetMenu.active = false;
    }
    
    /**
     * Attack selected
     */
    private onAttackSelected() {
        this.currentAction = ActionType.ATTACK;
        this.showTargetMenu(false); // Show enemy targets
    }
    
    /**
     * Skill menu selected
     */
    private onSkillMenuSelected() {
        this.currentAction = ActionType.SKILL;
        this.showSkillMenu();
    }
    
    /**
     * Defend selected
     */
    private onDefendSelected() {
        if (!this.battleManager || !this.currentCharacter) return;
        
        const action: BattleAction = {
            type: ActionType.DEFEND,
            actorId: this.currentCharacter.id,
            targetIds: []
        };
        
        this.battleManager.playerSelectAction(action);
        this.hideAllMenus();
    }
    
    /**
     * Item menu selected
     */
    private onItemMenuSelected() {
        // TODO: Implement item system
        console.log("Item system not yet implemented");
    }
    
    /**
     * Show skill menu
     */
    private showSkillMenu() {
        if (!this.skillMenu || !this.skillManager || !this.skillListLayout) return;
        
        this.hideAllMenus();
        this.skillMenu.active = true;
        
        // Clear existing skill buttons
        this.skillListLayout.node.removeAllChildren();
        
        // Get available skills
        const skills = this.skillManager.getAllSkills();
        
        // Create skill buttons
        skills.forEach(skill => {
            const skillButton = new Node(skill.name);
            const button = skillButton.addComponent(Button);
            const label = skillButton.addComponent(Label);
            
            label.string = `${skill.name} (MP: ${skill.mpCost})`;
            
            button.node.on('click', () => {
                this.onSkillSelected(skill);
            }, this);
            
            this.skillListLayout.node.addChild(skillButton);
        });
    }
    
    /**
     * Skill selected
     */
    private onSkillSelected(skill: Skill) {
        this.selectedSkill = skill;
        
        // Determine if we need to show target menu
        switch (skill.targetType) {
            case TargetType.SINGLE_ENEMY:
            case TargetType.ALL_ENEMIES:
                this.showTargetMenu(false);
                break;
            case TargetType.SINGLE_ALLY:
            case TargetType.ALL_ALLIES:
                this.showTargetMenu(true);
                break;
            case TargetType.SELF:
                this.executeSkillAction([this.currentCharacter!.id]);
                break;
        }
    }
    
    /**
     * Show target selection menu
     */
    private showTargetMenu(showAllies: boolean) {
        if (!this.targetMenu || !this.targetListLayout || !this.battleManager) return;
        
        this.hideAllMenus();
        this.targetMenu.active = true;
        
        // Clear existing target buttons
        this.targetListLayout.node.removeAllChildren();
        
        // Get available targets
        const targets = showAllies ? 
            this.battleManager['playerParty'] : 
            this.battleManager['enemyParty'];
        
        // Create target buttons
        targets.forEach((character: Character) => {
            if (character.isAlive()) {
                const targetButton = new Node(character.name);
                const button = targetButton.addComponent(Button);
                const label = targetButton.addComponent(Label);
                
                label.string = `${character.name} (HP: ${character.stats.hp}/${character.stats.maxHp})`;
                
                button.node.on('click', () => {
                    this.onTargetSelected(character.id);
                }, this);
                
                this.targetListLayout.node.addChild(targetButton);
            }
        });
        
        // Add "All" button for AOE skills
        if (this.selectedSkill && 
            (this.selectedSkill.targetType === TargetType.ALL_ENEMIES || 
             this.selectedSkill.targetType === TargetType.ALL_ALLIES)) {
            const allButton = new Node("All");
            const button = allButton.addComponent(Button);
            const label = allButton.addComponent(Label);
            
            label.string = "All Targets";
            
            button.node.on('click', () => {
                const allTargetIds = targets
                    .filter((c: Character) => c.isAlive())
                    .map((c: Character) => c.id);
                this.executeAction(allTargetIds);
            }, this);
            
            this.targetListLayout.node.addChild(allButton);
        }
    }
    
    /**
     * Target selected
     */
    private onTargetSelected(targetId: string) {
        this.executeAction([targetId]);
    }
    
    /**
     * Execute the selected action
     */
    private executeAction(targetIds: string[]) {
        if (!this.battleManager || !this.currentCharacter) return;
        
        if (this.currentAction === ActionType.SKILL && this.selectedSkill) {
            this.executeSkillAction(targetIds);
        } else if (this.currentAction === ActionType.ATTACK) {
            const action: BattleAction = {
                type: ActionType.ATTACK,
                actorId: this.currentCharacter.id,
                targetIds: targetIds
            };
            
            this.battleManager.playerSelectAction(action);
        }
        
        this.resetSelection();
        this.hideAllMenus();
    }
    
    /**
     * Execute skill action
     */
    private executeSkillAction(targetIds: string[]) {
        if (!this.battleManager || !this.currentCharacter || !this.selectedSkill) return;
        
        const action: BattleAction = {
            type: ActionType.SKILL,
            actorId: this.currentCharacter.id,
            targetIds: targetIds,
            skillId: this.selectedSkill.id
        };
        
        this.battleManager.playerSelectAction(action);
    }
    
    /**
     * Reset selection state
     */
    private resetSelection() {
        this.currentAction = null;
        this.selectedSkill = null;
        this.selectedTargets = [];
    }
    
    /**
     * Update turn indicator
     */
    private updateTurnIndicator(text: string) {
        if (this.turnIndicator) {
            this.turnIndicator.string = text;
        }
    }
    
    /**
     * Log battle action
     */
    private logAction(action: BattleAction) {
        // TODO: Implement battle log
        console.log("Battle action:", action);
    }
    
    /**
     * Show victory screen
     */
    private showVictoryScreen() {
        this.updateTurnIndicator("Victory!");
        // TODO: Show detailed victory screen with rewards
    }
    
    /**
     * Show defeat screen
     */
    private showDefeatScreen() {
        this.updateTurnIndicator("Defeat...");
        // TODO: Show defeat screen with retry option
    }
    
    /**
     * Set current character for turn
     */
    public setCurrentCharacter(character: Character) {
        this.currentCharacter = character;
    }
} 