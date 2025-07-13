import { Component, _decorator, Sprite, Node } from 'cc';
import { CharacterStats } from './CharacterStats';
import { Skill } from '../skills/Skill';

const { ccclass, property } = _decorator;

/**
 * Character class representing both player and enemy characters
 */
@ccclass('Character')
export class Character extends Component {
    @property
    id: string = '';
    
    @property
    name: string = 'Character';
    
    @property
    isPlayerCharacter: boolean = true;
    
    @property({ type: CharacterStats })
    stats: CharacterStats = new CharacterStats();
    
    @property
    experienceReward: number = 100;
    
    @property
    goldReward: number = 50;
    
    // Runtime properties
    private isDefending: boolean = false;
    private statusEffects: Map<string, number> = new Map();
    
    // Visual components
    @property({ type: Sprite })
    sprite: Sprite | null = null;
    
    @property({ type: Node })
    healthBar: Node | null = null;
    
    @property({ type: Node })
    mpBar: Node | null = null;
    
    onLoad() {
        // Generate unique ID if not set
        if (!this.id) {
            this.id = `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
    }
    
    /**
     * Check if character is alive
     */
    isAlive(): boolean {
        return this.stats.isAlive();
    }
    
    /**
     * Get character speed for turn order
     */
    getSpeed(): number {
        let speed = this.stats.speed;
        
        // Apply status effect modifiers
        if (this.statusEffects.has('haste')) {
            speed *= 1.5;
        }
        if (this.statusEffects.has('slow')) {
            speed *= 0.5;
        }
        
        return speed;
    }
    
    /**
     * Calculate physical damage to target
     */
    calculatePhysicalDamage(target: Character): number {
        const attackerStats = this.stats;
        const defenderStats = target.stats;
        
        // Apply defending modifier
        if (target.isDefending) {
            defenderStats.defense *= 2;
        }
        
        const damage = CharacterStats.calculatePhysicalDamage(attackerStats, defenderStats);
        
        // Reset defense if defending
        if (target.isDefending) {
            defenderStats.defense /= 2;
        }
        
        return damage;
    }
    
    /**
     * Calculate magic damage to target
     */
    calculateMagicDamage(target: Character): number {
        const damage = CharacterStats.calculateMagicDamage(this.stats, target.stats);
        return target.isDefending ? Math.floor(damage * 0.7) : damage;
    }
    
    /**
     * Take damage
     */
    takeDamage(damage: number): number {
        const actualDamage = this.stats.takeDamage(damage);
        this.updateHealthBar();
        
        // Play damage animation
        this.playDamageAnimation();
        
        return actualDamage;
    }
    
    /**
     * Heal character
     */
    heal(amount: number): number {
        const actualHealing = this.stats.heal(amount);
        this.updateHealthBar();
        
        // Play heal animation
        this.playHealAnimation();
        
        return actualHealing;
    }
    
    /**
     * Use MP
     */
    useMp(amount: number): boolean {
        const success = this.stats.useMp(amount);
        if (success) {
            this.updateMpBar();
        }
        return success;
    }
    
    /**
     * Restore MP
     */
    restoreMp(amount: number): number {
        const restored = this.stats.restoreMp(amount);
        this.updateMpBar();
        return restored;
    }
    
    /**
     * Check if character can use skill
     */
    canUseSkill(skill: Skill): boolean {
        return this.stats.mp >= skill.mpCost;
    }
    
    /**
     * Set defending status
     */
    setDefending(defending: boolean): void {
        this.isDefending = defending;
    }
    
    /**
     * Add status effect
     */
    addStatusEffect(effect: string, duration: number): void {
        this.statusEffects.set(effect, duration);
    }
    
    /**
     * Remove status effect
     */
    removeStatusEffect(effect: string): void {
        this.statusEffects.delete(effect);
    }
    
    /**
     * Update status effects (called each turn)
     */
    updateStatusEffects(): void {
        this.statusEffects.forEach((duration, effect) => {
            if (duration <= 1) {
                this.statusEffects.delete(effect);
            } else {
                this.statusEffects.set(effect, duration - 1);
            }
        });
    }
    
    /**
     * Update health bar visual
     */
    private updateHealthBar(): void {
        if (!this.healthBar) return;
        
        const healthPercent = this.stats.hp / this.stats.maxHp;
        this.healthBar.setScale(healthPercent, 1, 1);
    }
    
    /**
     * Update MP bar visual
     */
    private updateMpBar(): void {
        if (!this.mpBar) return;
        
        const mpPercent = this.stats.mp / this.stats.maxMp;
        this.mpBar.setScale(mpPercent, 1, 1);
    }
    
    /**
     * Play damage animation
     */
    private playDamageAnimation(): void {
        if (!this.sprite) return;
        
        // Simple flash red effect
        const originalColor = this.sprite.color.clone();
        this.sprite.color = new cc.Color(255, 100, 100);
        
        this.scheduleOnce(() => {
            if (this.sprite) {
                this.sprite.color = originalColor;
            }
        }, 0.2);
    }
    
    /**
     * Play heal animation
     */
    private playHealAnimation(): void {
        if (!this.sprite) return;
        
        // Simple flash green effect
        const originalColor = this.sprite.color.clone();
        this.sprite.color = new cc.Color(100, 255, 100);
        
        this.scheduleOnce(() => {
            if (this.sprite) {
                this.sprite.color = originalColor;
            }
        }, 0.3);
    }
    
    /**
     * Initialize character for battle
     */
    initializeForBattle(): void {
        this.isDefending = false;
        this.statusEffects.clear();
        this.updateHealthBar();
        this.updateMpBar();
    }
} 