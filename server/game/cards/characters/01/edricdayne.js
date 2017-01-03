const DrawCard = require('../../../drawcard.js');

class EdricDayne extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseEnded']);
    }

    setupCardAbilities() {
        this.action({
            title: 'Pay 1 gold to give a challenge icon to a character',
            method: 'addIcon'
        });
    }

    addIcon(player) {
        if(this.location !== 'play area' || player.gold <= 0) {
            return false;
        }

        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;        
    }

    onCardSelected(player, card) {
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select icon to add',
                buttons: [
                    { text: 'Military', method: 'iconSelected', arg: 'military' },
                    { text: 'Intrigue', method: 'iconSelected', arg: 'intrigue' },
                    { text: 'Power', method: 'iconSelected', arg: 'power' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        this.selectedCard = card;

        return true;
    }

    iconSelected(player, icon) {
        this.selectedCard.addIcon(icon);
        this.selectedIcon = icon;

        this.game.addMessage('{0} uses {1} to give {2} an {3} icon', player, this, this.selectedCard, icon);

        this.controller.gold--;

        return true;
    }

    onPhaseEnded() {
        if(this.selectedCard) {
            this.selectedCard.removeIcon(this.selectedIcon);
            this.selectedCard = undefined;
        }
    }
}

EdricDayne.code = '01106';

module.exports = EdricDayne;
