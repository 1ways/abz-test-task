import logo from '../assets/Logo.svg'
import Button from './Button'

export default function Header() {
    return (
        <header className="header">
            <div className="header__container">
                <div className="header__inner">
                    <a className="header__logo" href="#">
                        <img className="header__logo-img" src={logo} alt="Logo" />
                    </a>
                    <div className="header__buttons">
                        <Button tag="a" type="yellow" href="#users-form">Users</Button>
                        <Button tag="a" type="yellow" href="#signup-form">Sign up</Button>
                    </div>
                </div>
            </div>
        </header>
    )
}