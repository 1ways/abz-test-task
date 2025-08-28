import { useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'

export default function FileInput({ control, error }) {
    // States
    const [fileName, setFileName] = useState(null)
    const inputRef = useRef()

    // Functions
    function handleClick(e) {
        e.preventDefault()
        inputRef.current.click()
    }

    return (
        <div className={`form-input__wrapper${error ? ' error' : ''}`}>
            <div className="form-file">
                <button className="form-file__btn" onClick={handleClick}>Upload</button>
                <Controller
                    name="photo"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => {
                        useEffect(() => {
                            setFileName(value?.name || null)
                        }, [value])

                        return (
                            <input
                                {...field}
                                className="form-file__input"
                                type="file"
                                ref={inputRef}
                                value=""
                                onChange={e => {
                                    const file = e.currentTarget.files[0]
                                    setFileName(file?.name || null)
                                    onChange(file || null)
                                }}
                            />
                        )
                    }
                    }
                />
                <div className={`form-file__text${fileName ? ' active' : ''}`}>
                    {fileName ? fileName : "Upload your photo"}
                </div>
            </div>
            <p className="form-input__error">{error ? error : ""}</p>
        </div>
    )
}