`maybify` returns an object proxy that wraps existing methods of the object in conditional `maybe*` wrappers.

This can be useful when using a [Builder](https://en.wikipedia.org/wiki/Builder_pattern) design pattern with optional flags.

For example, the following builder:

```javascript
let pizzaBuilder = new PizzaBuilder()
	.addDough()
	.addSauce();
if ( addCheese ) {
	pizzaBuilder = pizzaBuilder.addCheese(10);
}
if ( addPepperoni ) {
	pizzaBuilder = pizzaBuilder.addPepperoni(5);
}
if ( addBacon ) {
	pizzaBuilder = pizzaBuilder.addBacon();
}
const pizza = pizzaBuilder.bake();
```

can be reimplemented with `maybify`:

```javascript
const pizza = maybify(new PizzaBuilder())
	.addDough()
	.addSauce()
	.maybeAddCheese(() => addCheese, 10)
	.maybeAddPepperoni(() => addPepperoni, 5)
	.maybeAddBacon(() => addBacon)
	.bake();
```

Another example is a RethinkDB ReQL query expression builder:

```javascript
return maybify(r.table('users'))
	.filter({ status: 'active' })
	.maybeSlice(() => sliced, begin, end)
	.maybeOrderBy(() => ordered, 'name')
	.run(connection);
```
