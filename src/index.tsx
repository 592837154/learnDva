import React from 'react';
import { Dispatch } from 'redux';
import dva, { connect, RouterAPI } from 'dva';
import { Router, Route } from 'react-router';
import { Link } from 'react-router-dom';
interface Counter1State {
    number: number;
}
type Counter1Props = Counter1State & {
    number: number;
    dispatch: Dispatch<any>;
}
interface Counter2State {
    number: number;
}
type Counter2Props = Counter2State & {
    number: number;
    dispatch: Dispatch<any>;
}
type CombineState = {
    counter1: Counter1State,
    counter2: Counter2State,
}
let app = dva();
const delay = (ms: number) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, ms)
})
app.model({
    namespace: 'counter1',
    state: { number: 0 },
    reducers: {
        increment(state) {
            return {
                number: state.number + 1
            }
        },
        decrement(state) {
            return {
                number: state.number - 1
            }
        }
    },
    effects: {
        *asyncIncrement(action, { call, put }) {
            yield call(delay, 1000);
            yield put({ type: 'increment' });
        }
    },
    subscriptions: {
        changeTitle({ history, dispatch }) {
            history.listen(({ pathname }) => {
                document.title = pathname;

            })
        }
    }
});
app.model({
    namespace: 'counter2',
    state: { number: 0 },
    reducers: {
        increment(state) {
            return {
                number: state.number + 1
            }
        },
        decrement(state) {
            return {
                number: state.number - 1
            }
        }
    }
})

const Counter1 = (props: Counter1Props) => (
    <div>
        <p>{props.number}</p>
        <button onClick={() => props.dispatch({ type: 'counter1/increment' })}>+</button>
        <button onClick={() => props.dispatch({ type: 'counter1/asyncIncrement' })}>asyncIncrement</button>
        <button onClick={() => props.dispatch({ type: 'counter1/decrement' })}>-</button>
    </div>
)
const mapStateToProps1 = (state: CombineState): Counter1State => state.counter1;
const ConnectedCounter1 = connect(mapStateToProps1)(Counter1);
const Counter2 = (props: Counter2Props) => (
    <div>
        <p>{props.number}</p>
        <button onClick={() => props.dispatch({ type: 'counter2/increment' })}>+</button>
        <button onClick={() => props.dispatch({ type: 'counter2/decrement' })}>-</button>
    </div>
)
const mapStateToProps2 = (state: CombineState): Counter2State => state.counter2;
const ConnectedCounter2 = connect(mapStateToProps2)(Counter2);
app.router((api?: RouterAPI) => {
    let { history } = api!;

    return (
        <Router history={history}>
            <>
                <Link to="/counter1">counter1</Link>
                <Link to="/counter2">counter2</Link>
                <Route path="/counter1" component={ConnectedCounter1}></Route>
                <Route path="/counter2" component={ConnectedCounter2}></Route>
            </>
        </Router>
    )
});
app.start('#root');