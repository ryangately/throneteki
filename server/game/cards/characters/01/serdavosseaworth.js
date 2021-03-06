const DrawCard = require('../../../drawcard.js');

class SerDavosSeaworth extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card) => card === this
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to return {1} to their hand instead of their dead pile', this.controller, this, this);
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

SerDavosSeaworth.code = '01050';

module.exports = SerDavosSeaworth;
