import { Round } from '../models/round.model';

export const FIRST_ROUND: Round = {
    number: 0,
    roundConditions: {
        canAttackInsideBordering: false,
        canAttackOutsideBordering: false,
        extraAttackArmy: 0,
        extraDefenseArmy: 0,
        playerBlocked: null
    },
    roundType: {
        canAddArmies: true,
        canAttack: false,
        canRegroup: false,
        isFirst: true,
        isSecond: false,
        isThird: false,
        canGetCard: false,
    },
    turn: {
        armiesAdded: false,
        armiesToAdd: {
            afrika: 0,
            asia: 0,
            centralAmerica: 0,
            europe: 0,
            general: 8,
            northAmerica: 0,
            oceania: 0,
            southAmerica: 0
        },
        attacked: false,
        getCard: false,
        player: null,
        regrouped: false,
        conqueredCountries: 0,
    }
}

export const SECOND_ROUND: Round = {
    number: 1,
    roundConditions: {
        canAttackInsideBordering: false,
        canAttackOutsideBordering: false,
        extraAttackArmy: 0,
        extraDefenseArmy: 0,
        playerBlocked: null
    },
    roundType: {
        canAddArmies: true,
        canAttack: false,
        canRegroup: false,
        isFirst: false,
        isSecond: true,
        isThird: false,
        canGetCard: false,
    },
    turn: {
        armiesAdded: false,
        armiesToAdd: {
            afrika: 0,
            asia: 0,
            centralAmerica: 0,
            europe: 0,
            general: 8,
            northAmerica: 0,
            oceania: 0,
            southAmerica: 0
        },
        attacked: false,
        getCard: false,
        player: null,
        regrouped: false,
        conqueredCountries: 0,
    }
};

export const THIRD_ROUND: Round = {
    number: 2,
    roundConditions: {
        canAttackInsideBordering: true,
        canAttackOutsideBordering: true,
        extraAttackArmy: 0,
        extraDefenseArmy: 0,
        playerBlocked: null
    },
    roundType: {
        canAddArmies: false,
        canAttack: true,
        canRegroup: true,
        isFirst: false,
        isSecond: false,
        isThird: true,
        canGetCard: true,
    },
    turn: {
        armiesAdded: true,
        armiesToAdd: {
            afrika: 0,
            asia: 0,
            centralAmerica: 0,
            europe: 0,
            general: 0,
            northAmerica: 0,
            oceania: 0,
            southAmerica: 0
        },
        attacked: false,
        getCard: false,
        player: null,
        regrouped: false,
        conqueredCountries: 0,
    }
}

export const CLASSIC_COMBAT: Round = {
    number: null,
    roundConditions: {
        canAttackInsideBordering: true,
        canAttackOutsideBordering: true,
        extraAttackArmy: 0,
        extraDefenseArmy: 0,
        playerBlocked: null
    },
    roundType: {
        canAddArmies: true,
        canAttack: true,
        canRegroup: true,
        isFirst: false,
        isSecond: false,
        isThird: false,
        canGetCard: true,
    },
    turn: {
        armiesAdded: false,
        armiesToAdd: {
            afrika: 0,
            asia: 0,
            centralAmerica: 0,
            europe: 0,
            general: 0,
            northAmerica: 0,
            oceania: 0,
            southAmerica: 0
        },
        attacked: false,
        getCard: false,
        player: null,
        regrouped: false,
        conqueredCountries: 0,
    }
}