import { useEffect } from 'react'
import Button from './Button'
import Card from './Card'
import Preloader from './Preloader'

export default function Cards({ users, currentPage, setCurrentPage, totalPages, getUsers, isLoading }) {
    // Functions
    function handleClick() {
        if (currentPage !== totalPages) {
            const nextPage = currentPage + 1

            // Update currentPage
            setCurrentPage(nextPage)
            // Get other users 
            getUsers(nextPage)
        }
    }

    useEffect(() => {
        getUsers(1)
    }, [])

    return (
        <div className="cards">
            <div className="cards__items">
                {users.map((user, index) => {
                    return (
                        <Card
                            key={index}
                            photo={user.photo}
                            name={user.name}
                            pos={user.position}
                            email={user.email}
                            phone={user.phone}
                        />
                    )
                })}
            </div>
            {isLoading ? (
                <Preloader />
            ) : (
                currentPage !== totalPages && (
                    <Button type="yellow" onClick={handleClick}>Show more</Button>
                )
            )}
        </div >
    )
}