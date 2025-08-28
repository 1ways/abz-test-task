export default function Button({ tag = 'button', type, href, children, ...props }) {
    // Render the regular button tag or the link for the navigation
    const Tag = tag

    return (
        <Tag
            className={`btn ${type}`}
            href={tag === 'a' ? href : undefined}
            {...props}
        >
            {children}
        </Tag>
    )
}