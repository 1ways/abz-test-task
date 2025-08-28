import { useState } from 'react'

export default function FloatingInput({ labelText, name, register, error, ...props }) {
    // Implementation of the floating input
    // States
    const [value, setValue] = useState('')
    const [focused, setFocused] = useState(false)

    const isActive = focused || value !== ''

    return (
        <div className={`form-input__wrapper${error ? ' error' : ''}`}>
            <div {...props}>
                <input
                    type="text"
                    {...register(`${name}`, {
                        onBlur: () => setFocused(false),
                        onChange: (e) => setValue(e.target.value)
                    })}
                    onFocus={() => setFocused(true)}
                />
                <p className={`form-input__label${isActive ? ' active' : ''}`}>{labelText}</p>
            </div>
            <p className="form-input__error">{error}</p>
        </div>
    )
}