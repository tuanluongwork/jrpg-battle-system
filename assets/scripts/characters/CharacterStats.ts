/**
 * Character stats interface
 */
export interface ICharacterStats {
    level: number;
    hp: number;
    maxHp: number;
    mp: number;
    maxMp: number;
    attack: number;
    defense: number;
    magicAttack: number;
    magicDefense: number;
    speed: number;
    luck: number;
}

/**
 * Character stats implementation
 */
export class CharacterStats implements ICharacterStats {
    level: number = 1;
    hp: number = 100;
    maxHp: number = 100;
    mp: number = 50;
    maxMp: number = 50;
    attack: number = 10;
    defense: number = 8;
    magicAttack: number = 12;
    magicDefense: number = 10;
    speed: number = 10;
    luck: number = 5;
    
    constructor(stats?: Partial<ICharacterStats>) {
        if (stats) {
            Object.assign(this, stats);
        }
    }
    
    /**
     * Calculate damage based on attacker and defender stats
     */
    static calculatePhysicalDamage(attacker: ICharacterStats, defender: ICharacterStats): number {
        const baseDamage = attacker.attack * 2;
        const defense = defender.defense;
        const variance = 0.85 + Math.random() * 0.3; // 85% to 115%
        
        const damage = Math.max(1, Math.floor((baseDamage - defense) * variance));
        return damage;
    }
    
    /**
     * Calculate magic damage
     */
    static calculateMagicDamage(attacker: ICharacterStats, defender: ICharacterStats): number {
        const baseDamage = attacker.magicAttack * 2.5;
        const defense = defender.magicDefense;
        const variance = 0.85 + Math.random() * 0.3;
        
        const damage = Math.max(1, Math.floor((baseDamage - defense) * variance));
        return damage;
    }
    
    /**
     * Calculate healing amount
     */
    static calculateHealing(caster: ICharacterStats, baseAmount: number): number {
        const healingPower = caster.magicAttack * 0.5;
        const variance = 0.9 + Math.random() * 0.2; // 90% to 110%
        
        return Math.floor((baseAmount + healingPower) * variance);
    }
    
    /**
     * Check if character is alive
     */
    isAlive(): boolean {
        return this.hp > 0;
    }
    
    /**
     * Apply damage to character
     */
    takeDamage(damage: number): number {
        const actualDamage = Math.min(damage, this.hp);
        this.hp -= actualDamage;
        return actualDamage;
    }
    
    /**
     * Heal character
     */
    heal(amount: number): number {
        const actualHealing = Math.min(amount, this.maxHp - this.hp);
        this.hp += actualHealing;
        return actualHealing;
    }
    
    /**
     * Use MP
     */
    useMp(amount: number): boolean {
        if (this.mp >= amount) {
            this.mp -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * Restore MP
     */
    restoreMp(amount: number): number {
        const actualRestore = Math.min(amount, this.maxMp - this.mp);
        this.mp += actualRestore;
        return actualRestore;
    }
} 