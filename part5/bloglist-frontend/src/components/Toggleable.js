import { useState, forwardRef, useImperativeHandle } from 'react';

const Toggleable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => setVisible(!visible);

    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    useImperativeHandle(ref, () => ({ toggleVisibility }));

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible} className="togglableContent">
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    );
});

export default Toggleable;