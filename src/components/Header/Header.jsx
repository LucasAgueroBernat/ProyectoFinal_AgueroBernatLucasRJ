import { useContext } from 'react'
import Menu from '../Menu/Menu'
import './Header.scss'
import CartWidget from '../CartWidget/CartWidget'

export const Header = () => {
    // const { darkMode, toggleDarkMode } = useContext(DarkModeContext)

    return (
        <header className="header bg-blue-400">
            <div className="header__container">
                
                <h1 className="header__logo">Tejiendo Sueños</h1>
                <CartWidget />
                <Menu />
            </div>
        </header>
    )
}