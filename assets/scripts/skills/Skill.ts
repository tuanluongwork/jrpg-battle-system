/**
 * Skill type enum
 */
export enum SkillType {
    PHYSICAL = "PHYSICAL",
    MAGICAL = "MAGICAL",
    HEALING = "HEALING",
    BUFF = "BUFF",
    DEBUFF = "DEBUFF"
}

/**
 * Skill target type
 */
export enum TargetType {
    SINGLE_ENEMY = "SINGLE_ENEMY",
    ALL_ENEMIES = "ALL_ENEMIES",
    SINGLE_ALLY = "SINGLE_ALLY",
    ALL_ALLIES = "ALL_ALLIES",
    SELF = "SELF"
}

/**
 * Skill interface
 */
export interface ISkill {
    id: string;
    name: string;
    description: string;
    type: SkillType;
    targetType: TargetType;
    mpCost: number;
    power: number;
    accuracy: number;
    criticalRate: number;
    effectId?: string;
    animationId?: string;
    particleEffectId?: string;
    shaderEffectId?: string;
}

/**
 * Base Skill class
 */
export class Skill implements ISkill {
    id: string;
    name: string;
    description: string;
    type: SkillType;
    targetType: TargetType;
    mpCost: number;
    power: number;
    accuracy: number;
    criticalRate: number;
    effectId?: string;
    animationId?: string;
    particleEffectId?: string;
    shaderEffectId?: string;
    
    constructor(data: ISkill) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
        this.targetType = data.targetType;
        this.mpCost = data.mpCost;
        this.power = data.power;
        this.accuracy = data.accuracy;
        this.criticalRate = data.criticalRate;
        this.effectId = data.effectId;
        this.animationId = data.animationId;
        this.particleEffectId = data.particleEffectId;
        this.shaderEffectId = data.shaderEffectId;
    }
    
    /**
     * Check if skill hits based on accuracy
     */
    checkHit(): boolean {
        return Math.random() * 100 < this.accuracy;
    }
    
    /**
     * Check if skill is critical hit
     */
    checkCritical(): boolean {
        return Math.random() * 100 < this.criticalRate;
    }
    
    /**
     * Get damage multiplier for critical hits
     */
    getCriticalMultiplier(): number {
        return 1.5;
    }
} 