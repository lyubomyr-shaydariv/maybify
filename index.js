const isUpperCase = (s) => s === s.toUpperCase();

const lowerCaseFirst = (s) => {
	if ( typeof(s) === 'undefined' ) {
		return s;
	}
	return s.toString().replace(/^(.)(.*)$/g, (_, g1, g2) => g1.toLowerCase() + g2);
};

const isPrefixedWith = (s, prefix) => s.startsWith(prefix) && isUpperCase(s[prefix.length]);

const stripPrefix = (s, prefix) => lowerCaseFirst(s.substr(prefix.length));

const maybify = (object, withF = undefined) => {
	if ( object === undefined ) {
		throw new Error('Cannot maybify undefined');
	}
	return new Proxy(object, {
		get: (target, key, receiver) => {
			const value = target[key];
			switch ( typeof(value) ) {
			case 'object':
			case 'boolean':
			case 'number':
			case 'string':
			case 'symbol':
				return value;
			case 'function':
				return function(...args) {
					return value.apply(this, args);
				};
			case 'undefined':
				if ( isPrefixedWith(key, 'maybe') ) {
					const maybifiedKey = stripPrefix(key, 'maybe');
					const maybifiedValue = target[maybifiedKey];
					if ( !maybifiedValue ) {
						throw new Error(`Cannot find a maybified method for '${maybifiedKey}'`);
					}
					return function(predicate, ...args) {
						if ( !predicate ) {
							throw new Error(`No predicate supplied for '${maybifiedKey}'`);
						}
						const predicateResult = predicate();
						if ( !predicateResult ) {
							return !withF ? this : withF();
						}
						return maybifiedValue.apply(this, args);
					};
				}
				// ... else
				throw new Error(`Cannot resolve '${key}'`);
			default:
				throw new Error(`Cannot handle '${typeof(value)}' of '${key}'`);
			}
		}
	});
};

module.exports = maybify;
