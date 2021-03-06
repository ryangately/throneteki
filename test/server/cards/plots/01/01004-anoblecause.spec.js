/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const cards = require('../../../../../server/game/cards');
const ANobleCause = cards['01004'];

describe('ANobleCause', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['']);
        this.otherPlayerSpy = jasmine.createSpyObj('player2', ['']);
        this.cardSpy = jasmine.createSpyObj('card', ['hasTrait', 'getCost']);

        this.playerSpy.game = this.gameSpy;
        this.otherPlayerSpy.game = this.gameSpy;

        this.plot = new ANobleCause(this.playerSpy, {});

        this.canReduce = this.plot.canReduce(this.playerSpy, this.cardSpy);
    });

    describe('canReduce', function() {
        beforeEach(function() {
            this.canReduce = this.plot.canReduce(this.playerSpy, this.cardSpy);
        });

        describe('and the card is a lord or lady', function() {
            beforeEach(function() {
                this.cardSpy.hasTrait.and.returnValue(true);

                this.canReduce = this.plot.canReduce(this.playerSpy, this.cardSpy);
            });

            it('should return true', function() {
                expect(this.canReduce).toBe(true);
            });

            describe('and the plot has already been used this round', function() {
                beforeEach(function() {
                    this.plot.abilityUsed = true;

                    this.canReduce = this.plot.canReduce(this.playerSpy, this.cardSpy);
                });

                it('should return false', function() {
                    expect(this.canReduce).toBe(false);
                });
            });

            describe('and the player is not my owner', function() {
                beforeEach(function() {
                    this.canReduce = this.plot.canReduce(this.otherPlayerSpy, this.cardSpy);
                });

                it('should return false', function() {
                    expect(this.canReduce).toBe(false);
                });
            });
        });

        describe('and the card and neither a lord nor lady', function() {
            beforeEach(function() {
                this.canReduce = this.plot.canReduce(this.playerSpy, this.cardSpy);
            });

            it('should return false', function() {
                expect(this.canReduce).toBe(false);
            });
        });
    });

    describe('reduce', function() {
        describe('when called for the first time', function() {
            beforeEach(function() {
                this.cost = this.plot.reduce(this.cardSpy, 5, true);
            });

            describe('for a card that costs more than 2', function() {
                beforeEach(function() {
                    this.plot.abilityUsed = false;

                    this.cost = this.plot.reduce(this.cardSpy, 5, true);
                });

                it('should reduce the cost by 2', function() {
                    expect(this.cost).toBe(3);
                });

                it('should flag the ability as being used', function() {
                    expect(this.plot.abilityUsed).toBe(true);
                });
            });

            describe('for a card that costs less than 3', function() {
                beforeEach(function() {
                    this.plot.abilityUsed = false;

                    this.cost = this.plot.reduce(this.cardSpy, 2, true);
                });

                it('should reduce the cost by cost of that card', function() {
                    expect(this.cost).toBe(0);
                });
            });

            describe('and then called again', function() {
                beforeEach(function() {
                    this.cost = this.plot.reduce(this.cardSpy, 2, true);
                });

                it('should not reduce the cost', function() {
                    expect(this.cost).toBe(2);
                });
            });
        });
    });
});
