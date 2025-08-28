import { Tooltip } from 'react-tooltip'
import defaultPhoto from '../assets/photo-cover.svg'

export default function Card({ photo, name, pos, email, phone }) {
    return (
        <div className="card">
            <div className="card__photo">
                <img src={photo ? photo : defaultPhoto} alt={`Photo of ${name} the ${pos}`} />
            </div>
            <p
                className="card__text"
                data-tooltip-id="name-tooltip"
                data-tooltip-content={name}
                data-tooltip-place="bottom"
            >{name}</p>
            <div className="card__details">
                <p
                    className="card__text"
                    data-tooltip-id="pos-tooltip"
                    data-tooltip-content={pos}
                    data-tooltip-place="bottom"
                >{pos}</p>
                <p
                    className="card__text"
                    data-tooltip-id="pos-tooltip"
                    data-tooltip-content={email}
                    data-tooltip-place="bottom"
                >{email}</p>
                <p
                    className="card__text"
                    data-tooltip-id="pos-tooltip"
                    data-tooltip-content={phone}
                    data-tooltip-place="bottom"
                >{phone}</p>
            </div>

            <Tooltip id="name-tooltip" />
            <Tooltip id="pos-tooltip" />
            <Tooltip id="email-tooltip" />
            <Tooltip id="phone-tooltip" />
        </div>
    )
}