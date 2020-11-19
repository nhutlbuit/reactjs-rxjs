import React, { useLayoutEffect, useState } from 'react';
import shareChanel from '../../chanel/share.chanel';
import './component2.scss';


function Component2() {

    const [message, setMessage] = useState(shareChanel.initialState);

    useLayoutEffect(() => {
        shareChanel.subscribe(setMessage);
      }, []);

    const onChangeMsg = (e: any) => {
        shareChanel.sendMessage(e.target.value);
    };

    return (
        <>
            Enter Value: <input type='text' value= {message.message} onChange={onChangeMsg} />
            <br/>
            Component2 -- show value: {message.message}
        </>
    );
}

export default Component2;
