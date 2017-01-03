const DrawCard = require('../../../drawcard.js');

class TheonGreyjoy extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onUnopposedWin']);
    }

    onUnopposedWin(event, challenge) {
        var winner = challenge.winner;
        if(this.isBlank() || this.controller !== winner || !challenge.isParticipating(this)) {
            return;
        }

        this.game.promptWithMenu(winner, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Gain 1 power', method: 'gainPower' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to perform reactions'
        });
    }

    gainPower(player) {
        this.game.addPower(player, 1);
        this.game.addMessage('{0} uses {1} to gain 1 power for their faction', player, this);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

TheonGreyjoy.code = '01071';

module.exports = TheonGreyjoy;
