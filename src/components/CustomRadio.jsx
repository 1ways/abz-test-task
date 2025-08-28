export default function CustomRadio({ label, id, name, register, checked }) {
    return (
        <label className="form-radio" htmlFor={id}>
            <input
                id={id}
                type="radio"
                name={name}
                value={id}
                defaultChecked={checked}
                {...register(`${name}`)}
            />
            <span className="form-radio__checkmark"></span>
            {label}
        </label>
    )
}