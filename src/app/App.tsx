import React from 'react';
import './app.scss';
import Component1 from './component1/component1';
import Component2 from './component2/component2';
import Component3 from './component3/component3';
import Component4 from './component4/component4';
import Component5 from './component5/component5';

const App = () => {

    return (
        <>
            <h1> Chanel - RXJS - REACTJS </h1>
            <div className='grid-container'>

                <div className='item1'>
                    <div><Component1 />  </div>
                </div>
                <div className='item2'>
                    <div><Component2 />  </div>
                </div>
                <div className='item3'> <div><Component3 />  </div></div>
                <div className='item4'> <div><Component4 />  </div></div>
                <div className='item5'> <div><Component5 />  </div></div>
            </div>
        </>
    );
};

export default App;
