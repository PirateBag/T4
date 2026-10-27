import React, {useLayoutEffect, useRef} from 'react';
import {Button} from '@mui/material';

// MUI Button that shrinks its label's font size when the text is wider than the button allows.
// The button grows with its text up to maxWidth; past that the font scales down (no lower than minFontSize).
export function FitTextButton({children, maxWidth = 160, minFontSize = 9, sx, ...props}) {
    const buttonRef = useRef(null);
    const labelRef = useRef(null);

    useLayoutEffect(() => {
        const button = buttonRef.current;
        const label = labelRef.current;
        if (!button || !label) return;

        const fit = () => {
            // Measure at the theme's normal font size first
            label.style.fontSize = '';
            const style = getComputedStyle(button);
            const available = button.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            const textWidth = label.scrollWidth;
            if (textWidth <= available) return;

            const baseFontSize = parseFloat(style.fontSize);
            // Text width scales roughly linearly with font size
            const fitted = Math.floor(baseFontSize * (available / textWidth) * 10) / 10;
            label.style.fontSize = `${Math.max(minFontSize, fitted)}px`;
        };

        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(button);
        return () => observer.disconnect();
    }, [children, maxWidth, minFontSize]);

    return (
        <Button ref={buttonRef} sx={{maxWidth, ...sx}} {...props}>
            <span ref={labelRef} style={{display: 'block', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {children}
            </span>
        </Button>
    );
}

export default FitTextButton;
