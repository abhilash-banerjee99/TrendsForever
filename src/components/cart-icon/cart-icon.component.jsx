import React from 'react';
import {connect} from 'react-redux';
import { createStructuredSelector } from 'reselect';


import {toggleCartHidden} from '../../redux/cart/cart.action';
import {selectCartItemsCount} from '../../redux/cart/cart.selector';
//import {ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

import {
    CartContainer,
    ShoppingIcon,
    ItemCountContainer
} from './cart-icon.styles';

const CartIcon = ({toggleCartHidden, itemCount}) => (
    <CartContainer className='cart-icon' onClick={toggleCartHidden}>
        <ShoppingIcon/>
        <ItemCountContainer>{itemCount}</ItemCountContainer>
    </CartContainer>
);

const mapDispatchToProps = dispatch => ({
    toggleCartHidden: () => dispatch(toggleCartHidden())
})

const mapStateToProps = createStructuredSelector({
    itemCount: selectCartItemsCount
})
export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);