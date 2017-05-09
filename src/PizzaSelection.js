import React from 'react';

export default class PizzaSelection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIngredients: [],
            pizzas: [],
            ingredients: []
        };
    }

    componentWillMount() {
        fetch('http://localhost:3001/pizzas')
            .then(response => response.json())
            .then(pizzas => this.setState({
                pizzas,
                selectedPizza: pizzas[0]
            }))
            .catch(err => console.error(err));

        fetch('http://localhost:3001/ingredients')
            .then(response => response.json())
            .then(ingredients => this.setState({ingredients}))
            .catch(err => console.error(err));
    }

    updateIngredients(checked, ingredient) {
        const updateState = {};

        if (checked) {
            updateState.selectedIngredients = this.state.selectedIngredients.concat(ingredient);
        } else {
            updateState.selectedIngredients = this.state.selectedIngredients.filter(currentIngredient => currentIngredient !== ingredient);
        }

        this.setState(updateState);
    }

    getTotalPrice() {
        const ingredientsPrice = this.state.selectedIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
        return this.state.selectedPizza.price + ingredientsPrice;
    }

    getSelectedPizzaClassName(pizza) {
        return this.state.selectedPizza && this.state.selectedPizza.name === pizza.name && 'pizza-tile--selected';
    }

    render() {
        return (
            <div id="pizzaSelection">
                <div className="pizza-tiles">
                    {this.state.pizzas.map(pizza => (
                        <div
                            key={pizza.name}
                            className={`pizza-tile ${this.getSelectedPizzaClassName(pizza)}`}
                            onClick={() => this.setState({selectedPizza: pizza})}
                        >
                            <div className="pizza-tile__avatar">
                                {pizza.name.split(' ').map(name => name[0]).join('')}
                            </div>
                            <div className="pizza-tile__content">
                                <h3 className="pizza-tile__title">{pizza.name}</h3>
                                <p className="pizza-tile__description">
                                    {pizza.ingredients.join(', ')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <hr className="pizza-selection-divider"/>
                <div id="pizzaIngredients">
                    {this.state.ingredients.map(ingredient => (
                        <label key={ingredient.name} className="pizza-ingredients__item">
                            <input onChange={event => this.updateIngredients(event.target.checked, ingredient)} value={ingredient.name} type="checkbox"
                            />
                            {` ${ingredient.name} - ${ingredient.price}`}
                        </label>
                    ))}
                </div>
                <hr className="pizza-selection-divider"/>
                {this.state.selectedPizza && this.getTotalPrice()}
                <button className="order-button">Add to Shopping Cart</button>
            </div>
        );
    }
}
