import React, { useContext } from 'react';

const themes = {
    light: {
        foreground: "#000000",
        background: "#eeeeee"
    },
    dark: {
        foreground: "#ffffff",
        background: "#222222"
    }
};

const ThemeContext = React.createContext(themes.light);

function Example(){
    return (
        <ThemeContext.Provider value={themes.dark}>
            <ToolBar></ToolBar>
        </ThemeContext.Provider>
    )
}

function ToolBar(){
    return (
        <div>
            <ThemeButton></ThemeButton>
        </div>
    )
}
function ThemeButton(){
    const theme = useContext(ThemeContext);
    return (
        <button style={{background:theme.background,color:theme.foreground}}>
            styled by theme context
        </button>
    )
}

export default Example