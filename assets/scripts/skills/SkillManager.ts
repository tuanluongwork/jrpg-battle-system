import { Component, _decorator } from 'cc';
import { Skill, SkillType, ISkill, TargetType } from './Skill';
import { Character } from '../characters/Character';
import { CharacterStats } from '../characters/CharacterStats';

const { ccclass, property } = _decorator;

/**
 * Skill Manager - handles skill definitions and execution
 */
@ccclass('SkillManager')
export class SkillManager extends Component {
    private skills: Map<string, Skill> = new Map();
    
    onLoad() {
        this.initializeSkills();
    }
    
    /**
     * Initialize default skills
     */
    private initializeSkills() {
        // Physical Skills
        this.registerSkill(new Skill({
            id: 'slash',
            name: 'Slash',
            description: 'A powerful sword slash',
            type: SkillType.PHYSICAL,
            targetType: TargetType.SINGLE_ENEMY,
            mpCost: 5,
            power: 150,
            accuracy: 95,
            criticalRate: 20,
            animationId: 'slash_anim'
        }));
        
        this.registerSkill(new Skill({
            id: 'double_strike',
            name: 'Double Strike',
            description: 'Strike twice in quick succession',
            type: SkillType.PHYSICAL,
            targetType: TargetType.SINGLE_ENEMY,
            mpCost: 10,
            power: 80,
            accuracy: 90,
            criticalRate: 15,
            animationId: 'double_strike_anim'
        }));
        
        // Magical Skills
        this.registerSkill(new Skill({
            id: 'fireball',
            name: 'Fireball',
            description: 'Launch a blazing fireball',
            type: SkillType.MAGICAL,
            targetType: TargetType.SINGLE_ENEMY,
            mpCost: 8,
            power: 120,
            accuracy: 100,
            criticalRate: 10,
            particleEffectId: 'fire_particle',
            shaderEffectId: 'fire_shader'
        }));
        
        this.registerSkill(new Skill({
            id: 'ice_storm',
            name: 'Ice Storm',
            description: 'Summon a devastating ice storm',
            type: SkillType.MAGICAL,
            targetType: TargetType.ALL_ENEMIES,
            mpCost: 20,
            power: 80,
            accuracy: 100,
            criticalRate: 5,
            particleEffectId: 'ice_particle',
            shaderEffectId: 'ice_shader'
        }));
        
        // Healing Skills
        this.registerSkill(new Skill({
            id: 'heal',
            name: 'Heal',
            description: 'Restore HP to one ally',
            type: SkillType.HEALING,
            targetType: TargetType.SINGLE_ALLY,
            mpCost: 6,
            power: 50,
            accuracy: 100,
            criticalRate: 0,
            particleEffectId: 'heal_particle'
        }));
        
        this.registerSkill(new Skill({
            id: 'group_heal',
            name: 'Group Heal',
            description: 'Restore HP to all allies',
            type: SkillType.HEALING,
            targetType: TargetType.ALL_ALLIES,
            mpCost: 15,
            power: 30,
            accuracy: 100,
            criticalRate: 0,
            particleEffectId: 'heal_particle'
        }));
        
        // Buff Skills
        this.registerSkill(new Skill({
            id: 'power_boost',
            name: 'Power Boost',
            description: 'Increase attack power',
            type: SkillType.BUFF,
            targetType: TargetType.SINGLE_ALLY,
            mpCost: 8,
            power: 30,
            accuracy: 100,
            criticalRate: 0,
            effectId: 'attack_up'
        }));
        
        // Debuff Skills
        this.registerSkill(new Skill({
            id: 'slow',
            name: 'Slow',
            description: 'Reduce enemy speed',
            type: SkillType.DEBUFF,
            targetType: TargetType.SINGLE_ENEMY,
            mpCost: 5,
            power: 0,
            accuracy: 85,
            criticalRate: 0,
            effectId: 'slow'
        }));
    }
    
    /**
     * Register a skill
     */
    public registerSkill(skill: Skill): void {
        this.skills.set(skill.id, skill);
    }
    
    /**
     * Get skill by ID
     */
    public getSkill(id: string): Skill | undefined {
        return this.skills.get(id);
    }
    
    /**
     * Get all skills
     */
    public getAllSkills(): Skill[] {
        return Array.from(this.skills.values());
    }
    
    /**
     * Get skills by type
     */
    public getSkillsByType(type: SkillType): Skill[] {
        return Array.from(this.skills.values()).filter(skill => skill.type === type);
    }
    
    /**
     * Execute skill
     */
    public executeSkill(skill: Skill, caster: Character, targets: Character[]): void {
        console.log(`${caster.name} uses ${skill.name}!`);
        
        // Check hit
        if (!skill.checkHit()) {
            console.log("Miss!");
            return;
        }
        
        // Execute based on skill type
        switch (skill.type) {
            case SkillType.PHYSICAL:
                this.executePhysicalSkill(skill, caster, targets);
                break;
            case SkillType.MAGICAL:
                this.executeMagicalSkill(skill, caster, targets);
                break;
            case SkillType.HEALING:
                this.executeHealingSkill(skill, caster, targets);
                break;
            case SkillType.BUFF:
                this.executeBuffSkill(skill, caster, targets);
                break;
            case SkillType.DEBUFF:
                this.executeDebuffSkill(skill, caster, targets);
                break;
        }
        
        // Play effects
        this.playSkillEffects(skill, caster, targets);
    }
    
    /**
     * Execute physical skill
     */
    private executePhysicalSkill(skill: Skill, caster: Character, targets: Character[]): void {
        const isCritical = skill.checkCritical();
        const critMultiplier = isCritical ? skill.getCriticalMultiplier() : 1;
        
        targets.forEach(target => {
            if (target.isAlive()) {
                const baseDamage = caster.calculatePhysicalDamage(target);
                const skillDamage = Math.floor(baseDamage * (skill.power / 100) * critMultiplier);
                
                target.takeDamage(skillDamage);
                
                if (isCritical) {
                    console.log("Critical hit!");
                }
                console.log(`${target.name} takes ${skillDamage} damage!`);
            }
        });
    }
    
    /**
     * Execute magical skill
     */
    private executeMagicalSkill(skill: Skill, caster: Character, targets: Character[]): void {
        const isCritical = skill.checkCritical();
        const critMultiplier = isCritical ? skill.getCriticalMultiplier() : 1;
        
        targets.forEach(target => {
            if (target.isAlive()) {
                const baseDamage = caster.calculateMagicDamage(target);
                const skillDamage = Math.floor(baseDamage * (skill.power / 100) * critMultiplier);
                
                target.takeDamage(skillDamage);
                
                if (isCritical) {
                    console.log("Critical hit!");
                }
                console.log(`${target.name} takes ${skillDamage} damage!`);
            }
        });
    }
    
    /**
     * Execute healing skill
     */
    private executeHealingSkill(skill: Skill, caster: Character, targets: Character[]): void {
        targets.forEach(target => {
            if (target.isAlive()) {
                const healAmount = CharacterStats.calculateHealing(caster.stats, skill.power);
                const actualHealing = target.heal(healAmount);
                
                console.log(`${target.name} recovers ${actualHealing} HP!`);
            }
        });
    }
    
    /**
     * Execute buff skill
     */
    private executeBuffSkill(skill: Skill, caster: Character, targets: Character[]): void {
        targets.forEach(target => {
            if (target.isAlive() && skill.effectId) {
                // Apply buff effect
                target.addStatusEffect(skill.effectId, 3); // 3 turns duration
                
                // Apply stat modifications based on effect
                switch (skill.effectId) {
                    case 'attack_up':
                        target.stats.attack = Math.floor(target.stats.attack * 1.3);
                        console.log(`${target.name}'s attack increased!`);
                        break;
                    case 'defense_up':
                        target.stats.defense = Math.floor(target.stats.defense * 1.3);
                        console.log(`${target.name}'s defense increased!`);
                        break;
                    case 'haste':
                        // Speed boost is handled in Character.getSpeed()
                        console.log(`${target.name}'s speed increased!`);
                        break;
                }
            }
        });
    }
    
    /**
     * Execute debuff skill
     */
    private executeDebuffSkill(skill: Skill, caster: Character, targets: Character[]): void {
        targets.forEach(target => {
            if (target.isAlive() && skill.effectId) {
                // Apply debuff effect
                target.addStatusEffect(skill.effectId, 3); // 3 turns duration
                
                // Apply stat modifications based on effect
                switch (skill.effectId) {
                    case 'attack_down':
                        target.stats.attack = Math.floor(target.stats.attack * 0.7);
                        console.log(`${target.name}'s attack decreased!`);
                        break;
                    case 'defense_down':
                        target.stats.defense = Math.floor(target.stats.defense * 0.7);
                        console.log(`${target.name}'s defense decreased!`);
                        break;
                    case 'slow':
                        // Speed reduction is handled in Character.getSpeed()
                        console.log(`${target.name}'s speed decreased!`);
                        break;
                }
            }
        });
    }
    
    /**
     * Play skill visual and audio effects
     */
    private playSkillEffects(skill: Skill, caster: Character, targets: Character[]): void {
        // This would trigger animations, particles, and shader effects
        // Implementation depends on Cocos Creator's animation and particle systems
        
        if (skill.animationId) {
            // Play animation
            console.log(`Playing animation: ${skill.animationId}`);
        }
        
        if (skill.particleEffectId) {
            // Play particle effect
            console.log(`Playing particle effect: ${skill.particleEffectId}`);
        }
        
        if (skill.shaderEffectId) {
            // Apply shader effect
            console.log(`Applying shader effect: ${skill.shaderEffectId}`);
        }
    }
}

// Export TargetType for use in SkillManager
export { TargetType } from './Skill'; 