const expect = require("chai").expect;
const maybify = require('../index.js');

describe("maybify", () => {

	class Builder {
		constructor() { this.string = ''; this.number = 0; }
		withA(a) { this.a = a; return this; }
		withB(b) { this.b = b; return this; }
		withC(c) { this.c = c; return this; }
		toString() { return [this.a, this.b, this.c].join(','); }
	};


	describe('can', () => {

		it('work with the builder pattern implementation', () => {
			const convert = (withA, withB, withC) => maybify(new Builder())
				.withA('foo')
				.withB('bar')
				.withC('baz')
				.maybeWithA(() => withA, 'FOO')
				.maybeWithB(() => withB, 'BAR')
				.maybeWithC(() => withC, 'BAZ')
				.toString();
			expect(convert(false, false, false)).to.equal('foo,bar,baz');
			expect(convert(false, false, true)).to.equal('foo,bar,BAZ');
			expect(convert(false, true, false)).to.equal('foo,BAR,baz');
			expect(convert(false, true, true)).to.equal('foo,BAR,BAZ');
			expect(convert(true, false, false)).to.equal('FOO,bar,baz');
			expect(convert(true, false, true)).to.equal('FOO,bar,BAZ');
			expect(convert(true, true, false)).to.equal('FOO,BAR,baz');
			expect(convert(true, true, true)).to.equal('FOO,BAR,BAZ');
		});

	});

	describe('cannot', () => {

		it('process undefined', () => {
			expect(() => maybify())
				.to.throw('Cannot maybify undefined');
		});

		it('handle not existing methods', () => {
			expect(() => maybify(new Builder()).maybeWithZ(() => true)).to.throw('Cannot find a maybified method for \'withZ\'');
		});

		it('handle not-methods', () => {
			expect(() => maybify(new Builder()).maybeString(() => true)).to.throw('Cannot find a maybified method for \'string\'');
			expect(() => maybify(new Builder()).maybeNumber(() => true)).to.throw('Cannot find a maybified method for \'number\'');
		});

	});

	describe('requires', () => {

		it('predicates for the maybe methods', () => {
			const unit = maybify(new Builder());
			expect(() => unit.maybeWithA()).to.throw('No predicate supplied for \'withA\'');
		});

	});

	describe('ignores', () => {

		it('non-methods', () => {
			const unit = maybify(new Builder());
			expect(unit.string).to.equal('');
			expect(unit.number).to.equal(0);
		});

	});

});
