const DrawCard = require('../../../drawcard.js');

class SansaStark extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeginMarshal', 'onCardPlayed', 'onCharacterKilled']);

        this.lastGold = 0;
    }

    updateStrength() {
        this.strengthModifier = this.controller.deadPile.reduce((count, card) => {
            if(card.getFaction() === 'stark') {
                return count + 1;
            }

            return count;
        }, 0);

        if(this.strengthModifier < 0) {
            this.strengthModifier = 0;
        }

        if(this.strengthModifier === 0) {
            if(!this.addedInsight) {
                this.addKeyword('Insight');
            }
        } else if(this.addedInsight) {
            this.removeKeyword('Insight');
        }
    }

    onBeginMarshal(event, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    onCardPlayed(event, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    onCharacterKilled(event, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    leavesPlay() {
        super.leavesPlay();

        if(this.addedInsight) {
            this.removeKeyword('Insight');
        }
    }
}

SansaStark.code = '03013';

module.exports = SansaStark;
